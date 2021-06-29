var mainContent = document.querySelector("main");
var topBar = document.querySelector(".top-bar");
var timeLeftEl;
var timeTotal;
var timePenalty = 5;
var timeLeft = 0;
var quizTimer;
var resultTimer;
var quizInterval;
var duringQuiz = false;

var validInitial = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var questions;
var currentQuestionIndex;

// load the questions from JSON file to current js file and initiate questions and timeTotal
fetch('https://raw.githubusercontent.com/qtian13/code-quiz/main/assets/json/data.json').then(response => {
    response.json().then(data => {
        questions = data;
        timeTotal = timePenalty * questions.length;
    });
});

// the top block display button 'view highscores' and 'Time left' info
var topBarSnippet = 
        '<div id="highscore">View Highscores</div>' +
        '<div id="timeleft">Time left: 0</div>';

// the homepage content: title, instructions and start quiz button
var homepageSnippet = 
        '<h1>Coding Quiz Challenge</h1>' +
        '<p class="rules">Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ' + timePenalty + ' seconds!</p>' +
        '<button id="startbutton">Start Quiz</button>';

// the pagedisplayed when all the questions answered
var resultpageSnippet =
        '<h2>All done!</h2>' +
        '<div id="score">Your final score is </div>' +
        '<form class="submit">' +
            'Enter Initials: ' + 
            '<input id="initials"></textarea>' +
            '<button id="submit-score">submit</button>' +
        '</form>';

// display highscore page
var highscoreSnippet = 
        '<h2>Highscores</h2>' +
        '<ol id="highscore-list"></ol>' +
        '<button id="to-homepage">Go Back</button>' +
        '<button id="clear-highscore">Clear Highscores</button>';

// load homepage with view highscore button, Timeleft info, page title, quiz instruction and start quiz button
function loadHomepage() {
    topBar.innerHTML = topBarSnippet;
    timeLeftEl = document.querySelector("#timeleft")
    mainContent.innerHTML = homepageSnippet;
}

// check the target of the event click on body and deal with the html accordingly
function selectPosition(event) {
    var element = event.target;
    // start quiz when start quiz button clicked
    if (element.matches("#startbutton")) {
        startQuiz();
    // check the result when option of question is clicked
    } else if (element.matches(".option")) {
        var result = displayResult();
        if (element.dataset.ans == "true") {
            result.textContent = "Correct!"
        } else {
            result.textContent = "Incorrect!";
            if (!setTimer(timeLeft - timePenalty)) {
                return;
            }
        }
        loadNextQuestion();
    // load highscore page when 'view highscore' button is clicked
    } else if (element.matches("#highscore") && !duringQuiz) {
        loadHighScores();
    // record the score and load updated highscore page when submit form button is clicked
    } else if (element.matches("#submit-score")) {
        // stop default function to deal with input info
        event.preventDefault();
        // add current score to record and load highscore page
        if (createNewScore() != null) {
            duringQuiz = false;
            updateScoreRecord(newScore);
            currentQuestionIndex = 0;
            mainContent.innerHTML = "";
            loadHighScores();
        }
    // go back to homepage when 'go back' button on view highscore page is clicked
    } else if (element.matches("#to-homepage")) {
        loadHomepage();
    } 
    // remove the item scores in localStorage and reload highscore page
    else if (element.matches("#clear-highscore")) {
        localStorage.removeItem("scores");
        loadHighScores();
    }
}

// start quiz timer and update time left info every second. Load first question
function startQuiz() {
    duringQuiz = true;
    timeLeft = timeTotal;
    quizInterval = setInterval(function() {
        timeLeft--;
        timeLeftEl.textContent = "Time left: " + timeLeft;
    }, 1000 * 1);
    setTimer(timeLeft);
    createQuestionContainer();
    currentQuestionIndex = 0;
    loadQuestion(questions[currentQuestionIndex]);
}

//create block elements as containers of current question and the result of previous question
function createQuestionContainer() {
    var questionDisplay = document.createElement("div");
    var questionResultDisplay = document.createElement("div");
    questionDisplay.setAttribute("class", "question-box");
    questionResultDisplay.setAttribute("class", "question-result");
    mainContent.innerHTML = "";
    mainContent.appendChild(questionDisplay);
    mainContent.appendChild(questionResultDisplay);
}

// display current question
function loadQuestion(question) {
    var questionBox = document.querySelector(".question-box");
    var questionDescrEl = document.createElement("h2");
    var optionsEl = document.createElement("div");
    questionBox.appendChild(questionDescrEl);
    questionBox.appendChild(optionsEl);
    questionDescrEl.textContent = question.questionDescr;
    for (var i = 0; i < question.options.length; i++) {
        var optionElement = document.createElement("div");
        optionElement.setAttribute("class", "option");
        optionElement.setAttribute("data-ans", i == question.correctIndex? "true" : "false");
        optionsEl.appendChild(optionElement);
        optionElement.textContent = question.options[i];
    }
}

// delete the live interval and timeout; 
// display the result and a form for recording score
function loadResultPage() {
    clearInterval(quizInterval);
    clearTimeout(quizTimer);
    var box = document.querySelector(".question-box");
    box.setAttribute("class", "result-box");
    box.innerHTML = resultpageSnippet;
    var score = document.querySelector("#score");
    score.textContent += timeLeft + "!";
}

// update 'timeLeft' info: time < 0 when incorrect answer clicked when 'timeLeft' < 'timePenalty', in this situation update timeLeft to 0 since it cannot be smaller than 0
// delete previous timeout and create a new one;
// load the result page and delete interval when time up
// return false if no time left for next question, else return true
function setTimer(time) {
    timeLeft = time < 0 ? 0 : time;
    timeLeftEl.textContent = "Time left: " + timeLeft;
    clearTimeout(quizTimer);
    quizTimer = setTimeout(function() {
        loadResultPage();
        clearInterval(quizInterval);
    }, 1000 * timeLeft);
    return timeLeft > 0;
}

// display high scores
function loadHighScores() {
    var scoreList;
    var scores = JSON.parse(localStorage.getItem("scores"));
    topBar.innerHTML = "";
    mainContent.innerHTML = highscoreSnippet;

    if (scores == null) {
        return;
    }

    scoreList = document.querySelector("#highscore-list")
    scoreList.setAttribute("style", "padding-left: 20px");

    for (var i = 0; i < scores.length; i++) {
        var score = document.createElement("li");
        score.textContent = scores[i].name + " " + scores[i].score;
        scoreList.appendChild(score);
    }
}

// insert new score into high scores while maintaining descending order
// store the record in local storage
function updateScoreRecord(newItem) {
    var scores = [];
    var index = 0;
    if (localStorage.getItem("scores")) {
        scores = JSON.parse(localStorage.getItem("scores"));
    }
    for (; index < scores.length; index++) {
        if (scores[index].score < newItem.score) {
            break;
        }
    }
    scores.splice(index, 0, newItem);
    localStorage.setItem("scores", JSON.stringify(scores));
}

// display the result of the previous question
// the result disappear after 1s or when current question is answered which comes early
function displayResult() {
    clearTimeout(resultTimer);
    var result = document.querySelector(".question-result");
    result.setAttribute("style", "border-top: 2px solid black; width: 100%; margin-top: 8px");
    resultTimer = setTimeout(function () {
        result.textContent = "";
        result.setAttribute("style", "border-top: none");
    }, 1000 * 1);
    return result;
}


// load next question if any
// or load result page
function loadNextQuestion() {
    currentQuestionIndex++;
    document.querySelector(".question-box").innerHTML = "";
    if (currentQuestionIndex == questions.length) {
        loadResultPage();
    } else {
        loadQuestion(questions[currentQuestionIndex]);
    }
}

// check if form filled with valid input
// return object of newScore if so, or return null
function createNewScore() {
    var initials = document.querySelector("#initials").value.trim().toUpperCase();
    if (initials.length != 2 || validInitial.indexOf(initials[0]) < 0 || validInitial.indexOf(initials[1]) < 0) {
        alert("Please enter correct initials of your first name and last name without space!");
        return null;
    }
    return newScore = {
        name: initials,
        score: timeLeft,
    };
}

loadHomepage();
document.body.addEventListener("click", selectPosition);