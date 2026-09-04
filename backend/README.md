# Backend do Nexus Finance

API simples em TypeScript para cadastro, login, sessão e recuperação de senha.

## Como executar

1. Instale o MySQL e execute o arquivo `../SQL.txt`.
2. Copie `.env.example` para `.env` e ajuste os dados do MySQL e o `JWT_SECRET`.
3. Dentro desta pasta, execute `npm install` e depois `npm run dev`.

A API ficará disponível em `http://localhost:3000`.

O backend precisa continuar aberto em um terminal enquanto o aplicativo Expo estiver sendo usado em outro terminal. Para celular físico, copie `../NexusFinance/.env.example` para `../NexusFinance/.env` e troque o IP de exemplo pelo IPv4 do computador.

## Rotas

- `POST /auth/cadastro` — recebe `nome`, `email`, `cpf`, `dataNascimento`, `senha` e `confirmarSenha`.
- `POST /auth/login` — recebe `email` e `senha` e devolve o token JWT.
- `GET /auth/sessao` — recebe o header `Authorization: Bearer TOKEN`.
- `POST /auth/logout` — confirma o logout; o aplicativo deve apagar o token armazenado.
- `POST /auth/recuperar-senha` — recebe `email` e envia um código de 6 dígitos.
- `POST /auth/validar-codigo` — recebe `email` e `codigo`.
- `POST /auth/nova-senha` — recebe `email`, `codigo`, `senha` e `confirmarSenha`.
- `GET /financeiro/resumo` — totais do mês, mês anterior, categorias, histórico e meta ativa.
- `GET /financeiro/transacoes` — lista as transações do usuário autenticado.
- `POST /financeiro/transacoes` — salva receita ou despesa e gera uma notificação.
- `GET/POST /metas` — consulta e cria metas.
- `GET /notificacoes` — consulta as notificações reais do usuário.
- `GET/PUT /usuarios/me` — consulta e atualiza o cadastro do usuário.

Todas as rotas após as rotas de autenticação exigem o header `Authorization: Bearer TOKEN`.

## Recuperação de senha

Se `EMAIL_USER` e `EMAIL_PASSWORD` estiverem configurados, o código será enviado por SMTP. Em desenvolvimento, sem essas variáveis, ele aparece no terminal. O código expira em 15 minutos e é salvo no banco apenas como hash.

## Sessão no aplicativo

O aplicativo já salva o `token` retornado usando `expo-secure-store` no Android/iOS. Ao abrir o app, ele chama `GET /auth/sessao`; no logout, apaga o token do aparelho.
