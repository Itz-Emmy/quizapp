const preloader = document.querySelector('.preloader');
const errorScreen = document.querySelector('.error');
const quizBox = document.getElementById('quiz-container')


// Get Quiz details

let correctAnswersContainer = document.querySelector('.correctAnswers');
let questionContainer = document.querySelector('.question');
  const apiUrl = "https://opentdb.com/api.php?amount=10";
fetch(apiUrl)
.then((response) => {
  return response.json()
})
.then((data) => {
  let questionNumber = 0;
  let answerNumber = 0;
  const fetchArray = data.results;
  // Store correct answers in an array
  
  fetchArray.forEach((item) => {
    let options = [item.correct_answer, ...item.incorrect_answers];
      const generateOptionHTML = () => {
      let shuffledOptions  = options.sort(() => Math.random() - 0.5);
      let allOptions =  shuffledOptions.map((option) => `
      <div class="option-container">
      <input type="radio" name="answer" class="option" value="${option}">
      <label>${option}</label>
      </div>
      `).join('');
      return `<div class="options-row">${allOptions}</div>`;
    };
    questionNumber++;
    
    let questionTag = `<h2 id="question">${questionNumber}. ${item.question}</h2>`;
   
    questionContainer.innerHTML += questionTag;
    questionContainer.innerHTML += generateOptionHTML();
    
    // Display correct answers after submit
        const generateCorrectAnswers = () => {
      let correctOption  = item.correct_answer;
      
      return `
      <div class="option-container">
      <input type="radio" name="answer" class="option" value="${correctOption}">
      <label>${correctOption}</label>
      </div>
      `;
    };
    answerNumber++;
    
    questionTag = `<h2 id="question">${answerNumber}. ${item.question}</h2>`;
   
    correctAnswersContainer.innerHTML += questionTag;
    correctAnswersContainer.innerHTML += generateCorrectAnswers();

    
  });

  let counter = 0;
  const optionRows = document.querySelectorAll('.options-row'); 

  // This object will hold the current state of each option row
  const rowState = {};

  optionRows.forEach((row, rowIndex) => {
    const options = row.querySelectorAll('.option-container');
    const correctAnswer = fetchArray[rowIndex].correct_answer.trim().toLowerCase();
      
      rowState[rowIndex] = {
        answered: false,
        selectedOption: null,
        selectedOptionIsCorrect: false,
      };
      options.forEach((option) => {
        option.addEventListener('click', () => {
          
        // Remove the selected class from all option containers to prevent all from been selectable If the question has not been answered or the user changed their choice
      if (!rowState[rowIndex].answered || rowState[rowIndex].selectedOption !== option) {
        options.forEach((opt) => {
          opt.classList.remove('selected');
        });
            
            // Upon click, add the selected class to only the option container that is been selected by clicking
            option.classList.add('selected');

            const selectedOptionValue = option.textContent.trim().toLowerCase();
            // Check if the user changed their choice from the previous selection
            const changedChoice = rowState[rowIndex].selectedOption !== option;
             // If the question was correctly answered and the user changed their choice, decrement the counter for the previous correct answer

             if (rowState[rowIndex].answered && changedChoice) {
              if (rowState[rowIndex].selectedOptionIsCorrect) {
                counter--;
              } else if (selectedOptionValue === correctAnswer) {
                counter++;
              }
            }

            const selectedOptionIsCorrect = selectedOptionValue === correctAnswer;

            if (selectedOptionIsCorrect && (!rowState[rowIndex].answered || !changedChoice)) {
              counter++;
            } else if (!selectedOptionIsCorrect && rowState[rowIndex].answered && !changedChoice) {
              counter--;
            }
          // Update the state for this row with the newly selected option
          rowState[rowIndex].selectedOption = option;
          rowState[rowIndex].selectedOptionIsCorrect = selectedOptionIsCorrect;
          rowState[rowIndex].answered = true;
  
            // Assign the counter value to the result span
          let resultOutput = document.querySelector('.score');
          resultOutput.textContent = counter;
          // Assign Overall score 
        let overallScore = document.querySelector('.overall-score');
        overallScore.textContent = questionNumber;

      }
          });
          
      });
    })

    // Submit answers
const submitBtn = document.getElementById('submitBtn');
const resultContainer = document.querySelector('.result-container');
const modalOverlay = document.getElementById('modalOverlay');
const score = document.querySelector('.score');
  const displayScore = document.querySelector('.displayAnswers');
  const sadFace = document.querySelectorAll('.sad');
  const happyFace = document.querySelectorAll('.happy');
  const paleFace = document.querySelectorAll('.pale');
submitBtn.addEventListener('click', () => {
  if (score.textContent === '') {
    window.alert('You must answer at least one question!')
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    resultContainer.style.display = 'flex';
    modalOverlay.style.display = 'block';
    submitBtn.style.display = 'none';
  }
  displayScore.addEventListener('click', () => {
    correctAnswersContainer.style.display = 'block';
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    modalOverlay.style.display = 'none';
  });
  
  

  if (score.textContent === 5) {
    score.style.color = '#333333';
    paleFace.forEach((emoji) => {
      emoji.style.display = 'inline';
     
    });
  }
  if (score.textContent > 5) {
    score.style.color = 'green';
    happyFace.forEach((emoji) => {
      emoji.style.display = 'inline';
    
    });
  }
  if (score.textContent < 5) {
    score.style.color = 'red';
    sadFace.forEach((emoji) => {
      emoji.style.display = 'inline'
   
    });
  }
});
})
.then(() => {
  
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 3000);

  })
.catch((error) => {
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 3000);
  quizBox.style.display = 'none';
  errorScreen.style.display = 'block';
  console.error("Error fetching quiz data:", error);
});

