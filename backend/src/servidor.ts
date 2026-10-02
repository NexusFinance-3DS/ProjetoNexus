import { gerarRecorrencias } from "./servicos/recorrencias";
import { aplicativo as app } from "./aplicativo";
import { configuracao } from "./config/configuracao";
import { bancoDados } from "./bancoDados/bancoDados";
async function iniciar(): Promise<void> {
  await bancoDados.query('SELECT 1');
  await gerarRecorrencias();
  let executando = false;
  setInterval(async () => {
    if (executando) return;
    executando = true;
    try {
      await gerarRecorrencias();
    } catch (falha) {
      console.error('Falha ao gerar recorrências:', falha);
    } finally {
      executando = false;
    }
  }, 60 * 60 * 1000).unref();
  app.listen(configuracao.porta, () => {
    console.log(`API Nexus Finance rodando em http://localhost:${configuracao.porta}`);
  });
}
iniciar().catch(falha => {
  console.error('Não foi possível iniciar o backend:', falha);
  process.exit(1);
});
