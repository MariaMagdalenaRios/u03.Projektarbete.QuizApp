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
  updateProgressBar();
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

function updateProgressBar() {
  if (currentQuestionIndex >= totalQuestions) {
    return;
  }

  currentQuestionIndex++;
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  const text = document.getElementById("progress-text");
  const bar = document.getElementById("progress-bar");

  bar.style.width = progress + "%";
  text.textContent = `Question ${currentQuestionIndex} of ${totalQuestions}`;

  console.log(`Current question: ${currentQuestionIndex}`);
  console.log(`Progress: ${progress}%`);
}
updateProgressBar();

loadQuizData("music", "emoji");
