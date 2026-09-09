import test from 'node:test';
import assert from 'node:assert/strict';
import { palettes } from '../theme/palettes.js';

function luminance(color) {
  const values = color.slice(1).match(/../g).map((hex) => parseInt(hex, 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

for (const [name, palette] of Object.entries(palettes)) {
  test(`${name}: readable text, placeholders and financial values`, () => {
    for (const foreground of ['textPrimary', 'textSecondary', 'textMuted', 'textLink', 'success', 'danger', 'placeholder']) {
      for (const background of ['background', 'surface', 'input']) {
        assert.ok(contrast(palette[foreground], palette[background]) >= 4.5, `${foreground} on ${background} needs contrast >= 4.5 in ${name}`);
      }
    }
  });
  test(`${name}: filled buttons retain readable labels`, () => {
    for (const background of ['primary', 'primaryDeep', 'primaryDark']) assert.ok(contrast(palette.onPrimary, palette[background]) >= 4.5);
  });
}
