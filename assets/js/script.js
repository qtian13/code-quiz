var mainContent = document.querySelector("main");
var topBar = document.querySelector(".top-bar");
var timeLeftEl;
var timeTotal;
var timePenalty = 10;
var timeLeft = 0;
var quizTimer;
var resultTimer;
var quizInterval;
var duringQuiz = false;
var validInitial = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var questions;
var currentQuestionIndex;


// the homepage content: title, instructions and start quiz button
var homepageSnippet = 
        '<h1>Coding Quiz Challenge</h1>' +
        '<p class="rules"></p>' +
        '<button id="start-button" class="large-button">Start Quiz</button>';

// display highscore page
var highscoreSnippet =
        '<div class="highscore-box">' +
            '<h1>Highscores</h1>' +
            '<ol id="highscore-list"></ol>' +
        '</div>'

// load homepage with view highscore button, Timeleft info on the top
// page title, quiz instruction and start quiz button in main content area
function loadHomepage() {
    topBar.innerHTML = '<div id="highscore">View Highscores</div>' +
                        '<div id="timeleft">Time left: 0</div>';
    timeLeftEl = document.querySelector("#timeleft")
    mainContent.innerHTML = homepageSnippet;
    document.querySelector(".rules").textContent = "Please try your best to answer the following " + questions.length + " code-related questions within " + timeTotal + " seconds! You can chek the time left on the top right during the quiz! Keep in mind that the incorrect answer will penalize your score/time by " + timePenalty + " points/seconds! Click the button to start the quiz when you are ready!";
}

// check the target of the event click on body and deal with the html accordingly
function selectPosition(event) {
    var element = event.target;
    // start quiz when start quiz button clicked
    if (element.matches("#start-button")) {
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
            updateScoreRecord(newScore);
            currentQuestionIndex = 0;
            mainContent.innerHTML = "";
            loadHighScores();
        }
    // go back to homepage when 'go back' button on view highscore page is clicked
    } else if (element.matches("#go-back") || element.matches("#homepage-button")) {
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
    currentQuestionIndex = 0;
    createQuestionContainer();
    loadQuestion(questions[currentQuestionIndex]);
}

//create block elements as containers of current question and the result of previous question
function createQuestionContainer() {
    mainContent.innerHTML = '<div class="question-box"></div>' +
                            '<div class="question-info">' +
                                '<div class="question-result"></div>' +
                                '<div class="question-serial-number"></div>' +
                            '</div>';
}

// display current question
function loadQuestion(question) {
    var questionBox = document.querySelector(".question-box");
    var questionDescrEl = document.createElement("h2");
    var optionsEl = document.createElement("div");
    var questionSerialNumber = document.querySelector(".question-serial-number");
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
    questionSerialNumber.setAttribute("style", "text-align: center");
    questionSerialNumber.textContent = (currentQuestionIndex + 1) + "/" + questions.length;
}

// delete the live interval and timeout; 
// display the result and a form for recording score
function loadResultPage() {
    var result = document.createElement("h2");
    var score = document.createElement("div");
    var form = document.createElement("form");

    duringQuiz = false;
    form.innerHTML = 'Enter Initials:' + 
                    '<input id="initials">' +
                    '<button id="submit-score">submit</button>';
    clearInterval(quizInterval);
    clearTimeout(quizTimer);
    mainContent.innerHTML = "";
    mainContent.appendChild(result);
    mainContent.appendChild(score);
    if (timeLeft === 0) {
        var button = document.createElement("button");

        result.textContent = "Time up!";
        score.textContent = "Sorry that you fail to answer all the quetions in the given time! Please practise more and come back to try again!";
        mainContent.appendChild(button);
        button.setAttribute("id", "homepage-button");
        button.setAttribute("class", "large-button");
        button.textContent = "homepage";
    }
    else {
        var form = document.createElement("form");

        result.textContent = "Congratulations! You have answered all the questions!";
        score.textContent = "Please enter your initials to submit your score!";
        form.innerHTML = 'Enter Initials:' + 
                        '<input id="initials">' +
                        '<button id="submit-score">submit</button>';
        mainContent.appendChild(form);
    }
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
    topBar.innerHTML = '<button id="go-back">Go Back</button>' +
                       '<button id="clear-highscore">Clear Highscores</button>'
    mainContent.innerHTML = highscoreSnippet;

    if (scores == null) {
        return;
    }

    scoreList = document.querySelector("#highscore-list")

    for (var i = 0; i < scores.length; i++) {
        var score = document.createElement("li");
        score.innerHTML = '<div>' + (i + 1) + "  " + scores[i].name + '</div>' +
                          '<div>' + scores[i].score + '</div>';
        score.setAttribute("class", "flex-ends");
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
    result.setAttribute("style", "opacity: 0.5; border-top: 2px solid rgb(180, 209, 180); width: 100%");
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

// load the questions from JSON file to current js file and initiate questions and timeTotal
fetch('https://raw.githubusercontent.com/qtian13/code-quiz/main/assets/json/data.json').then(response => {
    response.json().then(data => {
        questions = data;
        timeTotal = timePenalty * questions.length;
        loadHomepage();
    });
});

document.body.addEventListener("click", selectPosition);