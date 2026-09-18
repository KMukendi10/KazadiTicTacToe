import { useEffect, useReducer, useRef, useState } from "react";
import { gameReducer, createInitialState } from "./game/gameReducer";
import { calculateWinner, isDraw } from "./game/calculateWinner";
import { getComputerMove, getRandomMove } from "./game/ai";
import { playMoveSound, playWinSound, playDrawSound } from "./game/sound";
import { saveState } from "./game/storage";
import Board from "./components/Board";
import StatusBar from "./components/StatusBar";
import Scoreboard from "./components/Scoreboard";
import MoveHistory from "./components/MoveHistory";
import SettingsPanel from "./components/SettingsPanel";
import Confetti from "./components/Confetti";
import "./App.css";

const TURN_SECONDS = 10;
const COMPUTER_MARK = "O";
const HUMAN_MARK = "X";

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

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
  } = state;

  const currentSquares = history[currentMove].squares;
  const result = calculateWinner(currentSquares);
  const draw = !result && isDraw(currentSquares);
  const gameOver = Boolean(result) || draw;
  const xIsNext = currentMove % 2 === 0;
  const isComputerTurn =
    mode === "vsComputer" && !xIsNext && !gameOver;

  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const timerActive =
    timerEnabled && !gameOver && !isComputerTurn;

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
    });
  }, [
    scores,
    playerNames,
    mode,
    difficulty,
    timerEnabled,
    soundOn,
    theme,
  ]);

  // Apply the selected theme to the document.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Computer's move.
  useEffect(() => {
    if (!isComputerTurn) return;

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
  }, [isComputerTurn, currentSquares, difficulty]);

  // Turn timer.
  useEffect(() => {
    if (!timerActive) return undefined;

    setSecondsLeft(TURN_SECONDS);

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, currentMove]);

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
    dispatch({
      type: "SET_MODE",
      mode: nextMode,
    });

    dispatch({
      type: "NEW_GAME",
    });
  }

  function handleDifficultyChange(nextDifficulty) {
    dispatch({
      type: "SET_DIFFICULTY",
      difficulty: nextDifficulty,
    });
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
            />
          </aside>
        </div>
      )}

      <main className="layout">
        <div className="layout__game">
          <StatusBar
            winner={result?.winner}
            isDraw={draw}
            xIsNext={xIsNext}
            playerNames={playerNames}
            secondsLeft={secondsLeft}
            timerActive={timerActive}
          />

          <div className="board-wrap">
            <Board
              squares={currentSquares}
              onSquareClick={handleSquareClick}
              winningLine={result?.line}
              gameOver={gameOver}
              xIsNext={xIsNext}
              disabled={isComputerTurn}
            />

            {result && (
              <Confetti key={history.length} />
            )}
          </div>

          <button
            className="btn btn--primary"
            onClick={handleNewGame}
          >
            New Game
          </button>
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
          />
        </div>
      </main>
    </div>
  );
}