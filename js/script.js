const totalQuestions = 10;
let currentQuestion = 0;

function updateProgressBar() {
  
  if (currentQuestion >= totalQuestions) {
    return; 
  }

  currentQuestion++;
  const progress = (currentQuestion / totalQuestions) * 100;

  const text = document.getElementById("progress-text");
  const bar = document.getElementById("progress-bar");
  
  bar.style.width = progress + "%";
  text.textContent = `Question ${currentQuestion} of ${totalQuestions}`;

  console.log(`Current question: ${currentQuestion}`);
  console.log(`Progress: ${progress}%`);
}
updateProgressBar()

