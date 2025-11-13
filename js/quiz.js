// State
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let questions = [];

// Load questions
async function loadQuestions(category, type) {
  const response = await fetch(`data/${category}.json`);
  const data = await response.json();
  questions = data[type] || [];
  console.log(`Loaded ${questions.length} questions`);
}

// Start quiz
function startQuiz(category, type) {
  currentQuestionIndex = 0;
  score = 0;
  correctAnswers = 0;

  loadQuestions(category, type).then(() => {
    hideAllScreens();
    document.querySelector(".quiz-container").style.display = "block";
    showQuestion();
  });
}

// Show current question
function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }

  const q = questions[currentQuestionIndex];

  // Update question
  document.getElementById("question").innerHTML = q.question;

  // Update options
  const container = document.querySelector(".options");
  container.innerHTML = "";

  q.alternatives.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(i);
    container.appendChild(btn);
  });

  // Hide next button
  document.getElementById("quiz-next-btn").style.display = "none";

  // Start timer
  startTimer(() => selectAnswer(-1));
}

// Handle answer
function selectAnswer(selectedIndex) {
  const timeElapsed = stopTimer();
  const q = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === q.answer;

  // Disable buttons
  document.querySelectorAll(".option").forEach((btn) => (btn.disabled = true));

  // Show correct/wrong
  const buttons = document.querySelectorAll(".option");
  buttons[q.answer].classList.add("correct");
  if (!isCorrect && selectedIndex !== -1) {
    buttons[selectedIndex].classList.add("wrong");
  }

  // Update score
  if (isCorrect) {
    score += calculatePoints(timeElapsed, true);
    correctAnswers++;
  } else {
    score = Math.max(0, score - 100); // Strike penalty
  }

  // Show next button
  document.getElementById("quiz-next-btn").style.display = "block";
}

// Next question
document.getElementById("quiz-next-btn").addEventListener("click", () => {
  currentQuestionIndex++;

  // Reset buttons
  document.querySelectorAll(".option").forEach((btn) => {
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
  });

  showQuestion();
});

// End quiz
function endQuiz() {
  document.querySelector(".quiz-container").style.display = "none";
  document.querySelector(".result-screen").style.display = "block";
  document.getElementById("final-score").textContent = correctAnswers;
  document.getElementById("total-questions").textContent = questions.length;
}

// Hide all screens
function hideAllScreens() {
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".quiz-overview").style.display = "none";
  document.querySelector(".quiz-container").style.display = "none";
  document.querySelector(".result-screen").style.display = "none";
}
