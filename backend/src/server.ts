import { generateRecurrences } from './recurrences';
import { app } from './app';
import { config } from './config';
import { database } from './database';

async function start(): Promise<void> {
  await database.query('SELECT 1');
  await generateRecurrences();
  let running = false;
  setInterval(
    async () => {
      if (running) return;
      running = true;
      try {
        await generateRecurrences();
      } catch (error) {
        console.error('Falha ao gerar recorrências:', error);
      } finally {
        running = false;
      }
    },
    60 * 60 * 1000,
  ).unref();
  app.listen(config.port, () => {
    console.log(`API Nexus Finance rodando em http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Não foi possível iniciar o backend:', error);
  process.exit(1);
});
