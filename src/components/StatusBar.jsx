function nameFor(playerNames, mark) {
  return playerNames[mark]?.trim() || `Player ${mark}`;
}

export default function StatusBar({ winner, isDraw, xIsNext, playerNames, secondsLeft, timerActive }) {
  let text;
  let tone = "next";

  if (winner) {
    text = `Winner: ${nameFor(playerNames, winner)}`;
    tone = "winner";
  } else if (isDraw) {
    text = "Draw!";
    tone = "draw";
  } else {
    text = `Next: ${nameFor(playerNames, xIsNext ? "X" : "O")}`;
  }

  return (
    <div className={`status status--${tone}`} role="status" aria-live="polite">
      <span>{text}</span>
      {timerActive && (
        <span className="status__timer" aria-label={`${secondsLeft} seconds left`}>
          {secondsLeft}s
        </span>
      )}
    </div>
  );
}
