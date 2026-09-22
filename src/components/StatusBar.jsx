function nameFor(playerNames, mark) {
  return playerNames[mark]?.trim() || `Player ${mark}`;
}

export default function StatusBar({ winner, isDraw, xIsNext, playerNames, secondsLeft, timerActive }) {
  if (winner || isDraw) {
    const text = winner ? `Winner: ${nameFor(playerNames, winner)}` : "Draw!";
    const tone = winner ? "winner" : "draw";

    return (
      <div className={`status status--${tone}`} role="status" aria-live="polite">
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className="turn-indicator" role="status" aria-live="polite">
      <div
        className={`turn-indicator__player turn-indicator__player--x${
          xIsNext ? " turn-indicator__player--active" : ""
        }`}
      >
        <span className="turn-indicator__name">{nameFor(playerNames, "X")}</span>
        {timerActive && xIsNext && (
          <span className="status__timer" aria-label={`${secondsLeft} seconds left`}>
            {secondsLeft}s
          </span>
        )}
      </div>

      <span className="turn-indicator__vs">vs</span>

      <div
        className={`turn-indicator__player turn-indicator__player--o${
          !xIsNext ? " turn-indicator__player--active" : ""
        }`}
      >
        <span className="turn-indicator__name">{nameFor(playerNames, "O")}</span>
        {timerActive && !xIsNext && (
          <span className="status__timer" aria-label={`${secondsLeft} seconds left`}>
            {secondsLeft}s
          </span>
        )}
      </div>
    </div>
  );
}
