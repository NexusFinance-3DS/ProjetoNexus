# API Nexus Finance

Python 3.12, FastAPI, SQLAlchemy e migrações Alembic. O esquema segue as 17 tabelas do SQL fornecido, mantendo nomes, relacionamentos e valores monetários decimais. Foram acrescentadas tabelas de sessões, controle de tentativas e ocorrências de recorrências.

## Configuração

Siga o README da raiz para executar com MySQL. É possível experimentar localmente com SQLite, definindo `DATABASE_URL=sqlite:///./nexus-dev.db` no .env e executando `python -m nexus.cli init-db`. SQLite é uma alternativa de desenvolvimento; a validação concorrente foi feita em MariaDB.

Execute comandos desta documentação dentro da pasta backend e com o Python da .venv. No Windows, use `.\.venv\Scripts\python.exe` no lugar de `python`.

Variáveis em .env:

| Variável | Uso |
|---|---|
| DATABASE_URL | Conexão MySQL/MariaDB ou SQLite de desenvolvimento |
| ENVIRONMENT | development ou production; production rejeita SQLite |
| CORS_ORIGINS | Lista JSON dos endereços web autorizados, com porta |
| STORAGE_DIR | Pasta privada de anexos, relatórios e mensagens de desenvolvimento |
| TIME_ZONE | Datas financeiras; padrão America/Sao_Paulo |
| SESSION_DAYS | Duração de uma sessão; padrão 7 |
| SMTP_HOST, SMTP_PORT | Servidor de envio de e-mails |
| SMTP_USER, SMTP_PASSWORD | Credenciais do servidor de e-mail |
| SMTP_FROM, SMTP_STARTTLS | Remetente e uso de STARTTLS |

Em desenvolvimento sem SMTP, a recuperação de senha grava uma mensagem .eml em `storage/outbox`, no servidor. Copie o código dessa mensagem para a tela de recuperação. O código não é exposto pela API. Para envio real, configure SMTP. Em produção, configure HTTPS no proxy, credenciais próprias e origens CORS correspondentes ao aplicativo.

`requirements.lock` registra as versões usadas na validação; use como constraints com `-c requirements.lock`. O arquivo inclui dependências de teste, mas instalar apenas `requirements.txt` não instala as ferramentas de teste.

## Banco e migrações

```powershell
python -m nexus.cli init-db
```

O comando aplica migrações incrementais e sementes idempotentes. Ele pode adotar o esquema original já criado e não apaga dados. `database/original.sql` é a cópia de referência do arquivo enviado, não o inicializador da aplicação. Faça backup do banco antes de migrar uma instalação existente.

Senhas novas usam Argon2. Um cadastro antigo com outro formato de senha precisa usar recuperação de senha. Sessões e códigos de recuperação são armazenados como hashes; códigos são temporários e de uso único. O servidor valida propriedade dos recursos em cada operação.

Valores monetários saem da API como strings decimais, evitando arredondamento binário. Transações pendentes/canceladas não entram no saldo confirmado. O saldo da conta inclui seu saldo inicial. Aportes em metas são registros próprios e não criam automaticamente uma despesa na conta.

Retiradas de metas bloqueiam a linha da meta e consultam o saldo com isolamento READ COMMITTED em MySQL/MariaDB, evitando gasto duplicado por solicitações simultâneas. Datas financeiras seguem o fuso configurado; sessões usam UTC.

As recorrências preservam o dia de origem, ajustam fim de mês/ano bissexto e não repetem a mesma ocorrência. O worker processa até 500 ocorrências por usuário em cada rodada e continua nas próximas. Para execução pontual:

```powershell
python -m nexus.cli recorrencias
```

## Rotas

Documentação completa dos campos e respostas em `/docs`; esquema em `/openapi.json`. As rotas de negócio têm prefixo `/api/v1`.

| Grupo | Recursos |
|---|---|
| auth | Cadastro, login, logout, código de recuperação e redefinição |
| usuarios/me | Dados, senha, desativação e avatar |
| enderecos / configuracoes | Endereço e preferências |
| catalogos / contas / categorias | Tipos e cadastros financeiros |
| transacoes | Receitas, despesas, filtros e anexos privados |
| metas | Metas e movimentações |
| recorrencias | Regras e processamento de vencimentos |
| notificacoes | Listagem e marcação de leitura |
| resumo | Saldos, categorias e série mensal |
| relatorios | Geração e download PDF, CSV e XLSX |
| backup | ZIP dos dados e anexos do usuário autenticado |

Use `Authorization: Bearer TOKEN` após login. Relatórios, backups e anexos exigem autenticação. Anexos aceitam PDF/PNG/JPEG até 10 MB; avatar aceita PNG/JPEG até 5 MB. Recuperação de senha e login têm limitação de tentativas persistida.

O backup exportado pelo aplicativo é por usuário. Para recuperar toda a instalação, faça também backup administrativo do MySQL e da pasta `storage`.

## Docker opcional

Configure .env e preencha MYSQL_PASSWORD e MYSQL_ROOT_PASSWORD com senhas diferentes. Para este compose, use senhas longas com letras, números, hífen e sublinhado para evitar caracteres reservados na URL.

```powershell
docker compose up --build -d
```

O compose sobe MySQL 8.4, aplica as migrações e inicia API e worker. Banco e arquivos usam volumes persistentes. Se a porta 3306 estiver ocupada, ajuste o mapeamento no compose. O Dockerfile e o compose foram preparados, mas não executados neste ambiente.

## Testes

```powershell
python -m pip install -r requirements-dev.txt -c requirements.lock
python -m pytest -q
python -m ruff check nexus migrations tests
```

Por padrão, os testes usam bancos SQLite temporários. Os testes MySQL ficam desabilitados sem TEST_MYSQL_URL. Para a suíte com MySQL/MariaDB, use um servidor de teste isolado em localhost:3308 e um usuário autorizado a criar bancos temporários:

```powershell
$env:TEST_MYSQL_URL='mysql+pymysql://USUARIO:SENHA@127.0.0.1:3308/mysql'
python -m pytest -q
```

A suíte cria bancos com nomes aleatórios prefixados nexus_test_ e remove apenas esses bancos ao terminar. Não use credenciais de produção.
