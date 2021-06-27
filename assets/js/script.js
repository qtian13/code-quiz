var homepageSnippet = 
    '<div id="startdisplay">' +
        '<h1>Coding Quiz Challenge</h1>' +
        '<h2>Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!</h2>' +
        '<div id="startbutton">' +
            'Start Quiz' +
        '</div>' +
    '</div>';
var resultpageSnippet =
    '<h3>All done!</h3>' +
    '<div id="score">Your final score is </div>' +
    '<div class="submit">' +
        'Enter Initials: <textarea name="initials" id="initials" cols="30" rows="1"></textarea><button id="submit-score">submit</button>' +
    '</div>';

var mainContent = document.querySelector("main");
var currentQuestionIndex = 0;
var currentTimer;
var currentInterval;
var currentTimeLeft;
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


function loadHomepage() {
    mainContent.setAttribute("style", "justify-content: center");
    mainContent.innerHTML = homepageSnippet;
}

function selectPosition(event) {
    var element = event.target;
    if (element === document.querySelector("#startbutton")) {
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

    } else if (false/*select to view highscore*/) {
        // clear menu
        // clear content
        // display the score history
    } else if (false/* select submit name */) {
        // store the result to local storage
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
    var question = document.createElement("div");
    var options = document.createElement("div");
    questionBox.appendChild(question);
    questionBox.appendChild(options);
    question.textContent = currentQuestion.questionDescr;
    mainContent.setAttribute("style", "width: 500px");    
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

loadHomepage();
addEventListener("click", selectPosition);