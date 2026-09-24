import { useEffect, useRef, useState } from "react";
import MarkIcon from "./MarkIcon";

const SHAPE_COUNT = 12;
const PROXIMITY_RADIUS = 220;
const BURST_LIFETIME_MS = 900;

function generateShapes() {
  const marks = ["X", "O"];
  return Array.from({ length: SHAPE_COUNT }, (_, i) => ({
    id: i,
    mark: marks[i % 2],
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 36 + Math.random() * 64,
    depth: 8 + Math.random() * 26,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * -20,
  }));
}

export default function GameBackground() {
  const [shapes] = useState(generateShapes);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [pointerPx, setPointerPx] = useState(null);
  const [bursts, setBursts] = useState([]);
  const frameRef = useRef(null);
  const burstIdRef = useRef(0);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    function handlePointerMove(event) {
      if (frameRef.current) return;

      frameRef.current = requestAnimationFrame(() => {
        setPointer({
          x: (event.clientX / window.innerWidth - 0.5) * 2,
          y: (event.clientY / window.innerHeight - 0.5) * 2,
        });
        setPointerPx({ x: event.clientX, y: event.clientY });
        frameRef.current = null;
      });
    }

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Clear any pending burst-removal timers on unmount.
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Clicking open background space pops a little X/O burst where the
  // pointer landed — a small bit of game-board flavor, and it never
  // fires over the actual UI since that sits above this layer.
  function handleBackgroundClick(event) {
    const id = burstIdRef.current++;
    const mark = Math.random() < 0.5 ? "X" : "O";

    setBursts((current) => [
      ...current,
      { id, x: event.clientX, y: event.clientY, mark },
    ]);

    const timeoutId = setTimeout(() => {
      setBursts((current) => current.filter((burst) => burst.id !== id));
    }, BURST_LIFETIME_MS);

    timeoutsRef.current.push(timeoutId);
  }

  return (
    <div
      className="game-bg"
      aria-hidden="true"
      onClick={handleBackgroundClick}
    >
      <div className="game-bg__grid" />
      <div className="game-bg__glow game-bg__glow--x" />
      <div className="game-bg__glow game-bg__glow--o" />

      {shapes.map((shape) => {
        // Shapes glow and grow a little as the cursor gets close —
        // makes the drifting marks feel alive rather than decorative.
        let proximity = 0;

        if (pointerPx) {
          const shapeX = (shape.left / 100) * window.innerWidth;
          const shapeY = (shape.top / 100) * window.innerHeight;
          const distance = Math.hypot(
            pointerPx.x - shapeX,
            pointerPx.y - shapeY
          );
          proximity = Math.max(0, 1 - distance / PROXIMITY_RADIUS);
        }

        return (
          <div
            key={shape.id}
            className="game-bg__shape"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              width: shape.size,
              height: shape.size,
              color: shape.mark === "X" ? "var(--accent-x)" : "var(--accent-o)",
              opacity: 0.1 + proximity * 0.45,
              transform: `translate(${pointer.x * shape.depth}px, ${
                pointer.y * shape.depth
              }px) scale(${1 + proximity * 0.5})`,
            }}
          >
            <div
              className="game-bg__drift"
              style={{
                animationDuration: `${shape.duration}s`,
                animationDelay: `${shape.delay}s`,
              }}
            >
              <MarkIcon mark={shape.mark} />
            </div>
          </div>
        );
      })}

      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="game-bg__burst"
          style={{
            left: burst.x,
            top: burst.y,
            color: burst.mark === "X" ? "var(--accent-x)" : "var(--accent-o)",
          }}
        >
          <span className="game-bg__burst-ring" />
          <span className="game-bg__burst-mark">
            <MarkIcon mark={burst.mark} />
          </span>
        </div>
      ))}
    </div>
  );
}
