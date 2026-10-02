# Projeto Nexus Finance

Sistema de gerenciamento financeiro pessoal desenvolvido como Trabalho de Conclusão de Curso (TCC).

## Organização

- [NexusFinance](NexusFinance/README.md): aplicativo Expo para web, Android e iOS.
- [backend](backend/README.md): API Express em TypeScript.
- [bancoDados](bancoDados/): estrutura SQL e dados de teste.
- [docs](docs/ESTRUTURA_PROJETO.md): estrutura do projeto e documentação técnica.

## Executar

Abra dois terminais. No primeiro, entre em `backend`, configure o arquivo `.env` e execute `npm install`, `npm run migrar` e `npm run desenvolver`. No segundo, entre em `NexusFinance` e execute `npm install` e `npm run navegador`.

Na primeira instalação do banco, importe `bancoDados/estrutura.sql`. Esse script apaga e recria o banco; para uma instalação existente, use a migração indicada no README do backend.

## Verificar

- Frontend: `npm run verificar` e `npm run compilar` dentro de `NexusFinance`.
- Backend: `npm run compilar` dentro de `backend`.
