const totalQuestions = 10;
let currentQuestion = 0;

function updateProgressBar() {
  currentQuestion++;
  const progress = (currentQuestion / totalQuestions) * 100;

  const bar = document.getElementById("progress-bar");

  bar.style.width = progress + "%";
  text.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
}
