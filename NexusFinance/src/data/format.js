export const formatBRL = value => Number(value || 0).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
export function moneyInput(value) {
  const text = String(value).replace(/R\$|\s/g, '');
  const normalized = text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : text;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error('Informe um valor válido, com até duas casas decimais.');
  return normalized;
}
export function isoDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) throw new Error('Use a data no formato DD/MM/AAAA.');
  return `${match[3]}-${match[2]}-${match[1]}`;
}
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const displayDate = value => value ? value.split('-').reverse().join('/') : '';
export function periodDates(period = 'Mês') {
  const end = new Date();
  const start = new Date(end);
  if (period === 'Semana') start.setDate(end.getDate() - 6);else if (period === 'Ano') start.setMonth(0, 1);else start.setDate(1);
  return {
    data_inicio: localDate(start),
    data_fim: localDate(end)
  };
}
