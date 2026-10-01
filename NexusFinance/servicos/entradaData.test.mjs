import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatarEntradaData } from "./entradaData.mjs";
test("formata d\xEDgitos, datas coladas e datas da API", () => {
  for (const campo of ['31122000', '31/12/2000', '2000-12-31']) assert.equal(formatarEntradaData(campo), '31/12/2000');
  assert.equal(formatarEntradaData('1'), '1');
  assert.equal(formatarEntradaData('311'), '31/1');
  assert.equal(formatarEntradaData('3112200'), '31/12/200');
  assert.equal(formatarEntradaData('31/12/'), '31/12');
  assert.equal(formatarEntradaData(''), '');
  assert.equal(formatarEntradaData('3112200099'), '31/12/2000');
});
