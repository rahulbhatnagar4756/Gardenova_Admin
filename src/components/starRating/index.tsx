import React, { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number; // e.g. 4.3
  maxStars?: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  onChange?: (newRating: number) => void; // Click-to-update handler
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 20,
  filledColor = "#FFD700", // gold
  emptyColor = "#d3d3d3", // light gray
  onChange,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Choose which value to display (hover > actual)
  const displayRating = hoverRating ?? rating;

  // Calculate the stars with fractional fill
  const getFillPercentage = (starIndex: number) => {
    const value = starIndex + 1;
    if (displayRating >= value) return 100;
    if (displayRating < value - 1) return 0;
    return (displayRating - starIndex) * 100;
  };

  // Handle mouse move — detect fractional hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange || !containerRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = Math.max(0, Math.min(1, x / width)); // clamp between 0-1
    const preciseRating = +(percent * maxStars).toFixed(1); // round to one decimal
    setHoverRating(Math.min(maxStars, Math.max(0, preciseRating)));
  };

  // Handle mouse leave — reset hover
  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  // Handle click — set final rating
  const handleClick = () => {
    if (hoverRating && onChange) {
      onChange(Number(hoverRating.toFixed(1)));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        cursor: onChange ? "pointer" : "default",
        width: maxStars * (size + 4),
      }}
    >
      {/* ✅ Tooltip showing fractional hover value */}
      <div
        style={{
          position: "absolute",
          top: "-28px",
          background: "#333",
          color: "#fff",
          fontSize: "12px",
          padding: "4px 8px",
          borderRadius: "6px",
          visibility: hoverRating !== null ? "visible" : "hidden",
          opacity: hoverRating !== null ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {(hoverRating ?? rating).toFixed(1)}
      </div>

      {/* ⭐ Stars */}
      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: maxStars }).map((_, i) => {
          const fillPercentage = getFillPercentage(i);
          return (
            <div
              key={i}
              style={{
                position: "relative",
                width: size,
                height: size,
              }}
            >
              {/* Empty Star */}
              <FaStar
                size={size}
                color={emptyColor}
                style={{ position: "absolute", top: 0, left: 0 }}
              />

              {/* Filled Star (with clipPath for fraction) */}
              <FaStar
                size={size}
                color={filledColor}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
                  transition: "clip-path 0.1s ease",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
