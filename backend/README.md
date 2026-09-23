# Backend do Nexus Finance

API simples em TypeScript para cadastro, login, sessão e recuperação de senha.

## Como executar

1. Inicie o MySQL (no XAMPP, use **Start** no módulo MySQL). Apenas na primeira instalação, importe `../SQL.txt`: esse arquivo apaga e recria o banco, portanto não o execute sobre dados que deseja preservar.
2. Copie `.env.example` para `.env` e ajuste os dados do MySQL e o `JWT_SECRET`.
3. Dentro desta pasta, execute `npm install`, `npm run migrate` e depois `npm run dev`. A migração adiciona o controle de recorrências sem apagar dados; também pode ser executada como `npm run build` seguido de `node dist/migrate.js`.

A API ficará disponível em `http://localhost:3000`.

O backend precisa continuar aberto em um terminal enquanto o aplicativo Expo estiver sendo usado em outro terminal. Para celular físico, copie `../NexusFinance/.env.example` para `../NexusFinance/.env` e troque o IP de exemplo pelo IPv4 do computador.

## Rotas

- `POST /auth/cadastro` — recebe `nome`, `email`, `dataNascimento`, `senha` e `confirmarSenha`.
- `POST /auth/login` — recebe `email` e `senha` e devolve o token JWT.
- `GET /auth/sessao` — recebe o header `Authorization: Bearer TOKEN`.
- `POST /auth/logout` — confirma o logout; o aplicativo deve apagar o token armazenado.
- `POST /auth/recuperar-senha` — recebe `email` e envia um código de 6 dígitos.
- `POST /auth/validar-codigo` — recebe `email` e `codigo`.
- `POST /auth/nova-senha` — recebe `email`, `codigo`, `senha` e `confirmarSenha`.
- `GET /financeiro/resumo` — totais do mês, mês anterior, categorias, histórico e meta ativa.
- `GET /financeiro/transacoes` — lista as transações do usuário autenticado.
- `POST /financeiro/transacoes` — salva receita ou despesa, o tipo de conta, a categoria e um anexo opcional.
- `PATCH /financeiro/transacoes/:id/confirmar` — confirma uma pendência do usuário com data até hoje. Repetir a confirmação não duplica valores; futuras e canceladas retornam 409.
- `GET /financeiro/opcoes?tipo=Receita` (ou `Despesa`) — categorias padrão e pessoais, e tipos de conta do banco.
- `POST /financeiro/categorias` — recebe `tipo` e `nome`; cria uma categoria do usuário ou reutiliza uma já existente.
- `GET /financeiro/anexos/:id` — baixa um anexo somente para o dono da transação.
- `GET/PUT /configuracoes` — consulta/salva `{ "notificacoes": true }`; controla novos avisos financeiros dentro do app.
- `GET/POST /metas` — consulta e cria metas.
- `GET /notificacoes` — consulta as notificações reais do usuário.
- `GET/PUT /usuarios/me` — consulta e atualiza o cadastro do usuário.

Todas as rotas após as rotas de autenticação exigem o header `Authorization: Bearer TOKEN`.

## Recuperação de senha

Se `EMAIL_USER` e `EMAIL_PASSWORD` estiverem configurados, o código será enviado por SMTP. Em desenvolvimento, sem essas variáveis, ele aparece no terminal. O código expira em 15 minutos e é salvo no banco apenas como hash.

## Sessão no aplicativo

O aplicativo já salva o `token` retornado usando `expo-secure-store` no Android/iOS. Ao abrir o app, ele chama `GET /auth/sessao`; no logout, apaga o token do aparelho.

## Contas, categorias e arquivos

O cadastro da transação recebe `tipo`, `valor`, `descricao`, `data`, `categoriaId`, `tipoContaId`, `recorrente`, `status` e `observacao`. Sem arquivo, use JSON. Com arquivo, use multipart/form-data com o campo `arquivo`; o cliente deve deixar o fetch definir o boundary. Aceita um arquivo não vazio de até 10 MiB. O tipo de conta escolhido usa uma conta ativa desse tipo do usuário, criando-a quando necessário.

As categorias personalizadas ficam no MySQL e aparecem apenas para seu dono e para o tipo de transação escolhido. Os arquivos ficam em `backend/uploads/transacoes` (ou em `UPLOAD_DIR`), com os metadados em `anexos_transacao`. Preserve o diretório de arquivos junto com os backups do banco. As tabelas já existem em `SQL.txt`; esta alteração não exige recriar o banco.

## Regras financeiras

- `saldoDisponivel`: saldo inicial de todas as contas mais receitas menos despesas confirmadas com data até hoje, incluindo meses anteriores. Contas inativas preservam seu histórico no patrimônio total.
- `atual` e `anterior`: receitas, despesas e resultado **realizados** de cada mês. O mês atual vai até hoje; a comparação usa o mês anterior completo. `saldo` nesses objetos é o resultado mensal, não o saldo disponível.
- `previsao`: todos os lançamentos não cancelados do mês, realizados e a realizar. `saldoPrevisto`: saldo disponível mais pendências (inclusive atrasadas) e lançamentos futuros até o fim do mês. Valores posteriores ao mês ficam fora dessa previsão.
- Categorias e os seis meses de histórico consideram apenas confirmados até hoje; meses vazios têm zero. Resultado anterior zero retorna percentual `null`, exibido como “Sem base de comparação”.
- Datas financeiras seguem `CURDATE()` do MySQL; configure o fuso do banco para o calendário usado pelo negócio.
- Valores monetários aceitam no máximo duas casas, tanto em JSON numérico quanto em texto. Excesso de precisão é rejeitado com HTTP 400; diferenças são calculadas em centavos.
- Metas só recebem receitas confirmadas, com data até hoje. O valor inicial já igual ou superior ao objetivo cria a meta concluída. A descrição do aporte preserva os 255 caracteres da transação sem acrescentar prefixo.
- Recorrências mensais são processadas na inicialização, a cada hora e antes das consultas de resumo/transações. O processo recupera meses atrasados e gera até o fim do mês atual, respeitando `ativa` e `data_fim`. Os novos lançamentos são pendentes e não repetem aportes em metas nem anexos. Dias 29–31 são ajustados ao último dia de meses curtos, preservando o dia original nos demais meses.
- O cursor `ultima_geracao` e as inserções são gravados na mesma transação com bloqueio da regra, evitando duplicação em tentativas repetidas e processos concorrentes. Execute a migração antes de iniciar esta versão em um banco existente.

## Testes

Para a revisão visual com dados sintéticos, compile o backend e exporte o frontend com `EXPO_PUBLIC_API_URL=http://127.0.0.1:3107` usando `npx expo export --platform web --clear` (limpar o cache garante a atualização da URL). Execute `node scripts/preview-finance.cjs` nesta pasta. A prévia abre em `http://127.0.0.1:8082`, cria somente um banco temporário `nexus_preview_*` e informa as credenciais de teste no terminal. Digite `exit` nesse terminal para encerrar e remover esse banco. Ao terminar, exporte novamente o frontend com a URL habitual da API.

`npm test` executa as validações unitárias. Para testar também com MySQL local, execute no PowerShell `$env:NEXUS_MYSQL_TEST='1'; npm test`. A integração cria e remove somente um banco temporário com prefixo `nexus_test_`, incluindo testes de categoria, conta, upload, isolamento entre usuários e rollback dos arquivos. `npm run build` verifica e compila o TypeScript.

Se aparecer `ECONNREFUSED` na porta 3306, confirme que o MySQL está iniciado e que `DB_HOST`/`DB_PORT` correspondem ao serviço em execução.
