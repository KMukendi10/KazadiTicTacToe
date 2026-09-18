import { calculateWinner } from "./calculateWinner";

export function getRandomMove(squares) {
  const empty = squares
    .map((value, index) => (value === null ? index : null))
    .filter((index) => index !== null);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function minimax(squares, depth, isMaximizing, computerMark, humanMark) {
  const result = calculateWinner(squares);
  if (result) {
    return result.winner === computerMark ? 10 - depth : depth - 10;
  }
  if (squares.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (squares[i]) continue;
      const next = squares.slice();
      next[i] = computerMark;
      best = Math.max(best, minimax(next, depth + 1, false, computerMark, humanMark));
    }
    return best;
  }

  let best = Infinity;
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue;
    const next = squares.slice();
    next[i] = humanMark;
    best = Math.min(best, minimax(next, depth + 1, true, computerMark, humanMark));
  }
  return best;
}

export function getBestMove(squares, computerMark, humanMark) {
  let bestScore = -Infinity;
  let bestMove = null;
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue;
    const next = squares.slice();
    next[i] = computerMark;
    const score = minimax(next, 0, false, computerMark, humanMark);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

export function getComputerMove(squares, difficulty, computerMark, humanMark) {
  if (difficulty === "unbeatable") {
    return getBestMove(squares, computerMark, humanMark);
  }
  return getRandomMove(squares);
}
