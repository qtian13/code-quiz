var topBar = document.querySelector(".top-bar");
var firstBlock = document.querySelector("#first-block");
var secondBlock = document.querySelector("#second-block");
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

// load homepage with View High Score button, Timeleft info on the top
// page title, quiz instruction and start quiz button in main content area
function loadHomepage() {
    var title = document.createElement("h1");
    var rules = document.createElement("div");
    var startButton = document.createElement("button");
    var highScore = document.createElement("div");
    timeLeftEl = document.createElement("div");

    topBar.innerHTML = "";
    firstBlock.innerHTML = "";
    secondBlock.innerHTML = "";
    // append high-score button and time left info to the top
    highScore.setAttribute("id", "high-score")
    highScore.textContent = "View High Scores";
    timeLeftEl.textContent = "Time left: " + timeTotal + "s";
    topBar.appendChild(highScore);
    topBar.appendChild(timeLeftEl);

    // append title and rules to the first block in the main content
    title.textContent = "Coding Quiz Challenge";
    title.setAttribute("class", "text-center");
    rules.innerHTML = 
        '<p>Please try your best to answer the following ' + questions.length + ' code-related multiple-choice questions within ' + timeTotal + ' seconds!</p>' + 
        '<p>Keep in mind that the incorrect answer will penalize your score/time by ' + timePenalty + ' points/seconds! The amount of time left is showed on the top right during the quiz. Below a question displays its question number.<p>' +
        '<p>Click the button to start the quiz when you are ready!</p>';
    rules.setAttribute("class", "text-center");
    firstBlock.appendChild(title);
    firstBlock.appendChild(rules);
    // append start-quiz-button the second block in the main content
    startButton.textContent = "Start Quiz";
    startButton.setAttribute("id", "start-quiz-button");
    startButton.setAttribute("class", "large-button");
    secondBlock.appendChild(startButton);
    secondBlock.setAttribute("class", "justify-content-center");
}

// check the target of the event click on body and deal with the html accordingly
function selectPosition(event) {
    var element = event.target;
    // start quiz when start quiz button clicked
    if (element.matches("#start-quiz-button")) {
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
    // load high score page when 'View High Scores' button is clicked
    } else if (element.matches("#high-score") && !duringQuiz) {
        loadHighScores();
    // record the score and load updated high score page when submit form button is clicked
    } else if (element.matches("#submit-score")) {
        // stop default function to deal with input info
        event.preventDefault();
        // add current score to record and load high score page
        if (createNewScore() != null) {
            updateScoreRecord(newScore);
            currentQuestionIndex = 0;
            firstBlock.innerHTML = "";
            loadHighScores();
        }
    // go back to homepage when 'go back' button on view high score page is clicked
    } else if (element.matches("#go-back")) {
        loadHomepage();
    } 
    // remove the item scores in localStorage and reload high score page
    else if (element.matches("#clear-high-score")) {
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
        timeLeftEl.textContent = "Time left: " + timeLeft + "s";
    }, 1000 * 1);
    setTimer(timeLeft);
    currentQuestionIndex = 0;
    createQuestionContainer();
    loadQuestion(questions[currentQuestionIndex]);
}

//create block elements as containers of current question and the result of previous question
function createQuestionContainer() {
    firstBlock.setAttribute("class", "position-relative");
    firstBlock.innerHTML = 
        '<div class="content-box">' +
        '</div>' +
        '<div class="question-result position-absolute"></div>';
    secondBlock.innerHTML = '<div class="question-serial-number"></div>';
}

// display current question
function loadQuestion(question) {
    var contentBox = document.querySelector(".content-box");
    var contentTitle = document.createElement("h2");
    var contentDetail = document.createElement("div");
    var questionSerialNumber = document.querySelector(".question-serial-number");
    contentBox.appendChild(contentTitle);
    contentBox.appendChild(contentDetail);
    contentTitle.textContent = question.questionDescr;
    for (var i = 0; i < question.options.length; i++) {
        var optionElement = document.createElement("div");
        optionElement.setAttribute("class", "option");
        optionElement.setAttribute("data-ans", i == question.correctIndex? "true" : "false");
        contentDetail.appendChild(optionElement);
        optionElement.textContent = question.options[i];
    }
    questionSerialNumber.textContent = (currentQuestionIndex + 1) + "/" + questions.length;
}

// delete the live interval and timeout; 
// display the result and a form for recording score
function loadResultPage() {
    var result = document.createElement("h2");
    var score = document.createElement("div");
    var form = document.createElement("form");
    var contentBox = document.querySelector(".content-box");

    duringQuiz = false;
    clearInterval(quizInterval);
    clearTimeout(quizTimer);
    contentBox.innerHTML = "";
    secondBlock.innerHTML = "";
    contentBox.appendChild(result);
    contentBox.appendChild(score);
    form.innerHTML = '<label for="initials">Enter Initials:</label>' + 
                        '<input type="text" id="initials">' +
                        '<button id="submit-score">submit</button>';
    contentBox.appendChild(form);

    if (timeLeft === 0) {
        result.textContent = "Time's up!";
        score.textContent = "Sorry that you fail the quiz! Please practise more and try again later!";
    }
    else {
        result.textContent = "Congratulations! Your final score is " + timeLeft + "!";
        score.textContent = "Please enter your initials to submit your score!";
    }
}

// update 'timeLeft' info: time < 0 when incorrect answer clicked when 'timeLeft' < 'timePenalty', in this situation update timeLeft to 0 since it cannot be smaller than 0
// delete previous timeout and create a new one;
// load the result page and delete interval when time up
// return false if no time left for next question, else return true
function setTimer(time) {
    timeLeft = time < 0 ? 0 : time;
    timeLeftEl.textContent = "Time left: " + timeLeft + "s";
    clearTimeout(quizTimer);
    quizTimer = setTimeout(function() {
        loadResultPage();
        clearInterval(quizInterval);
    }, 1000 * timeLeft);
    return timeLeft > 0;
}

// display high scores ordered by the score from high to lows
function loadHighScores() {
    var scoreList;
    var scores = JSON.parse(localStorage.getItem("scores"));
    topBar.innerHTML = 
        '<button id="go-back">Go Back</button>' +
        '<button id="clear-high-score">Clear High Scores</button>';
    firstBlock.innerHTML = 
        '<div class="high-score-box">' +
            '<h1 class="text-center">HIGH SCORES &#x1F3C6</h1>' +
            '<ol id="high-score-list"></ol>' +
        '</div>';
    secondBlock.innerHTML = "";

    if (scores !== null) {
        scoreList = document.querySelector("#high-score-list")

        for (var i = 0; i < scores.length; i++) {
            var score = document.createElement("li");
            score.innerHTML = '<div>' + (i + 1) + "  " + scores[i].name + '</div>' +
                            '<div>' + scores[i].score + '</div>';
            score.setAttribute("class", "flex-ends");
            scoreList.appendChild(score);
        }
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
    }, 1000 * 1.5);
    return result;
}

// load next question if any
// or load result page
function loadNextQuestion() {
    currentQuestionIndex++;
    document.querySelector(".content-box").innerHTML = "";
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