var mainContent = document.querySelector("main");
var topBar = document.querySelector(".top-bar");
var currentQuestionIndex = 0;
var currentTimer;
var currentInterval;
var currentTimeLeft = 0;
var timePenalty = 5;
var validInitial = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// var question0 = {
//     questionDescr : "what is my number?",
//     options: ["1", "2", "3", "4"],
//     correctIndex: 2,
// };
// var question1 = {
//     questionDescr : "what is my second number?",
//     options: ["1", "2", "3", "4"],
//     correctIndex: 3,
// }
var questions = JSON.parse(data);
var timeTotal = timePenalty * questions.length;

var topBarSnippet = 
        '<div id="highscore">View Highscores</div>' +
        '<div id="timeleft">Time left: 0</div>';

var homepageSnippet = 
        '<h1>Coding Quiz Challenge</h1>' +
        '<p class="rules">Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ' + timePenalty + ' seconds!</p>' +
        '<button id="startbutton">Start Quiz</button>';

var resultpageSnippet =
        '<h2>All done!</h2>' +
        '<div id="score">Your final score is </div>' +
        '<form class="submit">' +
            'Enter Initials: ' + 
            '<input id="initials"></textarea>' +
            '<button id="submit-score">submit</button>' +
        '</form>';

var highscoreSnippet = 
        '<h2>Highscores</h2>' +
        '<ol id="highscore-list"></ol>' +
        '<button id="to-homepage">Go Back</button>' +
        '<button id="clear-highscore">Clear Highscores</button>';

function loadHomepage() {
    topBar.innerHTML = topBarSnippet;
    mainContent.innerHTML = homepageSnippet;
}

function selectPosition(event) {
    var element = event.target;
    if (element.matches("#startbutton")) {
        startQuiz();
    } else if (element.matches(".option")) {
        var result = displayResult();
        if (element.dataset.ans == "true") {
            result.textContent = "Correct!"
        } else {
            result.textContent = "Incorrect!"
            if (!setNewTimer(currentTimeLeft - timePenalty)) {
                loadResultPage();
                return;
            }
        }
        generateNextQuestion();
    } else if (element.matches("#highscore")) {
        loadHighScores();
    } else if (element.matches("#submit-score")) {
        event.preventDefault();
        if (createNewScore()) {
            updateScoreRecord(newScore);
            currentQuestionIndex = 0;
            mainContent.innerHTML = "";
            loadHighScores();
        }
    } else if (element.matches("#to-homepage")) {
        loadHomepage();
    } 
    else if (element.matches("#clear-highscore")) {
        localStorage.removeItem("scores");
        loadHighScores();
    }
}

function startQuiz() {
    currentTimeLeft = timeTotal;
    document.querySelector("#timeleft").textContent = "Time left: " + currentTimeLeft;
    currentInterval = setInterval(function() {
        currentTimeLeft--;
        document.querySelector("#timeleft").textContent = "Time left: " + currentTimeLeft;
    }, 1000 * 1);
    setTimer(currentTimeLeft);
    setNewTimer(currentTimeLeft);
    createQuestionContainer();
    loadNewQuestion();
}

function createQuestionContainer() {
    var questionDisplay = document.createElement("div");
    var questionResultDisplay = document.createElement("div");
    questionDisplay.setAttribute("class", "question-box");
    questionResultDisplay.setAttribute("class", "question-result");
    mainContent.innerHTML = "";
    mainContent.appendChild(questionDisplay);
    mainContent.appendChild(questionResultDisplay);
}

function loadNewQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    var questionBox = document.querySelector(".question-box");
    var question = document.createElement("h2");
    var options = document.createElement("div");
    questionBox.appendChild(question);
    questionBox.appendChild(options);
    question.textContent = currentQuestion.questionDescr;
    for (var i = 0; i < currentQuestion.options.length; i++) {
        var opElement = document.createElement("div");
        opElement.setAttribute("class", "option");
        opElement.setAttribute("data-ans", i == currentQuestion.correctIndex? "true" : "false");
        options.appendChild(opElement);
        opElement.textContent = currentQuestion.options[i];
    }
}

function loadResultPage() {
    clearInterval(currentInterval);
    clearTimeout(currentTimer);
    var box = document.querySelector(".question-box");
    box.setAttribute("class", "result-box");
    box.innerHTML = resultpageSnippet;
    var score = document.querySelector("#score");
    score.textContent += currentTimeLeft + "!";
}

function setTimer(timeLength) {
    clearTimeout(currentTimer);
    timeLength = timeLength == 0 ? 0.1 : timeLength;
    currentTimer = setTimeout(function() {
        clearInterval(currentInterval);
        loadResultPage();
    }, 1000 * timeLength);
}

function loadHighScores() {
    var scoreList;
    var scores = JSON.parse(localStorage.getItem("scores"));
    topBar.innerHTML = "";
    mainContent.innerHTML = highscoreSnippet;
    scoreList = document.querySelector("#highscore-list")
    scoreList.setAttribute("style", "padding-left: 20px");

    for (var i = 0; i < scores.length; i++) {
        var score = document.createElement("li");
        score.textContent = scores[i].name + " " + scores[i].score;
        scoreList.appendChild(score);
    }
}

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

function displayResult() {
    var result = document.querySelector(".question-result");
    result.setAttribute("style", "border-top: 2px solid black; width: 100%; margin-top: 8px");
    setTimeout(function () {
        result.textContent = "";
        result.setAttribute("style", "border-top: none");
    }, 1000 * 1);
    return result;
}

function setNewTimer(time) {
    var noTimeLeft = time <= 0;
    currentTimeLeft = noTimeLeft? 0 : time;
    document.querySelector("#timeleft").textContent = "Time left: " + currentTimeLeft;
    setTimer(currentTimeLeft);
    return !noTimeLeft;
}

function generateNextQuestion() {
    currentQuestionIndex++;
    document.querySelector(".question-box").innerHTML = "";
    if (currentQuestionIndex == questions.length) {
        loadResultPage();
    } else {
        loadNewQuestion();
    }
}

function createNewScore() {
    var initials = document.querySelector("#initials").value.trim().toUpperCase();
    if (initials.length != 2 || validInitial.indexOf(initials[0]) < 0 || validInitial.indexOf(initials[1]) < 0) {
        alert("Please enter correct initials of your first name and last name without space!");
        return null;
    }
    return newScore = {
        name: initials,
        score: currentTimeLeft,
    };
}

loadHomepage();
addEventListener("click", selectPosition);


console.log("\"" + JSON.stringify(questions) + "\"");