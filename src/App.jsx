import { useEffect, useReducer, useRef, useState } from "react";
import { gameReducer, createInitialState } from "./game/gameReducer";
import { calculateWinner, isDraw } from "./game/calculateWinner";
import { getComputerMove, getRandomMove } from "./game/ai";
import { markForMove } from "./game/turns";
import { playMoveSound, playWinSound, playDrawSound } from "./game/sound";
import { saveState } from "./game/storage";
import Board from "./components/Board";
import StatusBar from "./components/StatusBar";
import Scoreboard from "./components/Scoreboard";
import MoveHistory from "./components/MoveHistory";
import SettingsPanel from "./components/SettingsPanel";
import Confetti from "./components/Confetti";
import MatchBanner from "./components/MatchBanner";
import Loader from "./components/Loader";
import ConfirmDialog from "./components/ConfirmDialog";
import "./App.css";

const TURN_SECONDS = 10;
const COMPUTER_MARK = "O";
const HUMAN_MARK = "X";
const LOADER_DURATION_MS = 1100;

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmState, setConfirmState] = useState(null);

  const {
    history,
    currentMove,
    scores,
    playerNames,
    mode,
    difficulty,
    timerEnabled,
    soundOn,
    theme,
    startingMark,
    matchTarget,
  } = state;

  const currentSquares = history[currentMove].squares;
  const result = calculateWinner(currentSquares);
  const draw = !result && isDraw(currentSquares);
  const gameOver = Boolean(result) || draw;
  const xIsNext = markForMove(currentMove, startingMark) === "X";
  const isComputerTurn =
    mode === "vsComputer" && !xIsNext && !gameOver;
  const canUndo = currentMove > 0 && !isComputerTurn;

  // Whether there's anything on the board or scoreboard worth warning
  // someone before wiping — no point nagging on a completely fresh game.
  const hasProgress =
    currentMove > 0 || scores.X > 0 || scores.O > 0 || scores.draws > 0;

  const matchWinnerMark = matchTarget
    ? ["X", "O"].find((mark) => scores[mark] >= matchTarget)
    : undefined;
  const matchOver = Boolean(matchWinnerMark);

  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const timerActive =
    timerEnabled && !gameOver && !isComputerTurn;

  // Brief splash screen on first load.
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), LOADER_DURATION_MS);
    return () => clearTimeout(timeout);
  }, []);

  // Persist scores + settings across refreshes.
  useEffect(() => {
    saveState({
      scores,
      playerNames,
      mode,
      difficulty,
      timerEnabled,
      soundOn,
      theme,
      matchTarget,
    });
  }, [
    scores,
    playerNames,
    mode,
    difficulty,
    timerEnabled,
    soundOn,
    theme,
    matchTarget,
  ]);

  // Apply the selected theme to the document.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Computer's move.
  useEffect(() => {
    if (!isComputerTurn || isLoading) return;

    const timeout = setTimeout(() => {
      const move = getComputerMove(
        currentSquares,
        difficulty,
        COMPUTER_MARK,
        HUMAN_MARK
      );

      if (move !== null && move !== undefined) {
        dispatch({
          type: "MAKE_MOVE",
          index: move,
        });
      }
    }, 500);

    return () => clearTimeout(timeout);

    // currentSquares changes identity every move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComputerTurn, currentSquares, difficulty, isLoading]);

  // Turn timer.
  useEffect(() => {
    if (!timerActive || isLoading) return undefined;

    setSecondsLeft(TURN_SECONDS);

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, currentMove, isLoading]);

  // Automatically make a random move when timer reaches zero.
  useEffect(() => {
    if (!timerActive || secondsLeft > 0) return;

    const move = getRandomMove(currentSquares);

    if (move !== null && move !== undefined) {
      dispatch({
        type: "MAKE_MOVE",
        index: move,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, timerActive]);

  // Play move sound.
  const prevHistoryLength = useRef(history.length);

  useEffect(() => {
    if (history.length > prevHistoryLength.current) {
      playMoveSound(!soundOn);
    }

    prevHistoryLength.current = history.length;
  }, [history.length, soundOn]);

  // Play sound when game ends.
  const prevGameOver = useRef(false);

  useEffect(() => {
    if (gameOver && !prevGameOver.current) {
      if (result) {
        playWinSound(!soundOn);
      } else if (draw) {
        playDrawSound(!soundOn);
      }
    }

    prevGameOver.current = gameOver;
  }, [gameOver, result, draw, soundOn]);

  function requestConfirm(message, onConfirm) {
    setConfirmState({ message, onConfirm });
  }

  function handleConfirmYes() {
    confirmState?.onConfirm();
    setConfirmState(null);
  }

  function handleConfirmCancel() {
    setConfirmState(null);
  }

  function handleSquareClick(index) {
    if (isComputerTurn) return;

    dispatch({
      type: "MAKE_MOVE",
      index,
    });
  }

  function handleJumpTo(move) {
    dispatch({
      type: "JUMP_TO_MOVE",
      move,
    });
  }

  function handleUndo() {
    dispatch({
      type: "UNDO",
    });
  }

  function handleNewGame() {
    dispatch({
      type: "NEW_GAME",
    });
  }

  function handleNewMatch() {
    dispatch({
      type: "NEW_GAME",
      resetStartingMark: true,
    });
    dispatch({
      type: "RESET_SCORES",
    });
  }

  // A bigger reset than "New Match" — for when the people playing are
  // changing, not just the score. Wipes everything and opens Settings
  // so new names can be entered right away.
  function handleStartOver() {
    requestConfirm(
      "Start over? This clears the board and resets the scoreboard to zero.",
      () => {
        dispatch({
          type: "NEW_GAME",
          resetStartingMark: true,
        });
        dispatch({
          type: "RESET_SCORES",
        });
        setSettingsOpen(true);
      }
    );
  }

  function handleMatchTargetChange(target) {
    const applyChange = () => {
      dispatch({
        type: "SET_MATCH_TARGET",
        target,
      });

      // Changing the race length mid-match makes the tally so far meaningless —
      // start the match fresh under the new target.
      dispatch({
        type: "NEW_GAME",
        resetStartingMark: true,
      });

      dispatch({
        type: "RESET_SCORES",
      });
    };

    if (hasProgress) {
      requestConfirm(
        "Changing the race length will restart the board and reset the scoreboard. Continue?",
        applyChange
      );
    } else {
      applyChange();
    }
  }

  function handleResetScores() {
    dispatch({
      type: "RESET_SCORES",
    });
  }

  function handleNameChange(mark, name) {
    dispatch({
      type: "SET_PLAYER_NAME",
      mark,
      name,
    });
  }

  function handleModeChange(nextMode) {
    const applyChange = () => {
      dispatch({
        type: "SET_MODE",
        mode: nextMode,
      });

      // A PvP scoreboard and a vs-Computer scoreboard aren't the same contest —
      // wipe both the board and the tally so nothing carries over.
      dispatch({
        type: "NEW_GAME",
        resetStartingMark: true,
      });

      dispatch({
        type: "RESET_SCORES",
      });
    };

    if (hasProgress) {
      requestConfirm(
        "Changing the opponent will restart the board and reset the scoreboard. Continue?",
        applyChange
      );
    } else {
      applyChange();
    }
  }

  function handleDifficultyChange(nextDifficulty) {
    const applyChange = () => {
      dispatch({
        type: "SET_DIFFICULTY",
        difficulty: nextDifficulty,
      });

      // Same reasoning — wins against Easy and wins against Unbeatable
      // shouldn't be tallied together.
      dispatch({
        type: "NEW_GAME",
        resetStartingMark: true,
      });

      dispatch({
        type: "RESET_SCORES",
      });
    };

    if (hasProgress) {
      requestConfirm(
        "Changing the difficulty will restart the board and reset the scoreboard. Continue?",
        applyChange
      );
    } else {
      applyChange();
    }
  }

  function handleToggleTimer() {
    dispatch({
      type: "TOGGLE_TIMER",
    });
  }

  function handleToggleSound() {
    dispatch({
      type: "TOGGLE_SOUND",
    });
  }

  function handleToggleTheme() {
    dispatch({
      type: "SET_THEME",
      theme: theme === "dark" ? "light" : "dark",
    });
  }

  // Close Settings with the Escape key and prevent
  // the page from scrolling while the sidebar is open.
  useEffect(() => {
    if (!settingsOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSettingsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [settingsOpen]);

  // Same treatment for the confirm dialog — Escape cancels it, and it
  // locks scrolling while open (skip the lock if Settings already did it).
  useEffect(() => {
    if (!confirmState) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        handleConfirmCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    if (!settingsOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (!settingsOpen) {
        document.body.style.overflow = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmState, settingsOpen]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="app">
      <header className="app__header">
        <img
          src="/logo.png"
          alt=""
          className="app__logo"
        />

        <h1>Tic Tac Toe</h1>

        <p className="app__subtitle">
          Take turns, get three in a row.
        </p>
      </header>

      {/* Settings button */}
      <button
        className="settings-trigger"
        type="button"
        onClick={() => setSettingsOpen(true)}
        aria-label="Open game settings"
        aria-expanded={settingsOpen}
      >
        <span aria-hidden="true">⚙</span>
        <span>Settings</span>
      </button>

      {/* Full reset — new players, fresh scoreboard */}
      <button
        className="startover-trigger"
        type="button"
        onClick={handleStartOver}
      >
        <span aria-hidden="true">↺</span>
        <span>Start Over</span>
      </button>

      {/* Settings sidebar */}
      {settingsOpen && (
        <div className="settings-drawer-layer">
          {/* Dark overlay */}
          <button
            className="settings-overlay"
            type="button"
            aria-label="Close settings"
            onClick={() => setSettingsOpen(false)}
          />

          {/* Left sidebar */}
          <aside
            className="settings-drawer"
            aria-label="Game settings"
          >
            <div className="settings-drawer__header">
              <h2>Settings</h2>

              <button
                className="settings-drawer__close"
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <SettingsPanel
              playerNames={playerNames}
              onNameChange={handleNameChange}
              mode={mode}
              onModeChange={handleModeChange}
              difficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              timerEnabled={timerEnabled}
              onToggleTimer={handleToggleTimer}
              soundOn={soundOn}
              onToggleSound={handleToggleSound}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              matchTarget={matchTarget}
              onMatchTargetChange={handleMatchTargetChange}
            />
          </aside>
        </div>
      )}

      {/* Confirmation dialog for anything that would restart the game */}
      {confirmState && (
        <ConfirmDialog
          message={confirmState.message}
          onConfirm={handleConfirmYes}
          onCancel={handleConfirmCancel}
        />
      )}

      <main className="layout">
        <div className="layout__game">
          {matchOver ? (
            <MatchBanner
              winnerName={playerNames[matchWinnerMark]?.trim() || `Player ${matchWinnerMark}`}
              scores={scores}
              matchTarget={matchTarget}
              onNewMatch={handleNewMatch}
            />
          ) : (
            <StatusBar
              winner={result?.winner}
              isDraw={draw}
              xIsNext={xIsNext}
              playerNames={playerNames}
              secondsLeft={secondsLeft}
              timerActive={timerActive}
            />
          )}

          <div className="board-wrap">
            <Board
              squares={currentSquares}
              onSquareClick={handleSquareClick}
              winningLine={result?.line}
              gameOver={gameOver || matchOver}
              xIsNext={xIsNext}
              disabled={isComputerTurn}
            />

            {result && (
              <Confetti key={history.length} />
            )}
          </div>

          {!matchOver && (
            <div className="button-row">
              <button
                className="btn"
                onClick={handleUndo}
                disabled={!canUndo}
              >
                Undo
              </button>

              <button
                className="btn btn--primary"
                onClick={handleNewGame}
              >
                New Game
              </button>
            </div>
          )}
        </div>

        <div className="layout__side">
          <Scoreboard
            scores={scores}
            onResetScores={handleResetScores}
            playerNames={playerNames}
          />

          <MoveHistory
            history={history}
            currentMove={currentMove}
            onJumpTo={handleJumpTo}
            startingMark={startingMark}
          />
        </div>
      </main>
    </div>
  );
}