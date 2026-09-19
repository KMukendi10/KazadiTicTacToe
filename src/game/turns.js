export function otherMark(mark) {
  return mark === "X" ? "O" : "X";
}

// moveNumber is 0-indexed (state.currentMove) — the move about to be made.
export function markForMove(moveNumber, startingMark) {
  return moveNumber % 2 === 0 ? startingMark : otherMark(startingMark);
}
