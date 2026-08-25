export const transacoes = [
  { id: '1', descricao: 'Netflix', categoria: 'Assinatura', tipo: 'Despesas', valor: 29.9, data: '12 Jul' },
  { id: '2', descricao: 'Salário', categoria: 'Renda', tipo: 'Receitas', valor: 4500.0, data: '10 Jul' },
  { id: '3', descricao: 'Conta de luz', categoria: 'Serviços', tipo: 'Despesas', valor: 120.2, data: '08 Jul' },
  { id: '4', descricao: 'Venda de itens', categoria: 'Outros', tipo: 'Receitas', valor: 250.0, data: '06 Jul' },
  { id: '5', descricao: 'Alimentação', categoria: 'Mercado', tipo: 'Despesas', valor: 86.75, data: '04 Jul' },
];

export function getTotals() {
  const totalReceitas = transacoes.filter(t => t.tipo === 'Receitas').reduce((s, t) => s + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'Despesas').reduce((s, t) => s + t.valor, 0);
  const saldo = totalReceitas - totalDespesas;
  return { totalReceitas, totalDespesas, saldo };
}

export function formatBRL(value) {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch (e) {
    // fallback
    return `R$ ${Number(value).toFixed(2)}`;
  }
}

export function getPreviousTotals() {
  const { totalReceitas, totalDespesas } = getTotals();
  // Simple heuristic for demo: assume previous month had slightly different totals
  const prevReceitas = Math.max(0, totalReceitas - 500);
  const prevDespesas = Math.max(0, totalDespesas + 200);
  const saldo = prevReceitas - prevDespesas;
  return { totalReceitas: prevReceitas, totalDespesas: prevDespesas, saldo };
}

export function getEconomiaComparison() {
  const totals = getTotals();
  const prev = getPreviousTotals();
  const economiaThis = totals.totalReceitas - totals.totalDespesas;
  const economiaPrev = prev.totalReceitas - prev.totalDespesas;
  const diff = economiaThis - economiaPrev;
  const percent = economiaPrev !== 0 ? (diff / Math.abs(economiaPrev)) * 100 : 0;
  return { economiaThis, economiaPrev, diff, percent };
}
