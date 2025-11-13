
const timerElement = document.getElementById('timer');
let count = 0;        
let intervalId = null;  

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

//when starting the timer make sure that html is fully loaded

export const startTimer = (questionNum) => {
  const key = `timerStart-${questionNum}`;
  if (localStorage.getItem(key)) {
    const startTime = parseInt(localStorage.getItem(key), 10);
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    count = elapsedSeconds;      
    updateTimerColor();
   
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

    updateTimerColor();
    if (count >= 60) {
      return stopTimer(questionNum);
    }
  }, 1000);
};

function updateTimerColor() {
  if (count >= 40) {
    timerElement.style.color = 'red';
  } else if (count >= 20) {
    timerElement.style.color = 'yellow';
  } else {
    timerElement.style.color = 'black';
  }
}


export const stopTimer = (questionNum) => {
  localStorage.removeItem(`timerStart-${questionNum}`);

  clearInterval(intervalId);
  intervalId = null;  
  const result = count;
  count = 0;  
  return count
}


startTimer(1);