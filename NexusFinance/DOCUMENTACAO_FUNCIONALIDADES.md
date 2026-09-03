# Funcionalidades e organização

- `app/auth`: cadastro, login e recuperação de senha conectados à API.
- `app/(tabs)`: início, fluxo financeiro, dashboard, metas, perfil, notificações, configurações e relatórios.
- `src/data/Session.jsx`: autenticação; SecureStore no aplicativo e sessionStorage no navegador.
- `src/data/Finance.jsx`: carregamento e atualização dos dados reais da API.
- `src/api`: requisições autenticadas, anexos e downloads.
- `src/components/TransactionForm.jsx`: formulário compartilhado de receitas e despesas.
- `src/components/ResourceManager.jsx`: cadastro de contas e categorias.
- `src/components/KeyboardForm.jsx`: tratamento de formulários e teclado.
- `src/styles.js`: estilos centralizados.
- `../backend/nexus`: regras de negócio, segurança, relatórios e rotas.
- `../backend/migrations`: evolução do banco fornecido.

Contas novas começam sem transações fictícias. Resumos, histórico e comparação mensal usam registros do banco. Cancelamentos preservam o histórico financeiro. As metas possuem movimentações próprias, sem débito automático nas contas.

Ajuda e Sobre mantêm os conteúdos institucionais do projeto original; os botões de contato ainda dependem da definição de um canal de suporte. A preferência de tema é persistida, mantendo o design atual; não foi criado um segundo tema.

Consulte o README na raiz para instalação, execução e configuração de e-mail.
