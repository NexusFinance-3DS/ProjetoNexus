import { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import { bancoDados } from "../bancoDados/bancoDados";
export const centavos = (valor: number | string) => Math.round(Number(valor) * 100);
export const diferencaMonetaria = (a: number, b: number) => (centavos(a) - centavos(b)) / 100;
export function periodosMensais(hoje: string) {
  const [ano, mes] = hoje.split('-').map(Number);
  return Array.from({
    length: 6
  }, (_, i) => new Date(Date.UTC(ano, mes - 6 + i, 1)).toISOString().slice(0, 7));
}
export async function resumoFinanceiro(idUsuario: number) {
  const conexao = await bancoDados.getConnection();
  try {
    await conexao.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await conexao.query('START TRANSACTION WITH CONSISTENT SNAPSHOT, READ ONLY');
    const resumo = await lerResumo(conexao, idUsuario);
    await conexao.commit();
    return resumo;
  } catch (falha) {
    await conexao.rollback();
    throw falha;
  } finally {
    conexao.release();
  }
}
async function lerResumo(conexao: PoolConnection, idUsuario: number) {
  // Both queries read the same snapshot, even when a transaction is confirmed concurrently.
  const [[linha]] = await conexao.query<RowDataPacket[]>(`SELECT
    DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS hoje,
    (SELECT COALESCE(SUM(saldo_inicial), 0) FROM contas WHERE id_usuario = ?) AS inicial,
    COALESCE(SUM(CASE WHEN st.nome = 'Confirmada' AND t.data_transacao <= CURDATE()
      THEN IF(tt.nome = 'Receita', t.valor, -t.valor) ELSE 0 END), 0) AS realizado,
    COALESCE(SUM(CASE WHEN (st.nome = 'Pendente' OR t.data_transacao > CURDATE()) AND t.data_transacao <= LAST_DAY(CURDATE())
      THEN IF(tt.nome = 'Receita', t.valor, -t.valor) ELSE 0 END), 0) AS aRealizar
    FROM transacoes t JOIN tipos_transacao tt USING (id_tipo_transacao)
    JOIN status_transacao st USING (id_status_transacao)
    WHERE t.id_usuario = ? AND st.nome <> 'Cancelada'`, [idUsuario, idUsuario]);
  const hoje = String(linha.hoje);
  const [[linhaMetas]] = await conexao.query<RowDataPacket[]>(`SELECT
      COALESCE(SUM(GREATEST(COALESCE(movimentado.atual, 0), 0)), 0) AS reservado
    FROM metas m
    LEFT JOIN (
      SELECT id_meta,
        SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END) AS atual
      FROM movimentacoes_metas
      GROUP BY id_meta
    ) movimentado ON movimentado.id_meta = m.id_meta
    WHERE m.id_usuario = ? AND m.status <> 'cancelada'`, [idUsuario]);
  const [[linhaDespesasPeriodoAnterior]] = await conexao.query<RowDataPacket[]>(`SELECT
      COALESCE(SUM(t.valor), 0) AS total
    FROM transacoes t
    JOIN tipos_transacao tt USING (id_tipo_transacao)
    JOIN status_transacao st USING (id_status_transacao)
    WHERE t.id_usuario = ?
      AND tt.nome = 'Despesa'
      AND st.nome = 'Confirmada'
      AND t.data_transacao >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
      AND t.data_transacao <= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`, [idUsuario]);
  const periodos = periodosMensais(hoje);
  const periodoAtual = periodos[5];
  const [linhas] = await conexao.query<RowDataPacket[]>(`SELECT
    DATE_FORMAT(t.data_transacao, '%Y-%m') AS periodo, tt.nome AS tipo, c.nome AS categoria,
    (st.nome = 'Confirmada' AND t.data_transacao <= ?) AS realizado, SUM(t.valor) AS valor
    FROM transacoes t JOIN tipos_transacao tt USING (id_tipo_transacao)
    JOIN status_transacao st USING (id_status_transacao) JOIN categorias c USING (id_categoria)
    WHERE t.id_usuario = ? AND st.nome <> 'Cancelada' AND t.data_transacao >= ? AND t.data_transacao <= LAST_DAY(?)
    GROUP BY periodo, tt.nome, c.nome, realizado`, [hoje, idUsuario, `${periodos[0]}-01`, hoje]);
  const historico = periodos.map(periodo => ({
    periodo,
    receitas: 0,
    despesas: 0,
    saldo: 0
  }));
  const previsao = {
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0
  };
  const categorias = new Map<string, number>();
  for (const item of linhas) {
    const valor = centavos(item.valor);
    if (item.periodo === periodoAtual) {
      if (item.tipo === 'Receita') previsao.totalReceitas += valor;else previsao.totalDespesas += valor;
    }
    if (!Number(item.realizado)) continue;
    const mes = historico.find(m => m.periodo === item.periodo)!;
    if (item.tipo === 'Receita') mes.receitas += valor;else {
      mes.despesas += valor;
      if (item.periodo === periodoAtual) categorias.set(item.categoria, (categorias.get(item.categoria) || 0) + valor);
    }
  }
  historico.forEach(m => {
    m.saldo = (m.receitas - m.despesas) / 100;
    m.receitas /= 100;
    m.despesas /= 100;
  });
  previsao.saldo = (previsao.totalReceitas - previsao.totalDespesas) / 100;
  previsao.totalReceitas /= 100;
  previsao.totalDespesas /= 100;
  const totais = (i: number) => ({
    totalReceitas: historico[i].receitas,
    totalDespesas: historico[i].despesas,
    saldo: historico[i].saldo
  });
  const atual = totais(5),
    anterior = totais(4);
  const diferenca = diferencaMonetaria(atual.saldo, anterior.saldo);
  const despesasPeriodoAnterior = centavos(linhaDespesasPeriodoAnterior.total) / 100;
  const diferencaDespesas = diferencaMonetaria(atual.totalDespesas, despesasPeriodoAnterior);
  const saldoTotal = (centavos(linha.inicial) + centavos(linha.realizado)) / 100;
  const saldoReservadoMetas = centavos(linhaMetas.reservado) / 100;
  const saldoDisponivel = diferencaMonetaria(saldoTotal, saldoReservadoMetas);
  return {
    dataReferencia: hoje,
    saldoTotal: saldoTotal,
    saldoReservadoMetas: saldoReservadoMetas,
    saldoDisponivel: saldoDisponivel,
    saldoPrevisto: (centavos(saldoDisponivel) + centavos(linha.aRealizar)) / 100,
    atual: atual,
    anterior: anterior,
    previsao: previsao,
    economia: {
      diferenca: diferenca,
      percentual: anterior.saldo === 0 ? null : diferenca / Math.abs(anterior.saldo) * 100
    },
    variacaoDespesas: {
      atual: atual.totalDespesas,
      anterior: despesasPeriodoAnterior,
      diferenca: diferencaDespesas,
      percentual: despesasPeriodoAnterior === 0 ? null : diferencaDespesas / despesasPeriodoAnterior * 100
    },
    categorias: [...categorias].map(([nome, valor]) => ({
      nome,
      valor: valor / 100
    })).sort((a, b) => b.valor - a.valor),
    historico: historico
  };
}
