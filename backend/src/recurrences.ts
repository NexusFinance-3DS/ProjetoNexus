import { RowDataPacket } from 'mysql2';
import { database } from './database';

// Keep the original day as the anchor, including after February and short months.
export function monthlyDate(start: string, offset: number): string {
  const [year, month, day] = start.split('-').map(Number);
  const last = new Date(Date.UTC(year, month + offset, 0));
  return new Date(
    Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), Math.min(day, last.getUTCDate())),
  )
    .toISOString()
    .slice(0, 10);
}

export async function generateRecurrences(userId?: number) {
  const connection = await database.getConnection();
  try {
    await connection.beginTransaction();
    // Lock the cursor with its inserts, so retries and multiple API processes cannot duplicate occurrences.
    const [rules] = await connection.query<RowDataPacket[]>(
      `SELECT r.*,
      DATE_FORMAT(r.data_inicio, '%Y-%m-%d') AS inicio,
      DATE_FORMAT(r.data_fim, '%Y-%m-%d') AS fim,
      DATE_FORMAT(r.ultima_geracao, '%Y-%m-%d') AS ultima,
      DATE_FORMAT(LAST_DAY(CURDATE()), '%Y-%m-%d') AS limite
      FROM recorrencias r WHERE r.ativa = TRUE AND r.frequencia = 'mensal'
      ${userId === undefined ? '' : 'AND r.id_usuario = ?'} ORDER BY r.id_recorrencia FOR UPDATE`,
      userId === undefined ? [] : [userId],
    );
    for (const rule of rules) {
      const limit = rule.fim && rule.fim < rule.limite ? rule.fim : rule.limite;
      const last = rule.ultima || rule.inicio;
      const [y, m] = rule.inicio.split('-').map(Number);
      const [ly, lm] = last.split('-').map(Number);
      for (let offset = Math.max(1, (ly - y) * 12 + lm - m + 1); ; offset++) {
        const date = monthlyDate(rule.inicio, offset);
        if (date > limit) break;
        await connection.execute(
          `INSERT INTO transacoes
          (id_usuario, id_conta, id_categoria, id_tipo_transacao, id_status_transacao, descricao, valor, data_transacao, observacao)
          SELECT t.id_usuario, t.id_conta, t.id_categoria, t.id_tipo_transacao, s.id_status_transacao, t.descricao, t.valor, ?, t.observacao
          FROM transacoes t CROSS JOIN status_transacao s
          WHERE t.id_transacao = ? AND t.id_usuario = ? AND s.nome = 'Pendente'`,
          [date, rule.id_transacao_origem, rule.id_usuario],
        );
        await connection.execute(
          'UPDATE recorrencias SET ultima_geracao = ? WHERE id_recorrencia = ?',
          [date, rule.id_recorrencia],
        );
      }
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
