import { useState } from "react";

const COLORS = ["var(--accent-x)", "var(--accent-o)", "var(--text)"];

function generatePieces() {
  return Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    duration: 1.3 + Math.random() * 0.8,
    color: COLORS[i % COLORS.length],
    rotate: Math.round(Math.random() * 360),
  }));
}

export default function Confetti() {
  const [pieces] = useState(generatePieces);

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti__piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
