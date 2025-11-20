import { startTimer, stopTimer } from "./timers.js";
import { calculateScore } from "./scoring.js";

let currentCategory = "";
let currentType = ""; // Will store: 'emojies', 'quotes', 'lyrics', 'easy', 'hard'
let questions = [];
let score = 0;
let correctAnswers = 0;
let strikes = 0;

const difficultyScreen = document.querySelector(".difficulty-screen");

const totalQuestions = 10;
let currentQuestionIndex = 0;

//screen navigation functions
function hideAllScreens() {
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".quiz-overview").style.display = "none";
  difficultyScreen.style.display = "none";
  document.querySelector(".quiz-container").style.display = "none";
  document.querySelector(".result-screen").style.display = "none";
  document.getElementById("progress-container").style.display = "none";
}

//event listeners
document.getElementById("start-next-btn").addEventListener("click", () => {
  hideAllScreens();
  document.querySelector(".quiz-overview").style.display = "block";
});
document.getElementById("back-to-categories").addEventListener("click", () => {
  hideAllScreens();
  document.querySelector(".quiz-overview").style.display = "block";
});
document.getElementById("quiz-next-btn").addEventListener("click", () => {
  currentQuestionIndex++;
  // Reset option buttons styling
  document.querySelectorAll(".option").forEach((btn) => {
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
  });

  showQuestion();
  saveQuizState();
});
document.getElementById("restart-btn").addEventListener("click", () => {
  startQuiz(); // Restart with same category and type
});

document
  .getElementById("back-to-categories-btn")
  .addEventListener("click", () => {
    localStorage.removeItem("quizState");
    hideAllScreens();
    document.querySelector(".quiz-overview").style.display = "block";
  });

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const category = e.target.dataset.category;

    // Map button data-category to actual file names
    const categoryMap = {
      all: "movie",
      animated: "music",
      action: "programming",
    };

    currentCategory = categoryMap[category];

    // Show difficulty screen and populate options
    showDifficultyOptions(currentCategory);
  });
});

// Function to show difficulty/type options based on selected category
function showDifficultyOptions(category) {
  hideAllScreens();
  difficultyScreen.style.display = "block";

  const buttonContainer = document.getElementById("difficulty-buttons");
  buttonContainer.innerHTML = ""; // Clear previous buttons

  // Different options based on category
  const options = {
    movie: ["Emojis", "Quotes"],
    music: ["Emojis", "Lyrics"],
    programming: ["Easy", "Hard"],
  };

  const typeMap = {
    Emojis: "emojies",
    Quotes: "quotes",
    Lyrics: "lyrics",
    Easy: "easy",
    Hard: "hard",
  };

  options[category].forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "difficulty-btn";
    btn.addEventListener("click", () => {
      currentType = typeMap[option];
      startQuiz();
    });
    buttonContainer.appendChild(btn);
  });
}

// Function to start the quiz
async function startQuiz() {
  // Reset state
  currentQuestionIndex = 0;
  score = 0;
  correctAnswers = 0;
  strikes = 0;

  // Load questions from JSON file
  await loadQuestions(currentCategory, currentType);

  // Show quiz screen
  hideAllScreens();
  document.querySelector(".quiz-container").style.display = "block";
  document.getElementById("progress-container").style.display = "block";

  // Show first question
  showQuestion();
}
async function loadQuestions(category, type) {
  try {
    const response = await fetch(`data/${category}.json`);
    const data = await response.json();
    questions = data[type] || [];

    // Limit to 10 questions
    questions = questions.slice(0, totalQuestions);

    console.log(
      `Loaded ${questions.length} questions for ${category} - ${type}`
    );
  } catch (error) {
    console.error("Error loading questions:", error);
    alert("Failed to load quiz questions. Please try again.");
  }
}

function selectAnswer(selectedIndex) {
  const timeElapsed = stopTimer(currentQuestionIndex);
  const q = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === q.answer;

  // Disable all option buttons
  document.querySelectorAll(".option").forEach((btn) => (btn.disabled = true));

  // Show correct answer in green
  const buttons = document.querySelectorAll(".option");
  buttons[q.answer].classList.add("correct");

  // Show wrong answer in red if user was incorrect
  if (!isCorrect && selectedIndex !== -1) {
    buttons[selectedIndex].classList.add("wrong");
    strikes++;
  }

  // Calculate and update score
  if (isCorrect) {
    const points = calculateScore(timeElapsed, strikes, false, currentType);
    score += points;
    correctAnswers++;
  } else {
    score = Math.max(0, score - 100); // Penalty
  }

  // Show next button
  document.getElementById("quiz-next-btn").style.display = "block";
  saveQuizState();
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }
  updateProgressBar();
  const q = questions[currentQuestionIndex];

  // Update question text
  document.getElementById("question").innerHTML = q.question;

  // Create option buttons
  const container = document.querySelector(".options");
  container.innerHTML = "";

  q.alternatives.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index);
    container.appendChild(btn);
  });

  // Hide next button initially
  document.getElementById("quiz-next-btn").style.display = "none";

  // Start timer for this question
  startTimer(currentQuestionIndex);
}

function endQuiz() {
  hideAllScreens();
  document.querySelector(".result-screen").style.display = "block";
  document.getElementById("progress-container").style.display = "none";
  document.getElementById(
    "final-score"
  ).textContent = ` ${score} points (${correctAnswers} correct) `;
  document.getElementById("total-questions").textContent = questions.length;
  localStorage.removeItem("quizState");
}

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const text = document.getElementById("progress-text");
  const bar = document.getElementById("progress-bar");

  bar.style.width = progress + "%";
  text.textContent = `Question ${
    currentQuestionIndex + 1
  } of ${totalQuestions}`;
}
function saveQuizState() {
  const quizState = {
    currentCategory,
    currentType,
    currentQuestionIndex,
    score,
    correctAnswers,
    strikes,
    questions,
  };
  localStorage.setItem("quizState", JSON.stringify(quizState));
}

// Initialize - show start screen on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedState = localStorage.getItem("quizState");

  if (savedState) {
    // Resume quiz
    const state = JSON.parse(savedState);
    currentCategory = state.currentCategory;
    currentType = state.currentType;
    currentQuestionIndex = state.currentQuestionIndex;
    score = state.score;
    correctAnswers = state.correctAnswers;
    strikes = state.strikes;
    questions = state.questions;

    // Show quiz screen and resume
    hideAllScreens();
    document.querySelector(".quiz-container").style.display = "block";
    document.getElementById("progress-container").style.display = "block";
    showQuestion();
  } else {
    // Start fresh
    hideAllScreens();
    document.querySelector(".start-screen").style.display = "block";
  }
});
