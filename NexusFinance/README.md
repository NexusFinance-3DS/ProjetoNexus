# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Recursos financeiros e verificação

Nas telas de nova receita e despesa, selecione o tipo de conta e uma categoria. A opção **Adicionar nova categoria** salva imediatamente no MySQL e fica disponível para as próximas transações do mesmo tipo. O menu **+ → Categoria** também permite consultar e criar categorias.

É possível anexar um arquivo de até 10 MB, trocar ou remover a seleção antes de salvar. Depois, abra o anexo no **Fluxo financeiro**: no celular, o app oferece o compartilhamento do arquivo; na web, faz o download. Os anexos exigem a sessão do dono da transação.

O relatório exporta PDF no celular e abre a impressão na web para salvar como PDF. **Configurações → Exportar transações (CSV)** exporta os dados do histórico. A preferência de avisos financeiros é salva no banco e controla novas notificações dentro do app. A aparência atual é escura, em português.

Para usar no Expo Go, mantenha o MySQL e o backend iniciados e o celular na mesma rede do computador. Se precisar configurar a API manualmente, veja `.env.example`. Após atualizar as dependências, reinicie o Metro com `npx expo start -c` e recarregue o projeto no Expo Go.

Validação realizada: lint sem erros; exportação dos bundles Android, iOS e web; seis testes de geometria do teclado; testes de integração com MySQL em banco temporário; inclusão de receita e despesa com comprovante pelo navegador e consulta posterior no histórico. A seleção/compartilhamento nativos e o teclado físico do Galaxy A36 precisam ser conferidos no aparelho; a prévia web não simula esses recursos nativos.
