# Documentação: Funcionalidades do Projeto NexusFinance

Documento rápido explicando, de forma básica, cada funcionalidade e onde ela fica no código.

**Visão Geral**
- **Propósito**: App de finanças pessoais com telas para transações, metas, relatórios e perfil.
- **Estrutura principal**: pasta `app/` contém telas organizadas por rota e subpastas (`auth/`, `receita/`, `despesa/`, `(tabs)/`, `menus/`).

**Telas Principais (abas)**
- **Início**: `NexusFinance/app/(tabs)/inicial.jsx` — Tela principal com perfil resumido, saldo atual, cards de Visão Rápida (Receitas, Despesas, Economia), progresso de metas e card de Distribuição da renda (agora mostrando dados do mês anterior). Também contém a barra de navegação inferior e menu expandido.
- **Fluxo Financeiro**: `NexusFinance/app/(tabs)/fluxoFinanceiro.jsx` — Lista de transações (Receitas/Despesas), filtros por aba (Geral/Receitas/Despesas), cálculo de totais (receitas, despesas e saldo) e exibição detalhada de cada lançamento.
- **Dashboard**: `NexusFinance/app/(tabs)/dashboard.jsx` — Visualizações gráficas (pie/line) por categoria e evolução do saldo; resumo mensal com percentuais visuais.
- **Relatórios**: `NexusFinance/app/(tabs)/relatorios.jsx` — Gráfico de barras Receitas x Despesas por período e resumo com opções de exportar/compartilhar.
- **Metas**: `NexusFinance/app/(tabs)/metas.jsx` — Gerenciamento de metas financeiras: progresso, listagem e navegação para criação/edição.
- **Perfil**: `NexusFinance/app/(tabs)/perfil.jsx` — Dados do usuário, resumo da conta (saldo, receitas, despesas, economia) e links para configurações e relatórios.
- **Notificações**: `NexusFinance/app/(tabs)/notificacoes.jsx` — Lista de notificações (título, descrição, hora) com indicador de não lidas.

**Autenticação / Onboarding**
- `NexusFinance/app/auth/*` — Conjunto de telas para fluxo de autenticação: boas-vindas, cadastro, login, criação/recuperação de senha.

**Lançamentos (Receitas e Despesas)**
- **Criar/Editar Receita**: `NexusFinance/app/receita/novaReceita.jsx`, `NexusFinance/app/receita/editarReceita.jsx` — Formulários para registrar/editar receitas (valor, categoria, data, descrição).
- **Criar/Editar Despesa**: `NexusFinance/app/despesa/novaDespesa.jsx`, `NexusFinance/app/despesa/editarDespesa.jsx` — Formulários para registrar/editar despesas.

**Menus e Páginas auxiliares**
- `NexusFinance/app/menus/*` — Páginas estáticas como Central de Ajuda, Sobre o App, Meu Cadastro.
- `NexusFinance/app/(tabs)/configuracoes.jsx` — Configurações do aplicativo.

**Dados e utilitários**
- `NexusFinance/app/data/financeData.js` — Fonte de exemplo para transações e utilitários:
  - `transacoes`: lista de lançamentos de exemplo;
  - `getTotals()`: soma receitas/despesas e retorna saldo;
  - `getPreviousTotals()`: helper simples para simular mês anterior (pode ser substituído por histórico real);
  - `getEconomiaComparison()`: calcula diferença e % entre economia atual e anterior;
  - `formatBRL()`: formata valores em real (pt-BR).

**Layout / Navegação**
- `_layout.jsx` e `index.jsx` (na raiz `app/`) configuram a navegação e o ponto de entrada do app.

**Estilos**
- `NexusFinance/app/styles/` — Contém arquivos de estilo por tela (ex.: `inicio.js`, `barraNavegacao.js`, `fluxoFinanceiro.js`, etc.). A `barraNavegacao.js` contém estilos para a barra inferior, overlay e menu expandido.

**Comportamentos importantes**
- **Unificação de valores**: várias telas agora usam `app/data/financeData.js` para garantir que totais (receitas, despesas, saldo) sejam coerentes entre telas.
- **Menu expandido**: a barra de navegação inferior possui um menu central (`+`) para criar lançamentos e um botão `mais` que abre o botão Dashboard; ambos usam overlay que fecha ao tocar fora.
- **Economia comparativa**: o card de Economia exibe não só o valor guardado no mês atual, mas também a variação (valor e %) em relação ao mês anterior.

**Sugestões / próximos passos**
- Derivar o mês anterior a partir das datas das transações reais em `transacoes` ao invés da heurística atual em `getPreviousTotals()`.
- Extrair strings fixas e textos para um arquivo de i18n se quiser suporte a múltiplos idiomas.
- Mover `transacoes` de dados de exemplo para um backend/local storage para persistência.
