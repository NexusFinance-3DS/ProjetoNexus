# Alterações de idioma e avisos

Os avisos de cadastro, atualização cadastral, recuperação de senha, receitas, despesas e ajuda usam o componente compartilhado `NexusFinance/componentes/ModalAviso.jsx`. O modal acompanha o tema claro ou escuro e mantém a navegação após a confirmação.

O arquivo `NexusFinance/app/+html.jsx` declara português brasileiro (pt-BR) e desativa a tradução automática. A página Painel financeiro usa a rota /painel.

Arquivos, funções, variáveis locais, cores, estilos e propriedades próprias foram traduzidos. Imports foram atualizados junto com as renomeações. Nomes impostos por React, Expo, React Native, HTTP, MySQL e bibliotecas foram preservados, incluindo o prefixo use dos hooks, arquivos de configuração e variáveis de ambiente existentes. Não é necessário alterar o banco nem as credenciais.

## Comandos

No aplicativo, use `npm run iniciar -- --clear`, `npm run navegador`, `npm run compilar`, `npm run verificar` e `npm run testar`. No backend, use `npm run desenvolver`, `npm run compilar`, `npm run iniciar`, `npm run testar` e `npm run migrar`. Os comandos anteriores também continuam disponíveis.

## Verificações

Compilação web e TypeScript verificadas. Os 11 testes de data, teclado e contraste do aplicativo passaram. Os 4 testes de autenticação do servidor passaram. Cadastro e recuperação de senha foram conferidos no navegador com uma API simulada, sem banco ou envio de e-mails; os modais levaram ao login após confirmação.

Há uma falha anterior no teste financeiro de precisão: o código aceita 1.001 como 1001, mas o teste espera rejeição. Essa falha foi reproduzida no código original e não foi alterada nesta revisão.
