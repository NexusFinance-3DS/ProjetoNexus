import { RowDataPacket } from 'mysql2';
import { bancoDados } from "./bancoDados";
async function migrar() {
  const [colunas] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM recorrencias LIKE 'ultima_geracao'");
  if (!colunas.length) await bancoDados.query('ALTER TABLE recorrencias ADD COLUMN ultima_geracao DATE NULL AFTER data_fim');
}
migrar().catch(falha => {
  console.error(falha);
  process.exitCode = 1;
}).finally(() => bancoDados.end());
