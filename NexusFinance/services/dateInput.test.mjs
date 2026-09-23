import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateInput } from './dateInput.mjs';

test('formats typed digits, pasted dates and API dates', () => {
  for (const input of ['31122000', '31/12/2000', '2000-12-31'])
    assert.equal(dateInput(input), '31/12/2000');
  assert.equal(dateInput('1'), '1');
  assert.equal(dateInput('311'), '31/1');
  assert.equal(dateInput('3112200'), '31/12/200');
  assert.equal(dateInput('31/12/'), '31/12');
  assert.equal(dateInput(''), '');
  assert.equal(dateInput('3112200099'), '31/12/2000');
});
