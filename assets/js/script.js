var mainContent = document.querySelector("main");
var topBar = document.querySelector(".top-bar");
var currentQuestionIndex = 0;
var currentTimer;
var currentInterval;
var currentTimeLeft = 0;
var timePenalty = 5;
var question0 = {
    questionDescr : "what is my number?",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
};
var question1 = {
    questionDescr : "what is my second number?",
    options: ["1", "2", "3", "4"],
    correctIndex: 3,
}
var questions = [question0, question1];
var timeTotal = timePenalty * questions.length;

var topBarSnippet = 
        '<div id="highscore">' +
            'View Highscores' +
        '</div>' +
        '<div id="timeleft">' +
            'Time: 0' +
        '</div>';

var homepageSnippet = 
        '<div class="homepage-content">' +
            '<h1>Coding Quiz Challenge</h1>' +
            '<p class="rules">Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ' + timePenalty + ' seconds!</p>' +
            '<button id="startbutton">' +
                'Start Quiz' +
            '</button>' +
        '</div>';
var resultpageSnippet =
        '<h3>All done!</h3>' +
        '<div id="score">Your final score is </div>' +
        '<div class="submit">' +
            'Enter Initials: <textarea name="initials" id="initials" cols="30" rows="1"></textarea><button id="submit-score">submit</button>' +
        '</div>';

var highscoreSnippet = 
        '<div id="highscore-box">' +
            '<h3>Highscores</h3>' +
            '<div id="highscore-list">' +
            '</div>' +
            '<button id="to-homepage">Go Back</button>' +
            '<button id="clear-highscore">Clear Highscores</button>' +
        '</div>'

function loadHomepage() {
    topBar.innerHTML = topBarSnippet;
    mainContent.setAttribute("style", "justify-content: center");
    mainContent.innerHTML = homepageSnippet;
}

function selectPosition(event) {
    var element = event.target;
    if (element.matches("#startbutton")) {
        clearContent();
        startQuiz();
    } else if (element.matches(".option")) {
        var result = document.querySelector(".question-result");
        result.setAttribute("style", "border-top: 2px solid black; width: 100%; margin-top: 8px");
        if (element.dataset.ans == "true") {
            result.textContent = "Correct!"
        } else {
            result.textContent = "Incorrect!"
            if (currentTimeLeft > timePenalty) {
                currentTimeLeft -= timePenalty;
                document.querySelector("#timeleft").textContent = "time: " + currentTimeLeft;
                setTimer(currentTimeLeft);
            } else {
                setTimer(0.01);
                document.querySelector("#timeleft").textContent = "time: " + 0;
                currentTimeLeft = 0;
                return;
            }
        }
        setTimeout(function () {
            result.textContent = "";
            result.setAttribute("style", "border-top: none");
        }, 1000 * 1);
        currentQuestionIndex++;
        document.querySelector(".question-box").innerHTML = "";
        if (currentQuestionIndex == questions.length) {
            loadResultPage();
        } else {
            loadNewQuestion();
        }

    } else if (element.matches("#highscore")) {
        console.log("I am executed");
        mainContent.innerHTML = "";
        loadHighScores();
    } else if (element.matches("#submit-score")) {
        var initials = document.querySelector("#initials").value.trim();
        if (initials.length != 2) {
            alert("Please enter correct initials of your first name and last name without space!");
            return;
        }
        var newScore = {
            name: initials,
            score: currentTimeLeft,
        };
        console.log(newScore);
        updateScoreRecord(newScore);
        console.log(localStorage.getItem("scores"));
        currentQuestionIndex = 0;
        mainContent.innerHTML = "";
        loadHighScores();
    } else if (element.matches("#to-homepage")) {
        mainContent.innerHTML = "";
        loadHomepage();
    } else if (element.matches("#clear-highscore")) {
        localStorage.removeItem("scores");
        loadHighScores();
    }
}

function clearContent() {
    mainContent.innerHTML = "";
}

function startQuiz() {
    currentTimeLeft = timeTotal;
    document.querySelector("#timeleft").textContent = "time: " + currentTimeLeft;
    currentInterval = setInterval(function() {
        currentTimeLeft--;
        document.querySelector("#timeleft").textContent = "time: " + currentTimeLeft;
    }, 1000 * 1);
    setTimer(currentTimeLeft);
    createQuestionContainer();
    loadNewQuestion();
}

function createQuestionContainer() {
    var questionDisplay = document.createElement("div");
    var questionResultDisplay = document.createElement("div");
    mainContent.setAttribute("style", "justify-content: flex-start");
    questionDisplay.setAttribute("class", "question-box");
    questionResultDisplay.setAttribute("class", "question-result");
    mainContent.appendChild(questionDisplay);
    mainContent.appendChild(questionResultDisplay);
}

function loadNewQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    var questionBox = document.querySelector(".question-box");
    var question = document.createElement("h3");
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

function loadTimeOutPage() {
    clearInterval(currentInterval);
    clearTimeout(currentTimer);
    mainContent.innerHTML = "TIME OUT!";
}

function loadResultPage() {
    clearInterval(currentInterval);
    clearTimeout(currentTimer);
    var box = document.querySelector(".question-box");
    box.setAttribute("class", "question-box result-box");
    box.innerHTML = resultpageSnippet;
    var score = document.querySelector("#score");
    score.textContent += currentTimeLeft + "!";
}

function setTimer(timeLength) {
    clearTimeout(currentTimer);
    currentTimer = setTimeout(function() {
        clearInterval(currentInterval);
        loadTimeOutPage();
    }, 1000 * timeLength);
}

function loadHighScores() {
    var scoreList;
    var scores = JSON.parse(localStorage.getItem("scores"));
    topBar.innerHTML = "";
    mainContent.innerHTML = highscoreSnippet;
    scoreList = document.querySelector("#highscore-list")
    for (var i = 0; i < scores.length; i++) {
        var score = document.createElement("div");
        score.textContent = (i + 1) + ". " + scores[i].name + " " + scores[i].score;
        scoreList.appendChild(score);
        score.setAttribute("style", "width: 100%");
    }
}

function updateScoreRecord(newItem) {
    var scores = [];
    var index = 0;
    if (localStorage.getItem("scores")) {
        console.log("localStorage scores not empty")
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

loadHomepage();
addEventListener("click", selectPosition);