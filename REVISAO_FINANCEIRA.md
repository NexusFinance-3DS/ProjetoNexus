# Revisão funcional — 22/09/2026

## Resultado

Os fluxos financeiros revisados passaram nos testes automatizados e nas verificações web descritas abaixo. A página inicial agora inclui o resumo realizado/previsto, evolução dos seis meses e gastos por categoria, usando os mesmos componentes do dashboard.

## Correções desta revisão

- Pendências podem ser marcadas como pagas/recebidas no fluxo financeiro. A API verifica o proprietário, bloqueia canceladas e futuras e permite repetir uma confirmação sem duplicar o valor.
- O fluxo mostra o status e identifica lançamentos futuros. A criação de receita permite escolher recebida ou pendente; receitas pendentes não habilitam envio para meta.
- O resumo lê saldo e totais no mesmo snapshot do banco, evitando divergências durante uma confirmação concorrente.
- As categorias usam a participação nas despesas, inclusive quando não há receita no mês.
- A ocultação de valores no início cobre resumo, indicadores, gráficos e progresso monetário da meta.
- Início e dashboard distinguem carregamento, erro com nova tentativa e ausência de movimentações.
- Metas mostram seu status, limitam nomes a 150 caracteres e bloqueiam envio duplicado durante o salvamento.
- Relatórios usam o período de referência do backend, somam em centavos e identificam o resultado do período sem confundi-lo com saldo acumulado.
- Removido o indicador de notificação não lida que aparecia sempre, sem consultar notificações.

## Validação executada

- Backend: build TypeScript e 23 testes aprovados, incluindo integração com MySQL isolado.
- Frontend: exportação web aprovada; lint sem erros ou avisos.
- Navegador com contas sintéticas: login, início com dados, ocultar/mostrar valores, fluxo, confirmação de despesa pendente e atualização do saldo ao voltar ao início.
- Atalhos do início para dashboard e relatórios conferidos.
- Layout conferido em tela ampla e viewport de 390 × 844, nos temas claro e escuro.
- Conta sem movimentações: seis meses com zero, comparação sem base e mensagens de ausência de categorias/metas. Nenhum erro registrado no console durante a verificação.
- Nenhuma conta real foi usada ou alterada nos testes de interface.

## Pendência identificada

`NexusFinance/app/receita/editarReceita.jsx` e `NexusFinance/app/despesa/editarDespesa.jsx` continuam vazios, embora registrados nas rotas. Edição completa de receitas/despesas não está implementada; a confirmação de pendências adicionada nesta revisão é uma operação separada.

## Limites da revisão

A verificação prática abrangeu os fluxos financeiros acima na versão web. Não equivale a homologação de todos os recursos do aplicativo nem a teste em aparelhos Android/iOS; recuperação de senha por e-mail e impressão/compartilhamento nativos não foram exercitados nesta revisão.
