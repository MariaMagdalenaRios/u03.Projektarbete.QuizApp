
const timerElement = document.getElementById('timer');
let count = 0;        
let intervalId = null;  

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

export const startTimer = (questionNum) => {
  const key = `timerStart-${questionNum}`;
  if (localStorage.getItem(key)) {
    const startTime = parseInt(localStorage.getItem(key), 10);
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    count = elapsedSeconds;         
    timerElement.textContent = formatTime(count);
  } else {
    // only set start time when it doesn't exist
    count = 0;
    localStorage.setItem(key, Date.now());
    timerElement.textContent = formatTime(count);
  }

  if (intervalId !== null) return; // prevent multiple intervals
  intervalId = setInterval(() => {
    count++;

    timerElement.textContent = formatTime(count);

    if (count >= 20 && count < 40) { // 20 seconds
      timerElement.style.color = 'yellow';
    } else if (count >= 40) {  // 40 seconds
      timerElement.style.color = 'red';
    } else if (count > 60) {
      stopTimer(questionNum);
    }
  }, 1000);
};


export const stopTimer = (questionNum) => {
  localStorage.removeItem(`timerStart-${questionNum}`);

  clearInterval(intervalId);
  intervalId = null;  
  return count
}


startTimer(1);