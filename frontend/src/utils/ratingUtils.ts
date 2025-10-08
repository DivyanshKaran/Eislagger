export function renderStars(rating: number, maxRating: number = 5): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
  );
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) {
    return "text-green-600";
  } else if (rating >= 3.5) {
    return "text-yellow-600";
  } else if (rating >= 2.5) {
    return "text-orange-600";
  } else {
    return "text-red-600";
  }
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) {
    return "Excellent";
  } else if (rating >= 3.5) {
    return "Good";
  } else if (rating >= 2.5) {
    return "Average";
  } else if (rating >= 1.5) {
    return "Poor";
  } else {
    return "Very Poor";
  }
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
}

export function getRatingDistribution(
  ratings: number[],
): Record<number, number> {
  const distribution: Record<number, number> = {};

  for (let i = 1; i <= 5; i++) {
    distribution[i] = 0;
  }

  ratings.forEach((rating) => {
    const roundedRating = Math.round(rating);
    if (roundedRating >= 1 && roundedRating <= 5) {
      distribution[roundedRating]++;
    }
  });

  return distribution;
}

export function formatRating(rating: number, decimals: number = 1): string {
  return rating.toFixed(decimals);
}

export function isValidRating(rating: number, maxRating: number = 5): boolean {
  return rating >= 0 && rating <= maxRating && !isNaN(rating);
}
