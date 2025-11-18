const startingScore = 3000

const strike = 0

const calculateScore = (timeTaken, strike, hintUsed, mode) => {
    let score = startingScore - timeTaken * 70 + strike * 100 
    if (hintUsed) {
        score /= 2
    } else if (mode === 'hard' || mode === 'emoji') {
        score *= 2
    }

    return Math.max(0, Math.floor(score))
}

console.log(calculateScore(20, 0, true, 'easy')) // Example usage