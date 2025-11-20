export interface StarRatingProps {
  rating: number; // e.g. 4.3
  maxStars?: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  onChange?: (newRating: number) => void; // Click-to-update handler
}
