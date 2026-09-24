import { TrophyIcon } from "./icons";

export default function MatchBanner({ winnerName, scores, matchTarget, onNewMatch }) {
  return (
    <div className="match-banner" role="status">
      <span className="match-banner__trophy" aria-hidden="true">
        <TrophyIcon size={28} />
      </span>
      <p className="match-banner__title">{winnerName} wins the match!</p>
      <p className="match-banner__score">
        Race to {matchTarget} — final score {scores.X}–{scores.O}
      </p>
      <button className="btn btn--primary" onClick={onNewMatch}>
        Start New Match
      </button>
    </div>
  );
}
