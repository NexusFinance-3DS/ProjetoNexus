// Accept typing/pasting eight digits or an existing API date, without a date picker.
export function formatarEntradaData(valor) {
  const texto = String(valor || '');
  const formatoIso = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (formatoIso) return `${formatoIso[3]}/${formatoIso[2]}/${formatoIso[1]}`;
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  return [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4)].filter(Boolean).join('/');
}
