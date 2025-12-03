/**
 * Props for the StarRating component, used to display and interact with a star-based rating UI.
 *
 * @property rating - The current rating value (e.g., 4.3).
 * @property maxStars - Total number of stars to display (default is typically 5).
 * @property size - Size of each star in pixels.
 * @property filledColor - Color of filled (active) stars.
 * @property emptyColor - Color of empty (inactive) stars.
 * @property onChange - Optional handler triggered when user selects a new rating.
 */
export interface StarRatingProps {
  rating: number; // e.g. 4.3
  maxStars?: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  onChange?: (newRating: number) => void; // Click-to-update handler
}
