export default function MarkIcon({ mark }) {
  if (mark === "X") {
    return (
      <svg viewBox="0 0 100 100" className="mark-icon mark-icon--x" aria-hidden="true">
        <line x1="22" y1="22" x2="78" y2="78" />
        <line x1="78" y1="22" x2="22" y2="78" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="mark-icon mark-icon--o" aria-hidden="true">
      <circle cx="50" cy="50" r="32" />
    </svg>
  );
}
