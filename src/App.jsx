import { useEffect, useReducer, useRef, useState } from "react";
import { gameReducer, createInitialState } from "./game/gameReducer";
import { calculateWinner, isDraw } from "./game/calculateWinner";
import { getComputerMove, getRandomMove } from "./game/ai";
import { markForMove, otherMark } from "./game/turns";
import { playMoveSound, playWinSound, playDrawSound } from "./game/sound";
import { saveState } from "./game/storage";
import Board from "./components/Board";
import MatchMeta from "./components/MatchMeta";
import StatusBar from "./components/StatusBar";
import Scoreboard from "./components/Scoreboard";
import MoveHistory from "./components/MoveHistory";
import SettingsPanel from "./components/SettingsPanel";
import Confetti from "./components/Confetti";
import MatchBanner from "./components/MatchBanner";
import Loader from "./components/Loader";
import ConfirmDialog from "./components/ConfirmDialog";
import SetupScreen from "./components/SetupScreen";
import GameBackground from "./components/GameBackground";
import { GearIcon, UndoIcon } from "./components/icons";
import "./App.css";

const TURN_SECONDS = 10;
const LOADER_DURATION_MS = 2500;

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [confirmState, setConfirmState] = useState(null);
  const [setupOpen, setSetupOpen] = useState(true);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  const {
    history,
    currentMove,
    scores,
    playerNames,
    mode,
    difficulty,
    humanMark,
    timerEnabled,
    soundOn,
    theme,
    startingMark,
    matchTarget,
  } = state;

  const computerMark = otherMark(humanMark);

  const currentSquares = history[currentMove].squares;
  const result = calculateWinner(currentSquares);
  const draw = !result && isDraw(currentSquares);
  const gameOver = Boolean(result) || draw;
  const currentMark = markForMove(currentMove, startingMark);
  const xIsNext = currentMark === "X";
  const isComputerTurn =
    mode === "vsComputer" && currentMark === computerMark && !gameOver;

  // Whether there's anything on the board or scoreboard worth warning
  // someone before wiping — no point nagging on a completely fresh game.
  const hasCompletedRound =
    scores.X > 0 || scores.O > 0 || scores.draws > 0;

  const matchWinnerMark = matchTarget
    ? ["X", "O"].find((mark) => scores[mark] >= matchTarget)
    : undefined;
  const matchOver = Boolean(matchWinnerMark);

  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const timerActive =
    timerEnabled && !gameOver && !isComputerTurn;

  // Splash screen with a progress bar that fills up to 100%.
  useEffect(() => {
    const startedAt = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const percent = Math.min(100, Math.round((elapsed / LOADER_DURATION_MS) * 100));
      setLoadProgress(percent);

      if (percent >= 100) {
        clearInterval(interval);
        // Hold briefly at 100% so it doesn't vanish the instant it fills.
        setTimeout(() => setIsLoading(false), 200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Persist scores + settings across refreshes. Player names are deliberately
  // excluded — a fresh load should always start at the defaults, not whoever
  // played last.
  useEffect(() => {
    saveState({
      scores,
      mode,
      difficulty,
      humanMark,
      timerEnabled,
      soundOn,
      theme,
      matchTarget,
    });
  }, [
    scores,
    mode,
    difficulty,
    humanMark,
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
    if (!isComputerTurn || isLoading || setupOpen) return;

    const timeout = setTimeout(() => {
      const move = getComputerMove(
        currentSquares,
        difficulty,
        computerMark,
        humanMark
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
  }, [isComputerTurn, currentSquares, difficulty, humanMark, computerMark, isLoading, setupOpen]);

  // Turn timer.
  useEffect(() => {
    if (!timerActive || isLoading || setupOpen) return undefined;

    setSecondsLeft(TURN_SECONDS);

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, currentMove, isLoading, setupOpen]);

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

  function handleNewGame() {
    dispatch({
      type: "NEW_GAME",
    });
  }

  function handleSetupStart({
    mode: chosenMode,
    difficulty: chosenDifficulty,
    humanMark: chosenHumanMark,
    names,
    matchTarget: chosenMatchTarget,
  }) {
    dispatch({
      type: "SET_MODE",
      mode: chosenMode,
    });

    if (chosenMode === "vsComputer") {
      dispatch({
        type: "SET_DIFFICULTY",
        difficulty: chosenDifficulty,
      });

      dispatch({
        type: "SET_HUMAN_MARK",
        mark: chosenHumanMark,
      });
    }

    dispatch({
      type: "SET_PLAYER_NAME",
      mark: "X",
      name: names.X,
    });

    dispatch({
      type: "SET_PLAYER_NAME",
      mark: "O",
      name: names.O,
    });

    dispatch({
      type: "SET_MATCH_TARGET",
      target: chosenMatchTarget,
    });

    dispatch({
      type: "NEW_GAME",
      resetStartingMark: true,
    });

    dispatch({
      type: "RESET_SCORES",
    });

    setHasStartedOnce(true);
    setSetupOpen(false);
  }

  function handleSetupCancel() {
    setSetupOpen(false);
  }

  function handleNewMatch() {
    // Starting a new match means new names/mode are worth asking about again.
    setSetupOpen(true);
  }

  // A bigger reset than "New Match" — for when the people playing are
  // changing, not just the score. Reopens the setup screen (pre-filled
  // with the current mode/names) so it can be confirmed as-is or changed.
  function handleStartOver() {
    setSetupOpen(true);
  }

  function handleResetScores() {
    requestConfirm(
      "Reset the game? This clears the board and resets the scoreboard to zero.",
      () => {
        dispatch({
          type: "NEW_GAME",
          resetStartingMark: true,
        });
        dispatch({
          type: "RESET_SCORES",
        });
      }
    );
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
    return <Loader progress={loadProgress} />;
  }

  return (
    <>
      <GameBackground />

      <div className="app">
      <header className="app__header">
        <div className="app__title-row">
          <img
            src="/logo.png"
            alt=""
            className="app__logo"
          />

          <h1>Tic Tac Toe</h1>
        </div>

        <p className="app__subtitle">
          9 squares, 8 lines, 1 winner.
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
        <span aria-hidden="true"><GearIcon /></span>
        <span>Settings</span>
      </button>

      {/* Full reset — reopens the setup screen (pre-filled with the current
          mode/names) so a fresh match can be confirmed as-is or reconfigured. */}
      <button
        className="startover-trigger"
        type="button"
        onClick={handleStartOver}
      >
        <span aria-hidden="true"><UndoIcon /></span>
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
              timerEnabled={timerEnabled}
              onToggleTimer={handleToggleTimer}
              soundOn={soundOn}
              onToggleSound={handleToggleSound}
              theme={theme}
              onToggleTheme={handleToggleTheme}
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

      {/* Mandatory on first load; reopened by Start Over / Start New Match */}
      {setupOpen && (
        <SetupScreen
          initialMode={mode}
          initialDifficulty={difficulty}
          initialNames={playerNames}
          initialMatchTarget={matchTarget}
          initialHumanMark={humanMark}
          onStart={handleSetupStart}
          onCancel={handleSetupCancel}
          showCancel={hasStartedOnce}
        />
      )}

      <main className="layout">
        <div className="layout__game">
          <MatchMeta mode={mode} matchTarget={matchTarget} />

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
            canReset={hasCompletedRound}
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
    </>
  );
}