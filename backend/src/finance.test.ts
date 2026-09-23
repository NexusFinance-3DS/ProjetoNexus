import { describe, expect, it } from 'vitest';
import { parseMoney } from './transactions';
import { monthPeriods, moneyDifference } from './finance';
import { monthlyDate } from './recurrences';

describe('financial boundaries', () => {
  it('uses the same precision for JSON numbers and form strings', () => {
    for (const value of [1.001, 1.005, 0.009, NaN, Infinity, -1, '1.001', '1,001', true, null])
      expect(parseMoney(value)).toBeNaN();
    for (const value of [1.01, '1.01', '1,01']) expect(parseMoney(value)).toBe(1.01);
    expect(parseMoney(0.1 + 0.2)).toBe(0.3);
    expect(parseMoney(9999999999.99)).toBe(9999999999.99);
    expect(moneyDifference(0.3, 0.2)).toBe(0.1);
  });
  it('fills six months across year boundaries', () => {
    expect(monthPeriods('2026-02-01')).toEqual([
      '2025-09',
      '2025-10',
      '2025-11',
      '2025-12',
      '2026-01',
      '2026-02',
    ]);
  });
  it('preserves the original day after short months and leap years', () => {
    expect(monthlyDate('2024-01-31', 1)).toBe('2024-02-29');
    expect(monthlyDate('2024-01-31', 2)).toBe('2024-03-31');
    expect(monthlyDate('2025-01-31', 1)).toBe('2025-02-28');
    expect(monthlyDate('2025-12-31', 1)).toBe('2026-01-31');
  });
});
