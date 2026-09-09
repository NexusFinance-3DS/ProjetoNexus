import assert from 'node:assert/strict';
import test from 'node:test';
import { focusedScrollOffset, keyboardOverlap } from '../components/keyboardGeometry.mjs';

const viewport = { x: 0, y: 90, width: 390, height: 700 };
const keyboard = { screenX: 0, screenY: 490, width: 390, height: 310 };

test('overlay keyboard creates enough extra scroll range for the final input', () => {
  const overlap = keyboardOverlap(viewport, keyboard);
  const offset = focusedScrollOffset({ viewport, keyboard, input: { y: 710, height: 48 }, offset: 0 });
  assert.equal(overlap, 300);
  assert.ok(offset <= overlap);
  assert.equal(710 + 48 - offset, keyboard.screenY - 24);
});

test('resized Android viewport does not reserve keyboard height twice', () => {
  const resized = { ...viewport, height: 400 };
  assert.equal(keyboardOverlap(resized, keyboard), 0);
  assert.equal(focusedScrollOffset({ viewport: resized, keyboard, input: { y: 450, height: 48 }, offset: 120 }), 152);
});

test('switching to a field above the viewport scrolls back up', () => {
  assert.equal(focusedScrollOffset({ viewport, keyboard, input: { y: 50, height: 48 }, offset: 180 }), 128);
});

test('visible fields do not jump when switching inputs', () => {
  assert.equal(focusedScrollOffset({ viewport, keyboard, input: { y: 200, height: 48 }, offset: 180 }), 180);
});

test('floating keyboard outside the form does not move its fields', () => {
  assert.equal(keyboardOverlap(viewport, { ...keyboard, screenX: 600 }), 0);
});

test('closed keyboard removes extra scroll range', () => {
  assert.equal(keyboardOverlap(viewport, null), 0);
  assert.equal(keyboardOverlap(viewport, { ...keyboard, height: 0 }), 0);
});
