import { describe, expect, it } from "vitest";
import { parseMoney, roundMoney } from "./transactions";

describe("regras monetárias", () => {
  it("normaliza números com mais de duas casas decimais", () => {
    expect(parseMoney(10.129)).toBe(10.13);
    expect(parseMoney(10.124)).toBe(10.12);
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
  });

  it("mantém a validação estrita para strings monetárias", () => {
    expect(parseMoney("10,12")).toBe(10.12);
    expect(parseMoney("10.123")).toBeNaN();
    expect(parseMoney("R$ 1.234,56")).toBe(1234.56);
  });
});
