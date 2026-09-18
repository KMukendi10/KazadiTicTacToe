export default function SettingsPanel({
  playerNames,
  onNameChange,
  mode,
  onModeChange,
  difficulty,
  onDifficultyChange,
  timerEnabled,
  onToggleTimer,
  soundOn,
  onToggleSound,
  theme,
  onToggleTheme,
}) {
  return (
    <section className="panel settings" aria-label="Game settings">
      <div className="panel__header">
        <h2>Settings</h2>
      </div>

      <div className="settings__row">
        <label className="settings__label" htmlFor="mode-select">
          Opponent
        </label>
        <select id="mode-select" value={mode} onChange={(e) => onModeChange(e.target.value)}>
          <option value="pvp">2 Players</option>
          <option value="vsComputer">Computer</option>
        </select>
      </div>

      {mode === "vsComputer" && (
        <div className="settings__row">
          <label className="settings__label" htmlFor="difficulty-select">
            Difficulty
          </label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="unbeatable">Unbeatable</option>
          </select>
        </div>
      )}

      <div className="settings__row">
        <label className="settings__label" htmlFor="name-x">
          Player X name
        </label>
        <input
          id="name-x"
          type="text"
          maxLength={16}
          value={playerNames.X}
          onChange={(e) => onNameChange("X", e.target.value)}
        />
      </div>

      {mode === "pvp" && (
        <div className="settings__row">
          <label className="settings__label" htmlFor="name-o">
            Player O name
          </label>
          <input
            id="name-o"
            type="text"
            maxLength={16}
            value={playerNames.O}
            onChange={(e) => onNameChange("O", e.target.value)}
          />
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
