import { calculateWinner, isDraw } from "./calculateWinner";
import { loadSaved } from "./storage";

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

      const xIsNext = state.currentMove % 2 === 0;
      const nextSquares = currentSquares.slice();
      nextSquares[index] = xIsNext ? "X" : "O";

      // Branch off from the current move — any "future" from an undo/jump is discarded.
      const nextHistory = [
        ...state.history.slice(0, state.currentMove + 1),
        { squares: nextSquares, lastIndex: index },
      ];

      const { scores, scoredThroughLength } = scoreIfFinished(state, nextHistory);

      return {
        ...state,
        history: nextHistory,
        currentMove: nextHistory.length - 1,
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
      // Keep the scoreboard and settings, wipe the board.
      return {
        ...state,
        history: [{ squares: emptyBoard(), lastIndex: null }],
        currentMove: 0,
        scoredThroughLength: 1,
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
