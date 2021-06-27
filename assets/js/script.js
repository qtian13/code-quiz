var homepageSnippet =   '<div id="startdisplay">' + 
                            '<h1>Coding Quiz Challenge</h1>' + 
                            '<h2>Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!</h2>' +
                            '<div id="startbutton">' +
                                'Start Quiz' + 
                            '</div>' + 
                        '</div>';
var resultpageSnippet = "result";

var mainContent = document.querySelector("main");
var currentQuestionIndex = 0;
var timeTotal = 60;
var currentTimer;
var currentInterval;
var currentTimeLeft;
var timePenalty = 5;
var question0 = {
    questionDescr : "what is my number?",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
};
var questions = [question0];


function loadHomepage() {
    mainContent.innerHTML = homepageSnippet;
}

function selectPosition(event) {
    var element = event.target;
    if (element === document.querySelector("#startbutton")) {
        clearContent();
        startQuiz();
    } else if (element.matches(".option")) {
        console.log("I am executed!");
        var result = document.createElement("div");
        result.setAttribute("style", "border-top: 2px solid black; width: 100%");
        mainContent.appendChild(result);
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
            }
        }
        setTimeout(function () {
            result.textContent = "";
            result.setAttribute("style", "border-top: none");
        }, 1000 * 1);
        // currentQuestionIndex++;
        // clearContent();
        // if (currentQuestionIndex == questions.length) {
        //     loadResultPage();
        // } else {
        //     loadNewQuestion();
        // }

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
    currentTimeLeft = 50;
    document.querySelector("#timeleft").textContent = "time: " + currentTimeLeft
    currentInterval = setInterval(function() {
        currentTimeLeft--;
        document.querySelector("#timeleft").textContent = "time: " + currentTimeLeft;
    }, 1000 * 1);
    setTimer(currentTimeLeft);
    clearContent();
    loadNewQuestion();
}


function loadNewQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    var questionBox = document.createElement("div");
    var question = document.createElement("div");
    var options = document.createElement("div");
    mainContent.appendChild(questionBox);
    questionBox.appendChild(question);
    questionBox.appendChild(options);
    question.textContent = currentQuestion.questionDescr;
    mainContent.setAttribute("style", "width: 300px; justify-content: flex-start");    
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
    clearTimeout(currentTimer);
    mainContent.innerHTML = resultpageSnippet;

    //          display the final result
    //          enter initial 
    //          store the score
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