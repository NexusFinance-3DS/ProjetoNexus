// All coordinates are measured in window space, including native keyboard frames.
export function keyboardOverlap(viewport, keyboard) {
  if (!keyboard || keyboard.height <= 0) return 0;
  if (keyboard.screenX + keyboard.width <= viewport.x || keyboard.screenX >= viewport.x + viewport.width) return 0;
  return Math.max(0, Math.min(viewport.height, viewport.y + viewport.height - keyboard.screenY));
}

export function focusedScrollOffset({ viewport, input, keyboard, offset, gap = 24 }) {
  const bottom = viewport.y + viewport.height - keyboardOverlap(viewport, keyboard) - gap;
  const top = viewport.y + 12;
  // For a multiline field taller than the visible area, keep its top reachable.
  const delta = input.y + input.height > bottom
    ? Math.min(input.y + input.height - bottom, input.y - top)
    : Math.min(0, input.y - top);
  return Math.max(0, offset + delta);
}
