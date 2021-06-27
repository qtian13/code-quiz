var homepageSnippet =   '<div id="startdisplay">' + 
                            '<h1>Coding Quiz Challenge</h1>' + 
                            '<h2>Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!</h2>' +
                            '<div id="startbutton">' +
                                'Start Quiz' + 
                            '</div>' + 
                        '</div>';
var mainContent = document.querySelector("main");
var questions = [];
var currentQuestionIndex;

function loadHomepage() {
    mainContent.innerHTML = homepageSnippet;
}

function selectPosition(event) {
    if (event.target === document.querySelector("#startbutton")) {
        clearContent();
        startQuiz();
    } else if (true/*select a certain option*/) {
        if (true/*select the answer */) {
            // result display: correct
            // score++
        } else {
            // result display: incorrect
            // clear timer and set a new timer
        }
        // check if there are more questions
        // if so; clear content and load new question
        // if not:  clear content 
        //          display the final result
        //          enter initial 
        //          store the score
    } else if (false/*select to view highscore*/) {
        // clear menu
        // clear content
        // display the score history
    }
}

function clearContent() {
    mainContent.innerHTML = "";
}

function startQuiz() {
    setTimeout();
    loadNewQuestion();
}

function loadNewQuestion() {

}

loadHomepage();
addEventListener("click", selectPosition);