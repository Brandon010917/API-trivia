const $form = document.getElementById("form-trivia"),
  $triviaContainerGame = document.getElementById("trivia-game"),
  btnsQuestion = document.querySelectorAll(".trivia-option"),
  $finishGame = document.getElementById("finish-game");

let numberQuestions = $form.questions,
  category = $form.category,
  difficulty = $form.difficulty,
  type = $form.type,
  currentQuestion = 0,
  score = 0,
  responseApi = null,
  dataQuestion = null,
  responseSelectedText = "";

const printData = (data) => {
  const question = document.querySelector(".trivia-question"),
    difficultyInfo = document.querySelector(".info-difficulty-span"),
    questionInfo = document.querySelector(".info-currentQuestion");

  let numberRandom = Math.floor(Math.random() * 4),
    j = 0;

  dataQuestion = data[currentQuestion];

  question.innerHTML = dataQuestion.question;

  difficultyInfo.innerHTML = dataQuestion.difficulty;

  questionInfo.innerHTML = `${currentQuestion + 1} / ${numberQuestions}`;

  if (dataQuestion.type === "boolean") {
    btnsQuestion[0].innerHTML = "True";
    btnsQuestion[1].innerHTML = "False";
    btnsQuestion[2].classList.add("hidden");
    btnsQuestion[3].classList.add("hidden");
  } else {
    btnsQuestion[2].classList.remove("hidden");
    btnsQuestion[3].classList.remove("hidden");

    btnsQuestion[numberRandom].innerHTML = dataQuestion.correct_answer;

    for (let i = 0; i < btnsQuestion.length; i++) {
      if (i === numberRandom) continue;
      btnsQuestion[i].innerHTML = dataQuestion.incorrect_answers[j];
      j++;
    }
  }
};

const formSubmit = (e) => {
  e.preventDefault();

  // Peticion a la API
  const getData = async () => {
    try {
      numberQuestions = $form.questions.value;
      category = $form.category.value;
      difficulty = $form.difficulty.value;
      type = $form.type.value;

      const url = `https://opentdb.com/api.php?amount=${numberQuestions}&category=${category}&difficulty=${difficulty}&type=${type}`;

      const response = await fetch(url),
        data = await response.json();

      responseApi = data.results;
      printData(responseApi);
    } catch (error) {}
  };

  getData();

  $form.classList.add("hidden");
  $triviaContainerGame.classList.remove("hidden");
};

const finishGame = () => {
  $triviaContainerGame.classList.add("hidden");
  $finishGame.classList.remove("hidden");
  let finishScore = document.querySelector(".finish-score");
  finishScore.textContent = score;
};

const btnsTrivia = (e) => {
  if (e.target.matches(".trivia-option")) {
    btnsQuestion.forEach((btn) => btn.classList.remove("btn-option-selected"));

    let responseSelected = e.target;
    responseSelected.classList.add("btn-option-selected");

    responseSelectedText = e.target.innerHTML;
  }

  if (e.target.matches("#nextQuestion")) {
    if (responseSelectedText === dataQuestion.correct_answer) {
      score++;
      console.log(score);
    }

    currentQuestion++;
    if (currentQuestion < numberQuestions) {
      printData(responseApi);
    } else {
      finishGame();
    }

    btnsQuestion.forEach((btn) => btn.classList.remove("btn-option-selected"));
  }
};

$form.addEventListener("submit", formSubmit);
document.addEventListener("click", btnsTrivia);
