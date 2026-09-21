export default function Scoreboard({
  scores,
  onResetScores,
  canReset = true,
  playerNames,
}) {
  const nameX = playerNames.X?.trim() || "Player X";
  const nameO = playerNames.O?.trim() || "Player O";

  return (
    <section className="panel scoreboard" aria-label="Scoreboard">
      <div className="panel__header">
        <h2>Scoreboard</h2>
        <button
          className="link-btn"
          type="button"
          onClick={onResetScores}
          disabled={!canReset}
          title={
            canReset
              ? undefined
              : "Nothing to reset yet — finish a round first"
          }
        >
          Reset Game
        </button>
      </div>
      <div className="scoreboard__grid">
        <div className="scoreboard__stat scoreboard__stat--x">
          <span className="scoreboard__value">{scores.X}</span>
          <span className="scoreboard__label">{nameX}</span>
        </div>
        <div className="scoreboard__stat scoreboard__stat--o">
          <span className="scoreboard__value">{scores.O}</span>
          <span className="scoreboard__label">{nameO}</span>
        </div>
        <div className="scoreboard__stat">
          <span className="scoreboard__value">{scores.draws}</span>
          <span className="scoreboard__label">Draws</span>
        </div>
      </div>
    </section>
  );
}
