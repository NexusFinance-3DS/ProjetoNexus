let cadastroPendente = null;
let recuperacaoPendente = null;

export function salvarCadastroPendente(dados) {
  cadastroPendente = dados;
}

export function obterCadastroPendente() {
  return cadastroPendente;
}

export function limparCadastroPendente() {
  cadastroPendente = null;
}

export function salvarRecuperacaoPendente(dados) {
  recuperacaoPendente = dados;
}

export function obterRecuperacaoPendente() {
  return recuperacaoPendente;
}

export function limparRecuperacaoPendente() {
  recuperacaoPendente = null;
}
