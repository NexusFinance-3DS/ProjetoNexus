# Nexus Finance — aplicativo

Aplicativo Expo com React Native e Expo Router.

## Executar

1. Instale as dependências com `npm install`.
2. Configure `EXPO_PUBLIC_API_URL` no arquivo `.env`, se precisar de outra URL de API. Há um exemplo em `.env.example`.
3. Execute `npm run navegador` para web ou `npm run iniciar` para abrir o Expo.
4. Mantenha o backend em execução em outro terminal.

## Pastas

- `src/app/`: telas e layouts de navegação; os nomes das rotas foram preservados.
- `src/componentes/`: componentes compartilhados, incluindo animações e navegação.
- `src/contextos/`: sessão e tema.
- `src/ganchos/`: hooks do aplicativo.
- `src/servicos/`: chamadas de API, sessão, arquivos, relatórios e validações.
- `src/style/style.js`: estilos compartilhados das telas.
- `src/tema/`: paletas de cores.
- `assets/`: imagens e demais recursos estáticos.

O alias `@/` aponta para `src/`. A documentação detalhada fica em [docs](../docs/ESTRUTURA_PROJETO.md).

## Verificar

- `npm run verificar`: ESLint.
- `npm run compilar`: exportação web para `dist/`.
