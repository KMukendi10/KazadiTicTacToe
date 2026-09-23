import { useEffect, useRef, useState } from "react";
import MarkIcon from "./MarkIcon";

function generateShapes() {
  const marks = ["X", "O"];
  return Array.from({ length: 10 }, (_, i) => ({
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
  const frameRef = useRef(null);

  useEffect(() => {
    function handlePointerMove(event) {
      if (frameRef.current) return;

      frameRef.current = requestAnimationFrame(() => {
        setPointer({
          x: (event.clientX / window.innerWidth - 0.5) * 2,
          y: (event.clientY / window.innerHeight - 0.5) * 2,
        });
        frameRef.current = null;
      });
    }

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="game-bg" aria-hidden="true">
      <div className="game-bg__glow game-bg__glow--x" />
      <div className="game-bg__glow game-bg__glow--o" />

      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="game-bg__shape"
          style={{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            width: shape.size,
            height: shape.size,
            color: shape.mark === "X" ? "var(--accent-x)" : "var(--accent-o)",
            transform: `translate(${pointer.x * shape.depth}px, ${pointer.y * shape.depth}px)`,
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
      ))}
    </div>
  );
}
