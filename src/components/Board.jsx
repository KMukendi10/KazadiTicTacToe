import { useRef, useState } from "react";
import Square from "./Square";

// Roving-tabindex arrow key navigation across the 3x3 grid, with wraparound.
const MOVES = {
  ArrowRight: (i) => (i % 3 === 2 ? i - 2 : i + 1),
  ArrowLeft: (i) => (i % 3 === 0 ? i + 2 : i - 1),
  ArrowDown: (i) => (i + 3 <= 8 ? i + 3 : i - 6),
  ArrowUp: (i) => (i - 3 >= 0 ? i - 3 : i + 6),
};

export default function Board({ squares, onSquareClick, winningLine, gameOver, xIsNext, disabled }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const squareRefs = useRef([]);

  function handleKeyDown(event, index) {
    const move = MOVES[event.key];
    if (!move) return;
    event.preventDefault();
    const nextIndex = move(index);
    setActiveIndex(nextIndex);
    squareRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="board" role="grid" aria-label="Tic tac toe board">
      {squares.map((value, index) => (
        <Square
          key={index}
          ref={(el) => (squareRefs.current[index] = el)}
          value={value}
          onClick={() => onSquareClick(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onFocus={() => setActiveIndex(index)}
          tabIndex={index === activeIndex ? 0 : -1}
          isWinning={winningLine?.includes(index)}
          disabled={gameOver || disabled}
          previewValue={xIsNext ? "X" : "O"}
        />
      ))}
    </div>
  );
}
