import MarkIcon from "./MarkIcon";

export default function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__ring">
        <span className="loader__mark loader__mark--x">
          <span className="loader__mark-inner">
            <MarkIcon mark="X" />
          </span>
        </span>
        <span className="loader__mark loader__mark--o">
          <span className="loader__mark-inner">
            <MarkIcon mark="O" />
          </span>
        </span>
      </div>
      <p className="loader__text">Loading…</p>
    </div>
  );
}
