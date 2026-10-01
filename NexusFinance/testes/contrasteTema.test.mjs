import test from 'node:test';
import assert from 'node:assert/strict';
import { paletas } from "../tema/paletas.js";
function luminancia(cor) {
  const valores = cor.slice(1).match(/../g).map(hex => parseInt(hex, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return valores[0] * 0.2126 + valores[1] * 0.7152 + valores[2] * 0.0722;
}
function contraste(a, b) {
  const x = luminancia(a),
    y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
for (const [nome, paleta] of Object.entries(paletas)) {
  test(`${nome}: readable text, placeholders and financial values`, () => {
    for (const corTexto of ["textoPrincipal", "textoSecundario", "textoSuave", "textoLink", "sucesso", "perigo", "textoIndicativo"]) {
      for (const corFundo of ["fundo", "superficie", "campo"]) {
        assert.ok(contraste(paleta[corTexto], paleta[corFundo]) >= 4.5, `${corTexto} on ${corFundo} needs contrast >= 4.5 in ${nome}`);
      }
    }
  });
  test(`${nome}: filled buttons retain readable labels`, () => {
    for (const corFundo of ["primaria", "primariaIntensa", "primariaEscura"]) assert.ok(contraste(paleta.sobrePrimaria, paleta[corFundo]) >= 4.5);
  });
}
