// StarRating.tsx
import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number; // e.g. 4.3
  maxStars?: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 20,
  filledColor = "#FFD700", // gold
  emptyColor = "#d3d3d3", // light gray
}) => {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {Array.from({ length: maxStars }, (_, i) => {
        const value = i + 1;
        const fillPercentage =
          rating >= value ? 100 : rating < value - 1 ? 0 : (rating - i) * 100;

        return (
          <div
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              width: size,
              height: size,
            }}
          >
            {/* Empty star (background) */}
            <FaStar
              size={size}
              color={emptyColor}
              style={{ position: "absolute", top: 0, left: 0 }}
            />

            {/* Filled star (foreground with gradient mask) */}
            <FaStar
              size={size}
              color={filledColor}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
