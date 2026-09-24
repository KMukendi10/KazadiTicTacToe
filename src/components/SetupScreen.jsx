import { useState } from "react";
import { PeopleIcon, RobotIcon } from "./icons";

export default function SetupScreen({
  initialMode,
  initialDifficulty,
  initialNames,
  initialMatchTarget,
  initialHumanMark,
  onStart,
  onCancel,
  showCancel,
}) {
  const [mode, setMode] = useState(initialMode);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [humanMark, setHumanMark] = useState(initialHumanMark ?? "X");
  const [nameX, setNameX] = useState(initialNames.X === "Computer" ? "" : initialNames.X);
  const [nameO, setNameO] = useState(initialNames.O === "Computer" ? "" : initialNames.O);
  const [humanName, setHumanName] = useState(
    initialNames[initialHumanMark ?? "X"] === "Computer" ? "" : initialNames[initialHumanMark ?? "X"]
  );
  const [matchTarget, setMatchTarget] = useState(initialMatchTarget ?? "off");

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "vsComputer") {
      const trimmedName = humanName.trim() || "Player";
      onStart({
        mode,
        difficulty,
        humanMark,
        names: {
          X: humanMark === "X" ? trimmedName : "Computer",
          O: humanMark === "O" ? trimmedName : "Computer",
        },
        matchTarget: matchTarget === "off" ? null : Number(matchTarget),
      });
      return;
    }

    onStart({
      mode,
      difficulty,
      humanMark,
      names: {
        X: nameX.trim() || "Player X",
        O: nameO.trim() || "Player O",
      },
      matchTarget: matchTarget === "off" ? null : Number(matchTarget),
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
              <PeopleIcon size={22} />
            </span>
            <span>Multiplayer</span>
          </button>

          <button
            type="button"
            className={`setup-mode${mode === "vsComputer" ? " setup-mode--active" : ""}`}
            onClick={() => setMode("vsComputer")}
          >
            <span className="setup-mode__icon" aria-hidden="true">
              <RobotIcon size={22} />
            </span>
            <span>vs Computer</span>
          </button>
        </div>

        {mode === "vsComputer" && (
          <div className="setup-card__field">
            <span>Play as</span>
            <div className="setup-card__marks">
              <button
                type="button"
                className={`setup-mode${humanMark === "X" ? " setup-mode--active" : ""}`}
                onClick={() => setHumanMark("X")}
              >  
                <span>X</span>
              </button>
              <button
                type="button"
                className={`setup-mode${humanMark === "O" ? " setup-mode--active" : ""}`}
                onClick={() => setHumanMark("O")}
              >
                <span>O</span>
              </button>
            </div>
          </div>
        )}

        <label className="setup-card__field">
          <span>Race to</span>
          <select value={matchTarget} onChange={(e) => setMatchTarget(e.target.value)}>
            <option value="off">Off</option>
            <option value="3">3 wins</option>
            <option value="5">5 wins</option>
            <option value="10">10 wins</option>
          </select>
        </label>

        {mode === "vsComputer" && (
          <label className="setup-card__field">
            <span>Difficulty</span>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="unbeatable">Unbeatable</option>
            </select>
          </label>
        )}

        {mode === "vsComputer" ? (
          <label className="setup-card__field">
            <span>Your name</span>
            <input
              type="text"
              maxLength={16}
              value={humanName}
              onChange={(e) => setHumanName(e.target.value)}
              placeholder="Player"
              autoFocus
            />
          </label>
        ) : (
          <>
            <label className="setup-card__field">
              <span>Player X name</span>
              <input
                type="text"
                maxLength={16}
                value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                placeholder="Player X"
                autoFocus
              />
            </label>

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
          </>
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
