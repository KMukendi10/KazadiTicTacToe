export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-live="assertive"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={onConfirm}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
