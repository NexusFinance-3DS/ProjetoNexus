import { describe, expect, it } from 'vitest';
import { converterValorMonetario } from "./transacoes";
import { periodosMensais, diferencaMonetaria } from "./financeiro";
import { dataMensal } from "./recorrencias";
describe("limites financeiros", () => {
  it("usa a mesma precis\xE3o para n\xFAmeros JSON e valores de formul\xE1rio", () => {
    for (const valor of [1.001, 1.005, 0.009, NaN, Infinity, -1, '1.001', '1,001', true, null]) expect(converterValorMonetario(valor)).toBeNaN();
    for (const valor of [1.01, '1.01', '1,01']) expect(converterValorMonetario(valor)).toBe(1.01);
    expect(converterValorMonetario('R$ 1.000')).toBe(1000);
    expect(converterValorMonetario('12.345')).toBe(12345);
    expect(converterValorMonetario('R$ 1.234.567,89')).toBe(1234567.89);
    expect(converterValorMonetario(0.1 + 0.2)).toBe(0.3);
    expect(converterValorMonetario(9999999999.99)).toBe(9999999999.99);
    expect(diferencaMonetaria(0.3, 0.2)).toBe(0.1);
  });
  it("preenche seis meses na mudan\xE7a de ano", () => {
    expect(periodosMensais('2026-02-01')).toEqual(['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']);
  });
  it("preserva o dia original ap\xF3s meses curtos e anos bissextos", () => {
    expect(dataMensal('2024-01-31', 1)).toBe('2024-02-29');
    expect(dataMensal('2024-01-31', 2)).toBe('2024-03-31');
    expect(dataMensal('2025-01-31', 1)).toBe('2025-02-28');
    expect(dataMensal('2025-12-31', 1)).toBe('2026-01-31');
  });
});
