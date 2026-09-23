import { useEffect, useState } from "react";

export default function SettingsPanel({
  mode,
  difficulty,
  onDifficultyChange,
  timerEnabled,
  onToggleTimer,
  soundOn,
  onToggleSound,
  theme,
  onToggleTheme,
  matchTarget,
  onMatchTargetChange,
}) {
  // Race-to and Difficulty are staged locally and only committed (via the
  // parent's confirm-to-restart flow) when Enter is pressed — everything
  // else here (timer/sound/theme) applies immediately as it's toggled.
  const [pendingMatchTarget, setPendingMatchTarget] = useState(matchTarget ?? "off");
  const [pendingDifficulty, setPendingDifficulty] = useState(difficulty);

  useEffect(() => {
    setPendingMatchTarget(matchTarget ?? "off");
  }, [matchTarget]);

  useEffect(() => {
    setPendingDifficulty(difficulty);
  }, [difficulty]);

  function commitMatchTarget() {
    const nextValue = pendingMatchTarget === "off" ? null : Number(pendingMatchTarget);
    if (nextValue !== (matchTarget ?? null)) {
      onMatchTargetChange(nextValue);
    }
  }

  function commitDifficulty() {
    if (pendingDifficulty !== difficulty) {
      onDifficultyChange(pendingDifficulty);
    }
  }

  function handleEnterCommit(commitFn) {
    return (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitFn();
      }
    };
  }

  return (
    <section className="panel settings" aria-label="Game settings">
      <div className="panel__header">
        <h2>Settings</h2>
      </div>

      <div className="settings__row">
        <label className="settings__label" htmlFor="match-target-select">
          Race to
        </label>
        <select
          id="match-target-select"
          value={pendingMatchTarget}
          onChange={(e) => setPendingMatchTarget(e.target.value)}
          onKeyDown={handleEnterCommit(commitMatchTarget)}
        >
          <option value="off">Off</option>
          <option value="3">3 wins</option>
          <option value="5">5 wins</option>
          <option value="10">10 wins</option>
        </select>
        <p className="settings__hint">Press Enter to apply</p>
      </div>

      {mode === "vsComputer" && (
        <div className="settings__row">
          <label className="settings__label" htmlFor="difficulty-select">
            Difficulty
          </label>
          <select
            id="difficulty-select"
            value={pendingDifficulty}
            onChange={(e) => setPendingDifficulty(e.target.value)}
            onKeyDown={handleEnterCommit(commitDifficulty)}
          >
            <option value="easy">Easy</option>
            <option value="unbeatable">Unbeatable</option>
          </select>
          <p className="settings__hint">Press Enter to apply</p>
        </div>
      )}

      <div className="settings__toggles">
        <label className="settings__checkbox">
          <input type="checkbox" checked={timerEnabled} onChange={onToggleTimer} />
          Turn timer (10s)
        </label>
        <label className="settings__checkbox">
          <input type="checkbox" checked={soundOn} onChange={onToggleSound} />
          Sound
        </label>
        <label className="settings__checkbox">
          <input type="checkbox" checked={theme === "light"} onChange={onToggleTheme} />
          Light theme
        </label>
      </div>
    </section>
  );
}
