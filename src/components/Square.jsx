export default function Square({ value, onClick, isWinning, disabled, previewValue }) {
  const classes = ["square"];
  if (value) classes.push(`square--${value.toLowerCase()}`);
  if (isWinning) classes.push("square--winning");

  return (
    <button
      className={classes.join(" ")}
      onClick={onClick}
      disabled={disabled || Boolean(value)}
      data-preview={!value && !disabled ? previewValue : undefined}
      aria-label={value ? `Square filled with ${value}` : "Empty square"}
    >
      {value && (
        // key={value} forces a remount when a mark is placed, which is what
        // lets the CSS "pop" keyframe replay from scratch every time.
        <span key={value} className="square__mark">
          {value}
        </span>
      )}
    </button>
  );
}
