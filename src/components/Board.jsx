import Square from "./Square";

export default function Board({ squares, onSquareClick, winningLine, gameOver }) {
  return (
    <div className="board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winningLine?.includes(index)}
          disabled={gameOver}
        />
      ))}
    </div>
  );
}
