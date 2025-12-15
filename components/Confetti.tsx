"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  velocityX: number;
  velocityY: number;
  shape: "circle" | "square" | "star" | "ribbon";
  opacity: number;
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
  pieceCount?: number;
}

const COLORS = [
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Teal
  "#FFE66D", // Sunshine Yellow
  "#95E1D3", // Mint
  "#F38181", // Salmon
  "#AA96DA", // Lavender
  "#FCBAD3", // Pink
  "#A8E6CF", // Seafoam
  "#FFD93D", // Gold
  "#6BCB77", // Green
  "#4D96FF", // Blue
  "#FF6B9D", // Hot Pink
];

const createConfettiPiece = (id: number, width: number): ConfettiPiece => {
  const shapes: ConfettiPiece["shape"][] = [
    "circle",
    "square",
    "star",
    "ribbon",
  ];
  return {
    id,
    x: Math.random() * width,
    y: -20 - Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 8 + Math.random() * 12,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    velocityX: (Math.random() - 0.5) * 6,
    velocityY: 2 + Math.random() * 4,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    opacity: 0.8 + Math.random() * 0.2,
  };
};

const renderShape = (piece: ConfettiPiece) => {
  const { shape, size, color } = piece;

  switch (shape) {
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
        </svg>
      );
    case "ribbon":
      return (
        <div
          style={{
            width: size * 0.3,
            height: size * 1.5,
            background: `linear-gradient(180deg, ${color} 0%, ${color}CC 50%, ${color} 100%)`,
            borderRadius: "2px",
          }}
        />
      );
    case "square":
      return (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: "2px",
          }}
        />
      );
    case "circle":
    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: "50%",
          }}
        />
      );
  }
};

export default function Confetti({
  isActive,
  onComplete,
  duration = 2500,
  pieceCount = 80,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize confetti pieces when activated
  useEffect(() => {
    if (isActive && !isAnimating) {
      const width = typeof window !== "undefined" ? window.innerWidth : 1000;
      const newPieces = Array.from({ length: pieceCount }, (_, i) =>
        createConfettiPiece(i, width)
      );
      setPieces(newPieces);
      setIsAnimating(true);
    }
  }, [isActive, isAnimating, pieceCount]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || pieces.length === 0) return;

    let animationId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= duration) {
        setIsAnimating(false);
        setPieces([]);
        onComplete?.();
        return;
      }

      setPieces((prevPieces) =>
        prevPieces.map((piece) => ({
          ...piece,
          x: piece.x + piece.velocityX,
          y: piece.y + piece.velocityY,
          rotation: piece.rotation + piece.rotationSpeed,
          velocityY: piece.velocityY + 0.15, // Gravity
          velocityX: piece.velocityX * 0.99, // Air resistance
          opacity: Math.max(0, piece.opacity - 0.002),
        }))
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAnimating, duration, onComplete, pieces.length]);

  if (!isAnimating || pieces.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute will-change-transform"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: piece.opacity,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        >
          {renderShape(piece)}
        </div>
      ))}
    </div>
  );
}
