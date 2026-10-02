# Documentação: Funcionalidades do Projeto NexusFinance

Documento rápido explicando, de forma básica, cada funcionalidade e onde ela fica no código.

**Visão Geral**

- **Propósito**: App de finanças pessoais com telas para transações, metas, relatórios e perfil.
- **Estrutura principal**: pasta `src/app/` contém telas organizadas por rota e subpastas (`auth/`, `receita/`, `despesa/`, `(tabs)/`, `menus/`).

**Telas Principais (abas)**

- **Início**: `NexusFinance/src/app/(tabs)/inicial.jsx` — Tela principal com perfil resumido, saldo atual, cards de Visão Rápida (Receitas, Despesas, Economia), progresso de metas e card de Distribuição da renda (agora mostrando dados do mês anterior). Também contém a barra de navegação inferior e menu expandido.
- **Fluxo Financeiro**: `NexusFinance/src/app/(tabs)/fluxoFinanceiro.jsx` — Lista de transações (Receitas/Despesas), filtros por aba (Geral/Receitas/Despesas), cálculo de totais (receitas, despesas e saldo) e exibição detalhada de cada lançamento.
- **Painel financeiro**: `NexusFinance/src/app/(tabs)/painel.jsx` — Visualizações gráficas (pie/line) por categoria e evolução do saldo; resumo mensal com percentuais visuais.
- **Relatórios**: `NexusFinance/src/app/(tabs)/relatorios.jsx` — Gráfico de barras Receitas x Despesas por período e resumo com opções de exportar/compartilhar.
- **Metas**: `NexusFinance/src/app/(tabs)/metas.jsx` — Gerenciamento de metas financeiras: progresso, listagem e navegação para criação/edição.
- **Perfil**: `NexusFinance/src/app/(tabs)/perfil.jsx` — Dados do usuário, resumo da conta (saldo, receitas, despesas, economia) e links para configurações e relatórios.
- **Notificações**: `NexusFinance/src/app/(tabs)/notificacoes.jsx` — Lista de notificações (título, descrição, hora) com indicador de não lidas.

**Autenticação / Onboarding**

- `NexusFinance/src/app/auth/*` — Conjunto de telas para fluxo de autenticação: boas-vindas, cadastro, login, criação/recuperação de senha.

**Lançamentos (Receitas e Despesas)**

- **Criar/Editar Receita**: `NexusFinance/src/app/receita/novaReceita.jsx`, `NexusFinance/src/app/receita/editarReceita.jsx` — Formulários para registrar/editar receitas (valor, categoria, data, descrição).
- **Criar/Editar Despesa**: `NexusFinance/src/app/despesa/novaDespesa.jsx`, `NexusFinance/src/app/despesa/editarDespesa.jsx` — Formulários para registrar/editar despesas.

**Menus e Páginas auxiliares**

- `NexusFinance/src/app/menus/*` — Páginas estáticas como Central de Ajuda, Sobre o App, Meu Cadastro.
- `NexusFinance/src/app/(tabs)/configuracoes.jsx` — Configurações do aplicativo.

**Dados e utilitários**

- `NexusFinance/src/servicos/financeiro.js` — comunicação autenticada com o backend e formatação de valores/datas.
- `NexusFinance/ganchos/useResumoFinanceiro.js` — carrega do MySQL os totais, categorias, histórico e meta do usuário.
- Os dados financeiros não são mais definidos dentro do aplicativo.

**Layout / Navegação**

- `_layout.jsx` e `index.jsx` (na raiz `src/app/`) configuram a navegação e o ponto de entrada do app.

**Estilos**

- `NexusFinance/src/style/style.js` — Centraliza os estilos compartilhados das telas. As paletas ficam em `NexusFinance/src/tema/paletas.js`.

**Comportamentos importantes**

- **Unificação de valores**: as telas usam os mesmos endpoints do backend para manter receitas, despesas, saldo, metas e gráficos coerentes.
- **Menu expandido**: a barra de navegação inferior possui um menu central (`+`) para criar lançamentos e um botão `mais` que abre o botão Painel financeiro; ambos usam overlay que fecha ao tocar fora.
- **Economia comparativa**: o card de Economia exibe não só o valor guardado no mês atual, mas também a variação (valor e %) em relação ao mês anterior.

**Sugestões / próximos passos**

- Extrair strings fixas e textos para um arquivo de i18n se quiser suporte a múltiplos idiomas.
