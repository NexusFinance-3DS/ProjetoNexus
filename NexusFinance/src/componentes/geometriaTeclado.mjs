// All coordinates are measured in window space, including native keyboard frames.
export function sobreposicaoTeclado(areaVisivel, teclado) {
  if (!teclado || teclado.height <= 0) return 0;
  if (teclado.screenX + teclado.width <= areaVisivel.x || teclado.screenX >= areaVisivel.x + areaVisivel.width) return 0;
  return Math.max(0, Math.min(areaVisivel.height, areaVisivel.y + areaVisivel.height - teclado.screenY));
}
export function deslocamentoCampoFocado({
  viewport: areaVisivel,
  input: campo,
  keyboard: teclado,
  offset: deslocamento,
  gap: espaco = 24
}) {
  const inferior = areaVisivel.y + areaVisivel.height - sobreposicaoTeclado(areaVisivel, teclado) - espaco;
  const superior = areaVisivel.y + 12;
  // For a multiline field taller than the visible area, keep its top reachable.
  const comparacao = campo.y + campo.height > inferior ? Math.min(campo.y + campo.height - inferior, campo.y - superior) : Math.min(0, campo.y - superior);
  return Math.max(0, deslocamento + comparacao);
}
