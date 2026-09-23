import { RowDataPacket } from 'mysql2';
import { database } from './database';

async function migrate() {
  const [columns] = await database.query<RowDataPacket[]>(
    "SHOW COLUMNS FROM recorrencias LIKE 'ultima_geracao'",
  );
  if (!columns.length)
    await database.query(
      'ALTER TABLE recorrencias ADD COLUMN ultima_geracao DATE NULL AFTER data_fim',
    );
}
migrate()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => database.end());
