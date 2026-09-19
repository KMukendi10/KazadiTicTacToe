import { calculateWinner, isDraw } from "./calculateWinner";
import { loadSaved } from "./storage";
import { markForMove, otherMark } from "./turns";

const emptyBoard = () => Array(9).fill(null);

const defaults = {
  history: [{ squares: emptyBoard(), lastIndex: null }],
  currentMove: 0,
  scores: { X: 0, O: 0, draws: 0 },
  // How many history entries have already been counted on the scoreboard,
  // so jumping back/forward through time travel never double-counts a result.
  scoredThroughLength: 1,
  playerNames: { X: "Player X", O: "Player O" },
  mode: "pvp", // "pvp" | "vsComputer"
  difficulty: "easy", // "easy" | "unbeatable"
  timerEnabled: false,
  soundOn: true,
  theme: "dark", // "dark" | "light"
  startingMark: "X", // who goes first this game — alternates each New Game
};

// Lazy initializer for useReducer — restores settings (not the in-progress
// board) from localStorage so a refresh doesn't wipe the scoreboard/prefs.
export function createInitialState() {
  const saved = loadSaved();
  return {
    ...defaults,
    scores: saved?.scores ?? defaults.scores,
    playerNames: saved?.playerNames ?? defaults.playerNames,
    mode: saved?.mode ?? defaults.mode,
    difficulty: saved?.difficulty ?? defaults.difficulty,
    timerEnabled: saved?.timerEnabled ?? defaults.timerEnabled,
    soundOn: saved?.soundOn ?? defaults.soundOn,
    theme: saved?.theme ?? defaults.theme,
  };
}

function scoreIfFinished(state, history) {
  const squares = history[history.length - 1].squares;
  const result = calculateWinner(squares);

  if (history.length <= state.scoredThroughLength) {
    return { scores: state.scores, scoredThroughLength: state.scoredThroughLength };
  }

  if (result) {
    return {
      scores: { ...state.scores, [result.winner]: state.scores[result.winner] + 1 },
      scoredThroughLength: history.length,
    };
  }

  if (isDraw(squares)) {
    return {
      scores: { ...state.scores, draws: state.scores.draws + 1 },
      scoredThroughLength: history.length,
    };
  }

  return { scores: state.scores, scoredThroughLength: state.scoredThroughLength };
}

// If a result was already counted on the scoreboard but the history entry it
// came from is about to fall outside the reachable timeline — because Undo
// removed it, or because a new move branches off from an earlier point in
// time travel — that score needs to be reversed. Otherwise it's stuck on the
// board even though the game that earned it no longer exists.
function reverseScoreIfNowUnreachable(state, newLength) {
  if (state.scoredThroughLength <= newLength) {
    return { scores: state.scores, scoredThroughLength: state.scoredThroughLength };
  }

  const scoredSquares = state.history[state.scoredThroughLength - 1].squares;
  const scoredResult = calculateWinner(scoredSquares);
  let scores = state.scores;

  if (scoredResult) {
    scores = { ...scores, [scoredResult.winner]: scores[scoredResult.winner] - 1 };
  } else if (isDraw(scoredSquares)) {
    scores = { ...scores, draws: scores.draws - 1 };
  }

  return { scores, scoredThroughLength: newLength };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "MAKE_MOVE": {
      const { index } = action;
      const currentSquares = state.history[state.currentMove].squares;
      const alreadyDecided =
        calculateWinner(currentSquares) || isDraw(currentSquares);

      if (alreadyDecided || currentSquares[index]) {
        return state; // ignore filled cells / moves after game over
      }

      // Branch off from the current move — any "future" from an undo/jump is
      // discarded. If that future had already been scored, reverse it first.
      const truncatedLength = state.currentMove + 1;
      const cleared = reverseScoreIfNowUnreachable(state, truncatedLength);

      const mark = markForMove(state.currentMove, state.startingMark);
      const nextSquares = currentSquares.slice();
      nextSquares[index] = mark;

      const nextHistory = [
        ...state.history.slice(0, truncatedLength),
        { squares: nextSquares, lastIndex: index },
      ];

      const { scores, scoredThroughLength } = scoreIfFinished(
        { ...state, scores: cleared.scores, scoredThroughLength: cleared.scoredThroughLength },
        nextHistory
      );

      return {
        ...state,
        history: nextHistory,
        currentMove: nextHistory.length - 1,
        scores,
        scoredThroughLength,
      };
    }

    case "UNDO": {
      if (state.currentMove === 0) return state; // nothing to undo

      const newCurrentMove = state.currentMove - 1;
      const { scores, scoredThroughLength } = reverseScoreIfNowUnreachable(
        state,
        newCurrentMove + 1
      );

      return {
        ...state,
        history: state.history.slice(0, newCurrentMove + 1),
        currentMove: newCurrentMove,
        scores,
        scoredThroughLength,
      };
    }

    case "JUMP_TO_MOVE": {
      const move = action.move;
      if (move < 0 || move > state.history.length - 1) return state;
      return { ...state, currentMove: move };
    }

    case "NEW_GAME": {
      // Keep the scoreboard and settings, wipe the board, swap who starts.
      return {
        ...state,
        history: [{ squares: emptyBoard(), lastIndex: null }],
        currentMove: 0,
        scoredThroughLength: 1,
        startingMark: otherMark(state.startingMark),
      };
    }

    case "RESET_SCORES": {
      return { ...state, scores: { X: 0, O: 0, draws: 0 } };
    }

    case "SET_PLAYER_NAME": {
      return {
        ...state,
        playerNames: { ...state.playerNames, [action.mark]: action.name },
      };
    }

    case "SET_MODE": {
      return { ...state, mode: action.mode };
    }

    case "SET_DIFFICULTY": {
      return { ...state, difficulty: action.difficulty };
    }

    case "TOGGLE_TIMER": {
      return { ...state, timerEnabled: !state.timerEnabled };
    }

    case "TOGGLE_SOUND": {
      return { ...state, soundOn: !state.soundOn };
    }

    case "SET_THEME": {
      return { ...state, theme: action.theme };
    }

    default:
      return state;
  }
}
