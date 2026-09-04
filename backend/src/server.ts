import { app } from "./app";
import { config } from "./config";
import { database } from "./database";

async function start(): Promise<void> {
  await database.query("SELECT 1");
  app.listen(config.port, () => {
    console.log(`API Nexus Finance rodando em http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Não foi possível iniciar o backend:", error);
  process.exit(1);
});
