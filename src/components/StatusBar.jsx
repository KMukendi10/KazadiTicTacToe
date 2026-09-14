export default function StatusBar({ winner, isDraw, xIsNext }) {
  let text;
  let tone = "next";

  if (winner) {
    text = `Winner: ${winner}`;
    tone = "winner";
  } else if (isDraw) {
    text = "Draw!";
    tone = "draw";
  } else {
    text = `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className={`status status--${tone}`} role="status" aria-live="polite">
      {text}
    </div>
  );
}
