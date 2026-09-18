import { forwardRef } from "react";
import MarkIcon from "./MarkIcon";

const Square = forwardRef(function Square(
  { value, onClick, onKeyDown, onFocus, tabIndex, isWinning, disabled, previewValue },
  ref
) {
  const classes = ["square"];
  if (value) classes.push(`square--${value.toLowerCase()}`);
  if (isWinning) classes.push("square--winning");

  return (
    <button
      ref={ref}
      className={classes.join(" ")}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      tabIndex={tabIndex}
      disabled={disabled || Boolean(value)}
      data-preview={!value && !disabled ? previewValue : undefined}
      aria-label={value ? `Square filled with ${value}` : "Empty square"}
    >
      {value && (
        // key={value} forces a remount when a mark is placed, which is what
        // lets the CSS draw-in animation replay from scratch every time.
        <span key={value} className="square__mark">
          <MarkIcon mark={value} />
        </span>
      )}
    </button>
  );
});

export default Square;
