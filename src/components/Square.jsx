export default function Square({ value, onClick, isWinning, disabled }) {
  const classes = ["square"];
  if (value) classes.push(`square--${value.toLowerCase()}`);
  if (isWinning) classes.push("square--winning");

  return (
    <button
      className={classes.join(" ")}
      onClick={onClick}
      disabled={disabled || Boolean(value)}
      aria-label={value ? `Square filled with ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}
