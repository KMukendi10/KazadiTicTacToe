export default function SettingsPanel({
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

      <p className="settings__note">
        Mode, difficulty, and race length are set on the start screen — use
        "Start Over" to change them.
      </p>

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
