async function loadQuizData(quiz, category) {
    const response = await fetch(`./data/${quiz}.json`);
    const data = await response.json();
    const questions = data[category];
  
    const randomQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10);
  
    console.log(randomQuestions);
    return randomQuestions;
  }

  loadQuizData("music", "emoji")
  