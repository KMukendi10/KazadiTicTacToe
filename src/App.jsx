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
  const isComputerTurn = mode === "vsComputer" && !xIsNext && !gameOver;

  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS);
  const timerActive = timerEnabled && !gameOver && !isComputerTurn;

  // Persist scores + settings (never the in-progress board) across refreshes.
  useEffect(() => {
    saveState({ scores, playerNames, mode, difficulty, timerEnabled, soundOn, theme });
  }, [scores, playerNames, mode, difficulty, timerEnabled, soundOn, theme]);

  // Apply the chosen theme to the document so CSS variables switch globally.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Computer's move, with a short "thinking" delay for feel.
  useEffect(() => {
    if (!isComputerTurn) return;
    const timeout = setTimeout(() => {
      const move = getComputerMove(currentSquares, difficulty, COMPUTER_MARK, HUMAN_MARK);
      if (move !== null && move !== undefined) {
        dispatch({ type: "MAKE_MOVE", index: move });
      }
    }, 500);
    return () => clearTimeout(timeout);
    // currentSquares changes identity every move, which is what we want to react to
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComputerTurn, currentSquares, difficulty]);

  // Turn timer: resets on every new turn, auto-plays a random move on timeout.
  useEffect(() => {
    if (!timerActive) return undefined;
    setSecondsLeft(TURN_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, currentMove]);

  useEffect(() => {
    if (!timerActive || secondsLeft > 0) return;
    const move = getRandomMove(currentSquares);
    if (move !== null && move !== undefined) {
      dispatch({ type: "MAKE_MOVE", index: move });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, timerActive]);

  // Sound: a move was made (skip the very first render).
  const prevHistoryLength = useRef(history.length);
  useEffect(() => {
    if (history.length > prevHistoryLength.current) {
      playMoveSound(!soundOn);
    }
    prevHistoryLength.current = history.length;
  }, [history.length, soundOn]);

  // Sound: the game just ended.
  const prevGameOver = useRef(false);
  useEffect(() => {
    if (gameOver && !prevGameOver.current) {
      if (result) playWinSound(!soundOn);
      else if (draw) playDrawSound(!soundOn);
    }
    prevGameOver.current = gameOver;
  }, [gameOver, result, draw, soundOn]);

  function handleSquareClick(index) {
    if (isComputerTurn) return;
    dispatch({ type: "MAKE_MOVE", index });
  }

  function handleJumpTo(move) {
    dispatch({ type: "JUMP_TO_MOVE", move });
  }

  function handleNewGame() {
    dispatch({ type: "NEW_GAME" });
  }

  function handleResetScores() {
    dispatch({ type: "RESET_SCORES" });
  }

  function handleNameChange(mark, name) {
    dispatch({ type: "SET_PLAYER_NAME", mark, name });
  }

  function handleModeChange(nextMode) {
    dispatch({ type: "SET_MODE", mode: nextMode });
    dispatch({ type: "NEW_GAME" });
  }

  function handleDifficultyChange(nextDifficulty) {
    dispatch({ type: "SET_DIFFICULTY", difficulty: nextDifficulty });
  }

  function handleToggleTimer() {
    dispatch({ type: "TOGGLE_TIMER" });
  }

  function handleToggleSound() {
    dispatch({ type: "TOGGLE_SOUND" });
  }

  function handleToggleTheme() {
    dispatch({ type: "SET_THEME", theme: theme === "dark" ? "light" : "dark" });
  }

  return (
    <div className="app">
      <header className="app__header">
        <img src="/logo.png" alt="" className="app__logo" />
        <h1>Tic Tac Toe</h1>
        <p className="app__subtitle">Take turns, get three in a row.</p>
      </header>

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
            {result && <Confetti key={history.length} />}
          </div>

          <button className="btn btn--primary" onClick={handleNewGame}>
            New Game
          </button>
        </div>

        <div className="layout__side">
          <Scoreboard scores={scores} onResetScores={handleResetScores} playerNames={playerNames} />
          <MoveHistory history={history} currentMove={currentMove} onJumpTo={handleJumpTo} />
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
        </div>
      </main>
    </div>
  );
}
