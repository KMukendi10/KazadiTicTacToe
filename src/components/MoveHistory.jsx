function describeMove(entry, index) {
  if (index === 0) return "Game start";
  const row = Math.floor(entry.lastIndex / 3) + 1;
  const col = (entry.lastIndex % 3) + 1;
  const player = index % 2 === 1 ? "X" : "O";
  return `Move #${index} — ${player} → row ${row}, col ${col}`;
}

export default function MoveHistory({ history, currentMove, onJumpTo }) {
  return (
    <section className="panel move-history" aria-label="Move history">
      <div className="panel__header">
        <h2>Move History</h2>
      </div>
      <ol className="move-history__list">
        {history.map((entry, index) => {
          const isCurrent = index === currentMove;
          return (
            <li key={index}>
              <button
                className={`move-history__item${isCurrent ? " move-history__item--current" : ""}`}
                onClick={() => onJumpTo(index)}
                aria-current={isCurrent}
              >
                {describeMove(entry, index)}
                {isCurrent && <span className="move-history__tag">current</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
