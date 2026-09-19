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

// Returns an empty square that would make `mark` win immediately, or null.
function getWinningMove(squares, mark) {
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue;
    const next = squares.slice();
    next[i] = mark;
    if (calculateWinner(next)?.winner === mark) return i;
  }
  return null;
}

// No lookahead beyond one move: take an immediate win, otherwise block an
// immediate loss, otherwise play randomly. Beatable, but won't hand you a win.
export function getMediumMove(squares, computerMark, humanMark) {
  const winningMove = getWinningMove(squares, computerMark);
  if (winningMove !== null) return winningMove;

  const blockingMove = getWinningMove(squares, humanMark);
  if (blockingMove !== null) return blockingMove;

  return getRandomMove(squares);
}

// Mostly plays the perfect minimax move, but slips into Medium-level
// play often enough to occasionally be beaten.
const HARD_OPTIMAL_CHANCE = 0.8;

export function getHardMove(squares, computerMark, humanMark) {
  if (Math.random() < HARD_OPTIMAL_CHANCE) {
    return getBestMove(squares, computerMark, humanMark);
  }
  return getMediumMove(squares, computerMark, humanMark);
}

export function getComputerMove(squares, difficulty, computerMark, humanMark) {
  switch (difficulty) {
    case "medium":
      return getMediumMove(squares, computerMark, humanMark);
    case "hard":
      return getHardMove(squares, computerMark, humanMark);
    case "unbeatable":
      return getBestMove(squares, computerMark, humanMark);
    default:
      return getRandomMove(squares);
  }
}
