const MODE_LABEL = {
  pvp: "Multiplayer",
  vsComputer: "Vs Computer",
};

export default function MatchMeta({ mode, matchTarget }) {
  const modeLabel = MODE_LABEL[mode] || mode;

  return (
    <div className="match-meta" role="status" aria-live="off">
      <span className="match-meta__pill match-meta__pill--mode">
        {modeLabel}
      </span>

      {matchTarget ? (
        <span className="match-meta__pill match-meta__pill--race">
          Race to {matchTarget}
        </span>
      ) : null}
    </div>
  );
}
