# code-quiz
This project provides a series of code-related multiple-choice questions. Users who answer questions fast and correctly would get batter score and higher rank.

## Getting Started
```console
git clone https://github.com/qtian13/code-quiz.git
```

## Built With
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

## Features of the Code Quiz
1. The homepage displays the title and explains the rules of the quiz. Quiz starts when `Start Quiz` is clicked. Once clicked, quiz timer starts at the same time. On the top left is a link to high score page. User can click to check the current score record. On the top right shows the time left for the quiz.
![homepage](assets/images/homepage.png)
2. During the quiz:
    * A series of multiple-choice questions are rendered one by one. 
    * The background color of the choice would change while the mouse hover over it which helps user choose the one they want.
    * User can check the time left on the top right corner.
    * Users can also check the serial number of current question at the bottom of the page. 
    ![duringquiz](assets/images/duringquiz.png)
    * When a choice is clicked, the next question renders right away
    * The result of the previous question is displayed below the question card and disappear after 1.5 second or options of current questions is clicked which comes early.
    ![displayresult](assets/images/displayresult.png)
3. The quiz result page is loaded when time is up or when all the questions are done. Users can enter their initials and click `submit` to record their score. The initials and score would be added to quiz results stored in `Local Storage`. The high score page would load after the form is submitted.
![quizends](assets/images/quizends.png)
4. When the high score page is loaded, user can view the quiz results ranked in descending order. There are two buttons on this page: One to go back to the homepage and the other one is to clear the scores from UI and in `Local Storage`
![highscore](assets/images/highscore.png)
5. The page layout is screen size responsive.
5. Question data are stored in JSON file.
## Page URL
https://qtian13.github.io/code-quiz/
## Page Demo
![highscore](assets/images/code_quiz_demo.gif)
## Page Screen Shot with Different Screen Width
![desktop_screen](assets/images/homepage.png)
![tablet_screen](assets/images/tablet_screen.png)
![mobile_screen](assets/images/mobile_screen.png)
## Author
Qiushuang Tian
- [Link to Portfolio Site](https://qtian13.github.io/)
- [Link to Github](https://github.com/qtian13)
- [Link to LinkedIn](https://www.linkedin.com/in/qiushuang-tian-a9754248/)
## Acknowledgments
- [Berkeley Coding Boot Camp](https://bootcamp.berkeley.edu/coding/) provided start code

