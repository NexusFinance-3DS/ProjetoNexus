import assert from 'node:assert/strict';
import test from 'node:test';
import { deslocamentoCampoFocado, sobreposicaoTeclado } from "../componentes/geometriaTeclado.mjs";
const areaVisivel = {
  x: 0,
  y: 90,
  width: 390,
  height: 700
};
const teclado = {
  screenX: 0,
  screenY: 490,
  width: 390,
  height: 310
};
test('overlay keyboard creates enough extra scroll range for the final input', () => {
  const sobreposicao = sobreposicaoTeclado(areaVisivel, teclado);
  const deslocamento = deslocamentoCampoFocado({
    viewport: areaVisivel,
    keyboard: teclado,
    input: {
      y: 710,
      height: 48
    },
    offset: 0
  });
  assert.equal(sobreposicao, 300);
  assert.ok(deslocamento <= sobreposicao);
  assert.equal(710 + 48 - deslocamento, teclado.screenY - 24);
});
test('resized Android viewport does not reserve keyboard height twice', () => {
  const redimensionado = {
    ...areaVisivel,
    height: 400
  };
  assert.equal(sobreposicaoTeclado(redimensionado, teclado), 0);
  assert.equal(deslocamentoCampoFocado({
    viewport: redimensionado,
    keyboard: teclado,
    input: {
      y: 450,
      height: 48
    },
    offset: 120
  }), 152);
});
test('switching to a field above the viewport scrolls back up', () => {
  assert.equal(deslocamentoCampoFocado({
    viewport: areaVisivel,
    keyboard: teclado,
    input: {
      y: 50,
      height: 48
    },
    offset: 180
  }), 128);
});
test('visible fields do not jump when switching inputs', () => {
  assert.equal(deslocamentoCampoFocado({
    viewport: areaVisivel,
    keyboard: teclado,
    input: {
      y: 200,
      height: 48
    },
    offset: 180
  }), 180);
});
test('floating keyboard outside the form does not move its fields', () => {
  assert.equal(sobreposicaoTeclado(areaVisivel, {
    ...teclado,
    screenX: 600
  }), 0);
});
test('closed keyboard removes extra scroll range', () => {
  assert.equal(sobreposicaoTeclado(areaVisivel, null), 0);
  assert.equal(sobreposicaoTeclado(areaVisivel, {
    ...teclado,
    height: 0
  }), 0);
});
