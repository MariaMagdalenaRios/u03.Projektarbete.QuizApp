import { startTimer, stopTimer } from "./timers.js";
import { calculateScore } from "./scoring.js";

let currentCategory = "";
let currentType = ""; // Will store: 'emojies', 'quotes', 'lyrics', 'easy', 'hard'
let questions = [];
let score = 0;
let correctAnswers = 0;
let strikes = 0;
let hintsLeft = 0;
let isHintOpen = false;

const popup = document.getElementById("hintPopup");
const hintButton = document.getElementById("hintBtn");
let lastCorrect = false
let totalTime = 0

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
  isHintOpen = false;
  showHint()
  saveQuizState();
});
document.getElementById("restart-btn").addEventListener("click", () => {

    // GA4 tracking: user clicked Play Again
  gtag('event', 'play_again', {
    category: currentCategory,
    type: currentType
  });
  
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
    const category = e.currentTarget.dataset.category;

    // Map button data-category to actual file names
    const categoryMap = {
      movies: "movies",
      music: "music",
      coding: "coding",
    };

    currentCategory = categoryMap[category];

     // GA tracking
    gtag('event', 'select_content', {
      content_type: 'category',
      item_id: currentCategory
    });

    // Show difficulty screen and populate options
    showDifficultyOptions(currentCategory);
  });
});

document.getElementById("quit-quiz-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to quit? Your progress will be lost.")) {

    // GA4 tracking: user quit quiz
    gtag('event', 'quiz_quit', {
      category: currentCategory,
      difficulty: currentType,
      questions_answered: currentQuestionIndex,
      total_questions: totalQuestions,
      score: score,
      correct_answers: correctAnswers
    });

    localStorage.removeItem("quizState");
    stopTimer(currentQuestionIndex); // Stop the timer
    hideAllScreens();
    document.querySelector(".quiz-overview").style.display = "block";
  }
});

// Function to show difficulty/type options based on selected category
function showDifficultyOptions(category) {
  hideAllScreens();
  difficultyScreen.style.display = "block";

  const buttonContainer = document.getElementById("difficulty-buttons");
  buttonContainer.innerHTML = ""; // Clear previous buttons

  // Different options based on category
  const options = {
    movies: ["Emojis", "Quotes"],
    music: ["Emojis", "Lyrics"],
    coding: ["Easy", "Hard"],
  };

  const typeMap = {
    Emojis: "emojis",
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

      // GA tracking
    gtag('event', 'select_content', {
      content_type: 'difficulty',
      item_id: currentType
    });

      startQuiz();

      // GA tracking for quiz_start
    gtag('event', 'quiz_start', {
      category: currentCategory,
      difficulty: currentType
    });
    });


    buttonContainer.appendChild(btn);
  });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


// Function to start the quiz
async function startQuiz() {
  // Reset state
  currentQuestionIndex = 0;
  score = 0;
  correctAnswers = 0;
  strikes = 0;
  hintsLeft = 2;
  isHintOpen = false
  lastCorrect = false;
  totalTime = 0

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
    questions = shuffleArray(questions).slice(0, 10);

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

  // GA tracking for each answer
  gtag('event', 'answer_selected', {
    question_id: currentQuestionIndex + 1,
    answer_id: selectedIndex,
    correct: isCorrect
  });

  // Disable all option buttons
  document.querySelectorAll(".option").forEach((btn) => (btn.disabled = true));

  // Show correct answer in green
  const buttons = document.querySelectorAll(".option");
  buttons[q.answer].classList.add("correct");

  // Show wrong answer in red if user was incorrect
  if (!isCorrect && selectedIndex !== -1) {
    buttons[selectedIndex].classList.add("wrong");
  }

  // Calculate and update score
  if (isCorrect) {
    lastCorrect = true
    correctAnswers++;
    totalTime += timeElapsed
    if (lastCorrect) {
      strikes += 1
    }
  } else {
    lastCorrect = false;
    strikes = 0
  }

  console.log(timeElapsed, strikes, currentType)


  // Show next button
  document.getElementById("quiz-next-btn").style.display = "block";
  saveQuizState();
}

function showHint () {
  
  hintButton.innerHTML = isHintOpen ?  questions[currentQuestionIndex].hint : "💡"
  hintButton.style.fontSize = isHintOpen ? "14px" : "25px";
  popup.textContent = hintsLeft ?? 0;
  popup.style.background = hintsLeft > 0 ? "red" : "gray";

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
  score = calculateScore(totalTime, strikes, false, currentType)
  hideAllScreens();
  document.querySelector(".result-screen").style.display = "block";
  document.getElementById("progress-container").style.display = "none";
  document.getElementById(
    "final-score"
  ).textContent = ` ${score} points (${correctAnswers} correct) `;
  document.getElementById("total-questions").textContent = questions.length;

  // GA4 tracking for quiz completion
  gtag('event', 'quiz_completed', {
  category: currentCategory,
  difficulty: currentType,
  score: score,
  total_questions: questions.length
});

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
    hintsLeft,
    isHintOpen, 
    lastCorrect,
    totalTime
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
    hintsLeft = state.hintsLeft;
    isHintOpen = state.isHintOpen


    // Show quiz screen and resume
    hideAllScreens();
    document.querySelector(".quiz-container").style.display = "block";
    document.getElementById("progress-container").style.display = "block";
    showQuestion();
    showHint()
  } else {
    // Start fresh
    hideAllScreens();
    document.querySelector(".start-screen").style.display = "block";
  }
});


hintButton.addEventListener("click", () => {
  if (hintsLeft > 0) {
    if (hintButton.innerHTML === "💡") {
      hintsLeft--;
      isHintOpen = true;
    }

    popup.textContent = hintsLeft;
    hintButton.innerHTML = questions[currentQuestionIndex].hint;
    hintButton.style.fontSize = "14px";
  }

  if (hintsLeft === 0) {
    popup.style.background = "gray";
  }

  saveQuizState(); // <-- save updated state
});
