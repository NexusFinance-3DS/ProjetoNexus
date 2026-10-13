import { RowDataPacket } from 'mysql2';
import { bancoDados } from "./bancoDados";
async function migrar() {
  const [colunas] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM recorrencias LIKE 'ultima_geracao'");
  if (!colunas.length) await bancoDados.query('ALTER TABLE recorrencias ADD COLUMN ultima_geracao DATE NULL AFTER data_fim');
  const [parcelaAtual] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM transacoes LIKE 'parcela_atual'");
  if (!parcelaAtual.length) await bancoDados.query('ALTER TABLE transacoes ADD COLUMN parcela_atual TINYINT UNSIGNED NULL');
  const [totalParcelas] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM transacoes LIKE 'total_parcelas'");
  if (!totalParcelas.length) await bancoDados.query('ALTER TABLE transacoes ADD COLUMN total_parcelas TINYINT UNSIGNED NULL');
}
migrar().catch(falha => {
  console.error(falha);
  process.exitCode = 1;
}).finally(() => bancoDados.end());
