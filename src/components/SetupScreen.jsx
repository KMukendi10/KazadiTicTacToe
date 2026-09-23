import { useState } from "react";

export default function SetupScreen({
  initialMode,
  initialDifficulty,
  initialNames,
  onStart,
  onCancel,
  showCancel,
}) {
  const [mode, setMode] = useState(initialMode);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [nameX, setNameX] = useState(initialNames.X === "Computer" ? "" : initialNames.X);
  const [nameO, setNameO] = useState(initialNames.O === "Computer" ? "" : initialNames.O);

  function handleSubmit(event) {
    event.preventDefault();
    onStart({
      mode,
      difficulty,
      names: {
        X: nameX.trim() || "Player X",
        O: mode === "vsComputer" ? "Computer" : nameO.trim() || "Player O",
      },
    });
  }

  return (
    <div className="setup-overlay">
      <form className="setup-card" onSubmit={handleSubmit}>
        <h2 className="setup-card__title">Ready to play?</h2>
        <p className="setup-card__subtitle">
          Choose how you want to play, then who's playing.
        </p>

        <div className="setup-card__modes">
          <button
            type="button"
            className={`setup-mode${mode === "pvp" ? " setup-mode--active" : ""}`}
            onClick={() => setMode("pvp")}
          >
            <span className="setup-mode__icon" aria-hidden="true">
              🧑‍🤝‍🧑
            </span>
            <span>2 Players</span>
          </button>

          <button
            type="button"
            className={`setup-mode${mode === "vsComputer" ? " setup-mode--active" : ""}`}
            onClick={() => setMode("vsComputer")}
          >
            <span className="setup-mode__icon" aria-hidden="true">
              🤖
            </span>
            <span>vs Computer</span>
          </button>
        </div>

        {mode === "vsComputer" && (
          <label className="setup-card__field">
            <span>Difficulty</span>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="unbeatable">Unbeatable</option>
            </select>
          </label>
        )}

        <label className="setup-card__field">
          <span>{mode === "vsComputer" ? "Your name (X)" : "Player X name"}</span>
          <input
            type="text"
            maxLength={16}
            value={nameX}
            onChange={(e) => setNameX(e.target.value)}
            placeholder="Player X"
            autoFocus
          />
        </label>

        {mode === "pvp" && (
          <label className="setup-card__field">
            <span>Player O name</span>
            <input
              type="text"
              maxLength={16}
              value={nameO}
              onChange={(e) => setNameO(e.target.value)}
              placeholder="Player O"
            />
          </label>
        )}

        <div className="setup-card__actions">
          {showCancel && (
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn--primary">
            Start Game
          </button>
        </div>
      </form>
    </div>
  );
}
