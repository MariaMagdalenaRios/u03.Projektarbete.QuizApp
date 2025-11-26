const startingScore = 3000;

export const calculateScore = (timeTaken, strike, hintUsed, mode) => {
  // Base score calculation
  let score = startingScore - timeTaken * 70 + strike * 100;

  // Apply hint penalty
  if (hintUsed) {
    score /= 2;
  }

  // Apply difficulty multiplier
  if (!hintUsed && (mode === "hard" || mode === "emoji")) {
    score *= 2;
  }

  // Never go below 0
  return Math.max(0, Math.floor(score));
};

// Example usage
console.log(calculateScore(20, 0, true, "easy"));
