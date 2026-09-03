# Nexus Finance — aplicativo e back-end Python

O projeto contém o aplicativo Expo/React Native em `NexusFinance` e a API Python/FastAPI em `backend`. Abra esta pasta inteira no VS Code.

## Rodar no Windows / VS Code

Instale Python 3.12+, Node.js e MySQL 8.0.16+ (ou MariaDB com suporte a CHECK). O servidor do banco precisa estar iniciado; o Workbench sozinho não inicia um servidor.

No MySQL, crie o banco **somente se ainda não existir**:

```sql
CREATE DATABASE IF NOT EXISTS nexus_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

No primeiro terminal PowerShell:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt -c requirements.lock
Copy-Item .env.example .env
```

Edite `backend/.env`, ajustando `DATABASE_URL` para o usuário, senha, endereço e porta do seu MySQL. A senha na URL deve estar codificada se contiver caracteres especiais. Exemplo para MySQL local com usuário nexus:

```dotenv
DATABASE_URL=mysql+pymysql://nexus:SUA_SENHA@localhost:3306/nexus_finance?charset=utf8mb4
```

Depois, ainda no primeiro terminal:

```powershell
.\.venv\Scripts\python.exe -m nexus.cli init-db
.\.venv\Scripts\python.exe -m uvicorn nexus.main:app --host 0.0.0.0 --port 8000 --reload
```

As migrações criam ou complementam as tabelas. Se o SQL original já foi importado, os dados são preservados. **Não execute novamente o SQL original em um banco com dados: ele começa com DROP DATABASE.**

No segundo terminal, partindo da pasta raiz:

```powershell
cd NexusFinance
npm ci
npm run web
```

Abra o endereço mostrado pelo Expo, normalmente http://localhost:8081. Crie uma conta pela tela inicial. Não há usuário ou saldo fictício predefinido.

Documentação interativa da API: http://localhost:8000/docs
Saúde da API: http://localhost:8000/health

## Celular e recorrências

Para celular, use `npx expo start`. Deixe computador e aparelho na mesma rede. Copie `NexusFinance/.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL=http://IP_DO_COMPUTADOR:8000/api/v1`. Reinicie o Expo após alterar o arquivo. No emulador Android, normalmente o endereço do computador é `10.0.2.2`. A porta 8000 precisa estar acessível pela rede local.

Para gerar lançamentos recorrentes automaticamente, mantenha um terceiro terminal aberto dentro de `backend`:

```powershell
.\.venv\Scripts\python.exe -m nexus.cli worker
```

Também é possível processar vencimentos pela tela Recorrências. Os lançamentos gerados começam pendentes.

## Funcionalidades

- Cadastro, login, sessões revogáveis, recuperação e alteração de senha.
- Perfil, endereço, preferências, contas e categorias.
- Receitas e despesas com edição, cancelamento, filtros, status e anexos.
- Metas com aportes, retiradas e controle de saldo.
- Recorrências, notificações, dashboard e resumos com dados do banco.
- Relatórios PDF, CSV e XLSX; backup privado por usuário.

As cores e os estilos continuam centralizados em `NexusFinance/src/styles.js`. Os formulários usam os componentes de teclado do aplicativo.

Consulte [backend/README.md](backend/README.md) para configuração de e-mail, Docker, testes e detalhes das regras.

## Validação realizada

15 testes passaram em uma instância MariaDB 10.4 isolada, incluindo adoção do SQL original, acesso entre usuários, senha, relatórios e duas retiradas simultâneas de uma meta. Exportações Expo para Android, iOS e web e análise estática foram verificadas. Também foi conferido no navegador o cadastro e a persistência de lançamentos. As exportações nativas não substituem um teste em aparelho físico.
