import { useReducer } from "react";
import { gameReducer, initialState } from "./game/gameReducer";
import { calculateWinner, isDraw } from "./game/calculateWinner";
import Board from "./components/Board";
import StatusBar from "./components/StatusBar";
import Scoreboard from "./components/Scoreboard";
import MoveHistory from "./components/MoveHistory";
import "./App.css";

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { history, currentMove, scores } = state;

  const currentSquares = history[currentMove].squares;
  const result = calculateWinner(currentSquares);
  const draw = !result && isDraw(currentSquares);
  const gameOver = Boolean(result) || draw;
  const xIsNext = currentMove % 2 === 0;

  function handleSquareClick(index) {
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

  return (
    <div className="app">
      <header className="app__header">
        <img src="/logo.png" alt="" className="app__logo" />
        <h1>Tic Tac Toe</h1>
        <p className="app__subtitle">Take turns, get three in a row.</p>
      </header>

      <main className="layout">
        <div className="layout__game">
          <StatusBar winner={result?.winner} isDraw={draw} xIsNext={xIsNext} />

          <Board
            squares={currentSquares}
            onSquareClick={handleSquareClick}
            winningLine={result?.line}
            gameOver={gameOver}
            xIsNext={xIsNext}
          />

          <button className="btn btn--primary" onClick={handleNewGame}>
            New Game
          </button>
        </div>

        <div className="layout__side">
          <Scoreboard scores={scores} onResetScores={handleResetScores} />
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
