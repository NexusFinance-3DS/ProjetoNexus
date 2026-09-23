import { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import { database } from './database';

export const cents = (value: number | string) => Math.round(Number(value) * 100);
export const moneyDifference = (a: number, b: number) => (cents(a) - cents(b)) / 100;

export function monthPeriods(today: string) {
  const [year, month] = today.split('-').map(Number);
  return Array.from({ length: 6 }, (_, i) =>
    new Date(Date.UTC(year, month - 6 + i, 1)).toISOString().slice(0, 7),
  );
}

export async function financialSummary(userId: number) {
  const connection = await database.getConnection();
  try {
    await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await connection.query('START TRANSACTION WITH CONSISTENT SNAPSHOT, READ ONLY');
    const summary = await readSummary(connection, userId);
    await connection.commit();
    return summary;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function readSummary(connection: PoolConnection, userId: number) {
  // Both queries read the same snapshot, even when a transaction is confirmed concurrently.
  const [[row]] = await connection.query<RowDataPacket[]>(
    `SELECT
    DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS hoje,
    (SELECT COALESCE(SUM(saldo_inicial), 0) FROM contas WHERE id_usuario = ?) AS inicial,
    COALESCE(SUM(CASE WHEN st.nome = 'Confirmada' AND t.data_transacao <= CURDATE()
      THEN IF(tt.nome = 'Receita', t.valor, -t.valor) ELSE 0 END), 0) AS realizado,
    COALESCE(SUM(CASE WHEN (st.nome = 'Pendente' OR t.data_transacao > CURDATE()) AND t.data_transacao <= LAST_DAY(CURDATE())
      THEN IF(tt.nome = 'Receita', t.valor, -t.valor) ELSE 0 END), 0) AS aRealizar
    FROM transacoes t JOIN tipos_transacao tt USING (id_tipo_transacao)
    JOIN status_transacao st USING (id_status_transacao)
    WHERE t.id_usuario = ? AND st.nome <> 'Cancelada'`,
    [userId, userId],
  );
  const today = String(row.hoje);
  const periods = monthPeriods(today);
  const currentPeriod = periods[5];
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT
    DATE_FORMAT(t.data_transacao, '%Y-%m') AS periodo, tt.nome AS tipo, c.nome AS categoria,
    (st.nome = 'Confirmada' AND t.data_transacao <= ?) AS realizado, SUM(t.valor) AS valor
    FROM transacoes t JOIN tipos_transacao tt USING (id_tipo_transacao)
    JOIN status_transacao st USING (id_status_transacao) JOIN categorias c USING (id_categoria)
    WHERE t.id_usuario = ? AND st.nome <> 'Cancelada' AND t.data_transacao >= ? AND t.data_transacao <= LAST_DAY(?)
    GROUP BY periodo, tt.nome, c.nome, realizado`,
    [today, userId, `${periods[0]}-01`, today],
  );
  const history = periods.map((periodo) => ({ periodo, receitas: 0, despesas: 0, saldo: 0 }));
  const forecast = { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  const categories = new Map<string, number>();
  for (const item of rows) {
    const value = cents(item.valor);
    if (item.periodo === currentPeriod) {
      if (item.tipo === 'Receita') forecast.totalReceitas += value;
      else forecast.totalDespesas += value;
    }
    if (!Number(item.realizado)) continue;
    const month = history.find((m) => m.periodo === item.periodo)!;
    if (item.tipo === 'Receita') month.receitas += value;
    else {
      month.despesas += value;
      if (item.periodo === currentPeriod)
        categories.set(item.categoria, (categories.get(item.categoria) || 0) + value);
    }
  }
  history.forEach((m) => {
    m.saldo = (m.receitas - m.despesas) / 100;
    m.receitas /= 100;
    m.despesas /= 100;
  });
  forecast.saldo = (forecast.totalReceitas - forecast.totalDespesas) / 100;
  forecast.totalReceitas /= 100;
  forecast.totalDespesas /= 100;
  const totals = (i: number) => ({
    totalReceitas: history[i].receitas,
    totalDespesas: history[i].despesas,
    saldo: history[i].saldo,
  });
  const current = totals(5),
    previous = totals(4);
  const difference = moneyDifference(current.saldo, previous.saldo);
  const available = (cents(row.inicial) + cents(row.realizado)) / 100;
  return {
    dataReferencia: today,
    saldoDisponivel: available,
    saldoPrevisto: (cents(available) + cents(row.aRealizar)) / 100,
    atual: current,
    anterior: previous,
    previsao: forecast,
    economia: {
      diferenca: difference,
      percentual: previous.saldo === 0 ? null : (difference / Math.abs(previous.saldo)) * 100,
    },
    categorias: [...categories]
      .map(([nome, valor]) => ({ nome, valor: valor / 100 }))
      .sort((a, b) => b.valor - a.valor),
    historico: history,
  };
}
