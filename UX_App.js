/*INDEX-BOARD
1. GLOBAL VARIABLES
2. EVENT LISTENERS
3. DATA HANDLING
3.1. GET DATA
3.2. HANDLE ANSWERS
3.3. SHUFFLE
3.4. CORRECTANSWERS
4. RENDER CHAPTERS
4.1. RENDER MAIN
4.2. RENDER STATS
4.3. RENDER ABOUT
4.4. RENDER QUIZ
4.5. RENDER ANSWERS
4.6. RENDER MODAL DIALOG
5. HANDLE SIDE MENU
5.1. OPEN NAV
5.2. CLOSE NAV
6. SET UP FUNCTIONS
6.1. CLEAR MAIN
6.2. RESTART QUIZ
6.3. EXIT POP UP
6.4. FOUR CLASS CONTROLLERS FOR MAIN
6.4.1. SETS START CLASS OF MAIN
6.4.2. SETS QUIZ CLASS OF MAIN
6.4.3. SETS STAT CLASS OF MAIN
6.4.4. SETS ABOUT CLASS OF MAIN
6.5. FOUR CALCULATIONS
6.5.1. ROUNDS PLAYED
6.5.2. COLLECTED RIGHT ANSWERS
6.5.3. COLLECTED WRONG ANSWERS
6.5.4. COLLECTED RIGHT ANSWERS IN PERCENTAGE
6.5.5. COLLECTED CALCULATIONS FUNCTION
6.6. SET UP TABINDEX FUNCTIONS
6.6.1. MAIN TABINDEX TO MINUS
6.6.2. MAIN TABINDEX TO PLUS
6.6.3. MODAL TABINDEX HANDLING
*/


//==========================================================================================
//===================================1. GLOBAL VARIABLES=======================================
//==========================================================================================
let startQuizButton = document.querySelector(".app-box__main__start__button"); //The "Start Quiz"-button on the openingPage.
let amountRightAnswers = 0; //Contains all the correct answers, which it gets from the function correctAnswers() at chapter X. 
let allRight = []; //An array to hold all the right answers, which it gets pushed in from the function handleAnswers() at chapter X. A pretty all right array.
let idCount = 1; //Is used to identify the radio buttons names, so that they match. Is used and increased in the function renderQuiz at chapter X.
let allAnswers = []; //An array to hold all answers the player has given and to compare to the allRight-array. Is used in the function correctAnswers() at chapter X.

let rounds = 0; //Variable to calculate the total amount of rounds
let collectedRightAnswers = 0; //Variable to contain amount of all the right answers
let collectedWrongAnswers = 0; //Variable to contain amount of all the wrong answer
let percentage = 0; //Used to calculate the percentage of correct answers.

//=============================================================================================
//====================================2. EVENT LISTENERS=======================================
//=============================================================================================
startQuizButton.addEventListener("click", () =>{ //Sets an eventListener to the original "Start Quiz"-button containing three functions:
    setClassQuiz(); //Sets the main class to quiz-focused and clears out all other classes.
    clearMain() //Clears the main-HTML to make ready for the next rendering.
    getData() //Calls upon the data through the function getData() at chapter 3.1.
    .then (data => renderQuiz(data)); //Once the data is gotten, the function renderQuiz is run with that data.
})

//=============================================================================================
//======================================3. DATA HANDLING=======================================
//=============================================================================================

//=======================================3.1.GET DATA==========================================
function getData(){ //Function that gathers the data from the API.
    return fetch("https://opentdb.com/api.php?amount=10&type=boolean") //"Fetches" the data from the API. <<NTS: Need to read up more on this one>> 
    .then (response => response.json())
    .then (response => {return response})
}

//=======================================3.2.HANDLE ANSWERS==========================================
function handleAnswers(right, wrong){ //Function to handle the given answers. Is called upon in function renderQuiz() at chapter X.
    allRight.push(right); //Pushes all the correct answers into the allRight-array to be used in function correctAnswers() at chapter 3.4.
    wrong.push(right); //Combines all the answers into the wrong-array. Not the -wrong- array but the wrong-array. Right?
    
    shuffle(wrong); //Calls upon the function shuffle() in chapter 3.3. to shuffle the answers around.

    return wrong; //returns the shuffled array.
}

//===========================================3.3.SHUFFLE=============================================
function shuffle(array) { //A function used to shuffle the array it gets as an argument.
    let indexHandler = array.length, tempValue, shuffledIndex; //Sets the variable indexHandler to the length of the argument-array, tempValue and shuffledIndex(see further down)
    
    while (0 !== indexHandler) { //As long as indexHandlers value isn't 0, this shuffle will keep going.
        shuffledIndex = Math.floor(Math.random() * indexHandler); //Sets the shuffledIndex variable to be set to a random number (which is controlled by the .floor to avoid non-whole numbers.)
        indexHandler = indexHandler-1; //indexHandler is set to its own value, minus one.
        tempValue = array[indexHandler]; //tempValue is set to the value of index of the array with the same place as the indexHandlers value.
        array[indexHandler] = array[shuffledIndex]; //The index of the array with the value of indexHandler is set to the value of the index of the value of shuffledIndex.
        array[shuffledIndex] = tempValue; //Finally, the index with the value of shuffledIndex is set to the tempValue, thus avoiding loss of data.
    }
        return array; //returns the VERY shuffled array.
    }

//===========================================3.4.CORRECTANSWERS=============================================
function correctAnswers(){ //A function that compares the answers given by the player with the correct answers. <<NTS: Remember to thank Yaro for the idea!>>
    let inputs = document.querySelectorAll("input"); //Selects all the inputs created in the function renderQuiz() at chapter X. Is called upon in the click-event in that same function.
    amountRightAnswers = 0; //Sets the varibable amountRightAnswers to 0. <<NTS: Why did it need renewing? The value was already set to 0.>> 

    for (let i = 0; i < inputs.length; i++){  //Loops through all the inputs <<NTS: Tried 'for of' and it went chaos. Recheck.>>
        if (inputs[i].type === "radio" && inputs[i].checked){ //Checks if the the input is of radio type and checked.
            allAnswers.push(inputs[i].value); //If so, it pushes the value of the input into the allAnswers-array.
        }
        else continue; //If it doesn't meet the if-requirement, it moves on and tries the next one.
    }
    for (let i = 0; i < allAnswers.length; i++){ //Loops through the allAnswers-array
        if(allAnswers[i] === allRight[i]){ //It then compares the allAnswers array with the allRight-array and if the index-vales match, 
            amountRightAnswers++; //the amountRightAnswers-variable increases its numerical value.
        }
    }
    popUpFunction() //Once the function is done calculating, it calls upon the popUpFunction from chapter X.
}


//==========================================================================================
//=================================4. RENDER CHAPTERS=======================================
//==========================================================================================

//=================================4.1. RENDER MAIN===========================================
function renderMain(){ //Function to render main when called upon
    clearMain(); //Calls upon the function clearMain() to prepare the rendering and remove any existing elements from the main.
    closeNav(); //If renderMain() is called upon from the sidemenu, the closeNav() makes sure it's closed. <<NTS: Should this be put inside an if{}? Ask Andreas.>>
    let main = document.querySelector("#app-box__main"); //Variable containing the main-container.
    setClassMain(); //Calls upon the function setClassMain which gives the main container the class needed for the startPage and at the same time removing all other classes adapted to the other pages using main as container.
    let createP = document.createElement("p"); //Creates a P-element.
    createP.classList.add("app-box__main__start--text"); //Sets the class of the P-element.
    createP.textContent = "Are you ready to test your knowledge?"; //Sets the textContent of the P-element created just above.
    main.appendChild(createP); //Appends the above created P-element to the main.
    let startButton = document.createElement("button"); //Creates a button to be used as a startbutton, basically a copy of the one pre-existing in the html.<<NTS: Eh, render that too? Future check.>> 
    startButton.classList.add("app-box__main__start__button");  //Sets the class of the button.
    startButton.textContent = "Start the Quiz!"; //Sets the textContent of the button.
    startButton.setAttribute("aria-label","Click to start the Quiz");
    main.appendChild(startButton); //Appends the startButton to the main-container.
    startButton.addEventListener ("click", () => { //Sets the eventListener to the startButton to
        clearMain(); //Clear the main
        setClassQuiz(); //Remove all other main-classes and instead set the class needed for the quiz.
        getData() //Calls the data
        .then (data => renderQuiz(data)); //then runs the renderQuiz() on the data.
    })
    controlChildrenTabIndexPlus() //Sets the tabindex to all children in the main. 
}

//=================================4.2. RENDER STATS===========================================
function renderStats(){ //Function to render the statsPage. 
    closeNav(); //Closes the sideMenu.
    clearMain(); //Clears the main-container. 
    setClassStats(); //Sets the main-containers class to the one for Statistics.
    let main = document.querySelector("#app-box__main");  //Selects the main-container.
    let title1 = document.createElement("h3"); //Creates a h3.
    title1.classList.add("app-box__main__stats--title"); //Sets the class of the h3.
    let p1 = document.createElement("p"); //Creates a P.
    p1.classList.add("app-box__main__stats--text"); //Sets the class of the P.
    title1.textContent = "Games Played"; //Sets the textContent of the h3.
    p1.textContent = rounds; //Sets the textContent of the P.
    main.appendChild(title1); //Appends the h3 to main.
    main.appendChild(p1); //Appends the P to main.

    //The rest of the code follows the exact same structure as above section. <<NTS: Used to run through a for loop but ran into bugs, re-check later.>>

    let title2 = document.createElement("h3");
    title2.classList.add("app-box__main__stats--title");
    let p2 = document.createElement("p");
    p2.classList.add("app-box__main__stats--text");
    title2.textContent = "Correct Answers";
    p2.textContent = collectedRightAnswers;
    main.appendChild(title2);
    main.appendChild(p2);

    let title3 = document.createElement("h3");
    title3.classList.add("app-box__main__stats--title");
    let p3 = document.createElement("p");
    p3.classList.add("app-box__main__stats--text");
    title3.textContent = "Wrong Answers";
    p3.textContent = collectedWrongAnswers;
    main.appendChild(title3);
    main.appendChild(p3);

    let title4 = document.createElement("h3");
    title4.classList.add("app-box__main__stats--title");
    let p4 = document.createElement("p");
    p4.classList.add("app-box__main__stats--text");
    title4.textContent = "Correct Percentages";
    p4.textContent = percentage + "%";
    p4.setAttribute("aria-label",percentage+"percentage");
    main.appendChild(title4);
    main.appendChild(p4);
    controlChildrenTabIndexPlus()

}

//=================================4.3. RENDER ABOUT===========================================
function renderAbout(){ //Function to render the aboutPage.
    closeNav(); //If renderMain() is called upon from the sidemenu, the closeNav() makes sure it's closed. <<NTS: Should this be put inside an if{}? Ask Andreas.>>
    clearMain(); //Calls upon the function clearMain() to prepare the rendering and remove any existing elements from the main.
    setClassAbout(); //Calls upon the function setClassAbout which gives the main container the class needed for the aboutPage and at the same time removing all other classes adapted to the other pages using main as container.
    let main = document.querySelector("#app-box__main"); //Selects the main-container

    let aboutTitle = document.createElement("h2"); //Creates a h2-element.
    aboutTitle.classList.add("app-box__main__about--title"); //Adds class to the h2-element
    aboutTitle.textContent ="About quizzes"; //Sets the textContent of the h2-element
    main.appendChild(aboutTitle); //Appends the h2-element to the main.

    let aboutText = document.createElement("p"); //Creates a P-element
    aboutText.classList.add("app-box__main__about--text"); //Sets the class of the p-element.
    aboutText.innerHTML =  //Sets the innerHTML. Uses innerHTML instead of textContent because long text is looooong and needs some <br>-code.
    `A quiz is a form of game or mind sport, 
    in which the players (as individuals or in teams) 
    attempt to answer questions correctly. <br>
    It is a game to test your knowledge about a certain subject. 
    In some countries, a quiz is also a brief assessment 
    used in education and similar fields to measure growth in knowledge, 
    abilities, and/or skills.<br> Quizzes are usually scored in points 
    and many quizzes are designed to determine a winner from 
    a group of participants – usually the participant with the highest score. 
    They may also involve eliminating those who get too many questions wrong, 
    the winner being the last man standing.<br><br>
    
░░█▀░░░░░░░░░░░▀▀███████░░░░ 
░░█▌░░░░░░░░░░░░░░░▀██████░░░ 
░█▌░░░░░░░░░░░░░░░░███████▌░░ 
░█░░░░░░░░░░░░░░░░░████████░░ 
▐▌░░░░░░░░░░░░░░░░░▀██████▌░░ 
░▌▄███▌░░░░▀████▄░░░░▀████▌░░ 
▐▀▀▄█▄░▌░░░▄██▄▄▄▀░░░░████▄▄░ 
▐░▀░░═▐░░░░░░══░░▀░░░░▐▀░▄▀▌▌ 
▐░░░░░▌░░░░░░░░░░░░░░░▀░▀░░▌▌ 
▐░░░▄▀░░░▀░▌░░░░░░░░░░░░▌█░▌▌ 
░▌░░▀▀▄▄▀▀▄▌▌░░░░░░░░░░▐░▀▐▐░ 
░▌░░▌░▄▄▄▄░░░▌░░░░░░░░▐░░▀▐░░ 
░█░▐▄██████▄░▐░░░░░░░░█▀▄▄▀░░ 
░▐░▌▌░░░░░░▀▀▄▐░░░░░░█▌░░░░░░ 
░░█░░▄▀▀▀▀▄░▄═╝▄░░░▄▀░▌░░░░░░ 
░░░▌▐░░░░░░▌░▀▀░░▄▀░░▐░░░░░░░ 
░░░▀▄░░░░░░░░░▄▀▀░░░░█░░░░░░░ 
░░░▄█▄▄▄▄▄▄▄▀▀░░░░░░░▌▌░░░░░░ 
░░▄▀▌▀▌░░░░░░░░░░░░░▄▀▀▄░░░░░ 
▄▀░░▌░▀▄░░░░░░░░░░▄▀░░▌░▀▄░░░ 
░░░░▌█▄▄▀▄░░░░░░▄▀░░░░▌░░░▌▄▄ 
░░░▄▐██████▄▄░▄▀░░▄▄▄▄▌░░░░▄░ 
░░▄▌████████▄▄▄███████▌░░░░░▄ 
░▄▀░██████████████████▌▀▄░░░░ 
▀░░░█████▀▀░░░▀███████░░░▀▄░░ 
░░░░▐█▀░░░▐░░░░░▀████▌░░░░▀▄░ 
░░░░░░▌░░░▐░░░░▐░░▀▀█░░░░░░░▀ 
░░░░░░▐░░░░▌░░░▐░░░░░▌░░░░░░░ 
░╔╗║░╔═╗░═╦═░░░░░╔╗░░╔═╗░╦═╗░ 
░║║║░║░║░░║░░░░░░╠╩╗░╠═╣░║░║░ 
░║╚╝░╚═╝░░║░░░░░░╚═╝░║░║░╩═╝░`;

    aboutText.setAttribute("aria-label","A quiz is a form of game or mind sport, in which the players attempt to answer questions correctly. It is a game to test your knowledge about a certain subject. In some countries, a quiz is also a brief assessment used in education and similar fields to measure growth in knowledge, abilities, and/or skills. Quizzes are usually scored in points and many quizzes are designed to determine a winner from a group of participants – usually the participant with the highest score. They may also involve eliminating those who get too many questions wrong, the winner being the last man standing.");
    main.appendChild(aboutText); //Appends the p-element to the main.
    controlChildrenTabIndexPlus() //Sets the tabindex to all children of the main.
}

//=================================4.4. RENDER QUIZ===========================================
function renderQuiz (data){ //Renders the data collected from getData to the html
    clearMain(); //Clears main before rendering the current main-content.
    setClassQuiz(); //Sets the correct class needed for this current main-content
    let main = document.querySelector("#app-box__main"); //Selects main-container.
    let answer =[]; //Creates an empty array to be used later to push the answers into.
    let array = data.results; //Creates an array for everything in the key 'results' of the data
    for (let i = 0; i < array.length; i++){ //Loops through the results-array.
        let question = array[i].question; //selects the question in the current index of the array.
        let questionText = document.createElement("h2"); //Creates a h2-element
        questionText.classList.add("app-box__main__quiz--question"); //Sets the class of the h2-element
        questionText.innerHTML = question; //Sets the innerHTML of the h2 to the current question. Uses innerHTML instead of textContent because text-chaos.
        main.appendChild(questionText); //Appends the h2 to the main.
        answer = handleAnswers(array[i].correct_answer, array[i].incorrect_answers); //Pushes the indexed answer-alternatives into the answer-array.
        renderAnswer(answer); //Runs the function renderAnswer() on the answer-array.
        idCount++; //For every question-rendering the idCount is increased.
    }
    let doneButton = document.createElement("button"); //Creates a button
    doneButton.innerHTML = "Done"; //Sets the buttons innerHTML to Done.
    doneButton.classList.add("app-box__main__quiz--doneButton"); //Sets the class of the button.
    doneButton.setAttribute("aria-label", "Click to Correct your Quiz");
    main.appendChild(doneButton); //Appends the button to the main.
    doneButton.addEventListener("click", collectedDone/*correctAnswers*/); //Adds the function correctAnswers() to the eventListener of the button.
}

//=================================4.5. RENDER ANSWERS===========================================
function renderAnswer(answer){ //Function to render the radio-buttons used for the answers.
    let main = document.querySelector("#app-box__main"); //Selects main-container
      
    for (let i = 0; i <answer.length; i++){ //Loops through the answer-array from function renderQuiz at chapter 4.4.
        let input = document.createElement("input"); //Creates an input
        let p = document.createElement("p"); //Creates a P.
        
        input.setAttribute("type", "radio");  //Sets the input to be a radio button
        input.setAttribute("name", "radio"+idCount); //Sets the name of the now radio button to "radio" combined with the current idCount to make them identifiable.
        input.setAttribute("value", answer[i]); //Sets the value of the radio-button to the belonging answer-alternatives.

        p.classList.add("app-box__main__quiz--answer"); //Sets the class of the P.

        p.innerHTML = answer[i]; //Sets the Ps innerHTML to the current index of the answer-array, meaning True or False.

            if (p.innerHTML == "False"){ //Checks if the p is represented by "False",
                p.setAttribute("style","color:#990000;") //and then sets the color to Red, symbolizing warning, incorrect, or communism. (No politic opinion insinuated).
                p.setAttribute("aria-label", "The statement is False");
                input.setAttribute("aria-label", "The statement is False");

            } else if (p.innerHTML == "True") { //Checks if the p is represented by "True",
                p.setAttribute("style","color:blue;") //and then sets the color to Blue, symbolizing positive, correct, or failed privatization (No politic opinion insinuated).
                p.setAttribute("aria-label", "The statement is Correct");
                input.setAttribute("arial-label", "The statement is Correct");
            }
    
        main.appendChild(input);  //Appends the input, now radio button, to the main.
        main.appendChild(p); //Then appends the P to the main as well.
    }
    controlChildrenTabIndexPlus() //Once the answer buttons been rendered, sets a tabindex to all children of main.
}

//=================================4.6. RENDER MODAL DIALOG===========================================
function popUpFunction() { //Renders the Modal Dialog for when the quiz is finished.
    controlChildrenTabIndexMinus();
    controlChildrenTabIndexModal();
    let popUpCover = document.querySelector(".app-box__popup__cover"); //Selects the pop-up-container.
    popUpCover.classList.remove("hide"); //Removes the hide-class from it, making it visible.

    let title = document.querySelector(".app-box__popup--top"); //Selects the h3 in the pop-up-container.
    
    //Below: If{} to give you different h3-responses depending on your score.
    if (amountRightAnswers == 10){
        title.innerHTML = "Amazing!"
    } else if (amountRightAnswers < 10 && amountRightAnswers >= 7) {
        title.innerHTML = "Well done!"
    } else if (amountRightAnswers < 7 && amountRightAnswers >= 6) {
        title.innerHTML = "Well, at least you got more than half!"
    } else if (amountRightAnswers == 5) {
        title.innerHTML = "Now that's a half."
    } else if (amountRightAnswers < 5 && amountRightAnswers >=2 ) {
        title.innerHTML = "We can all have a bad day."
    } else {
        title.innerHTML = "Lo-o-o-o-oser!"
    }

    let dialogtext = document.querySelector(".app-box__popup--results"); //Selects the p in the pop-up-container
    dialogtext.innerHTML = "You got "+ amountRightAnswers +" out of 10!" //Sets the p to the information about how many correct answers you had.

    let exitButton = document.querySelector(".app-box__popup--buttonsExit") //Selects the exit-button of the op-up-container
    exitButton.setAttribute("aria-label", "Click to exit the quiz");
    let restartButton = document.querySelector(".app-box__popup--buttonRestart"); //Selects the restart-button of the op-up-container
    restartButton.setAttribute("aria-label", "Click to replay the quiz");
    exitButton.addEventListener("click",exitPopup); //Sets the eventListener of the exitButton to call upon exitPopup().
    restartButton.addEventListener("click",restartQuiz) //Sets the eventListener of the restartButton to call upon restartQuiz().
}

//==========================================================================================
//============================5. HANDLE SIDE MENU==============================================
//==========================================================================================

//=================================5.1. OPEN NAV===========================================
function openNav() { //Used to open the sideMenu. Is called upon in the html "onclick=" on the header menu icon (hamburger-icon).
    document.querySelector(".app-box__header__sidemenu").style.width = "130px"; //Increases the sidemenus width.
    document.querySelector("#app-box__header__menuicon").removeAttribute("onclick", "openNav()"); //Removes the function
    document.querySelector("#app-box__header__menuicon").setAttribute("onclick", "closeNav()"); //To instead set the next click to close the sidemenu
    document.querySelector(".app-box__main--menuHover").classList.remove("hide"); //removes the hide-class of the sidemenu. <<NTS: Is this nessecary at all? If time - Double check>>
    document.querySelector(".main").setAttribute("tabindex", "1"); //Activates the tabindex when the sidemenu is opened.
    document.querySelector(".stats").setAttribute("tabindex", "2"); //Activates the tabindex when the sidemenu is opened.
    document.querySelector(".about").setAttribute("tabindex", "3"); //Activates the tabindex when the sidemenu is opened.
    controlChildrenTabIndexMinus(); //Sets the tabindex on the children of the main to "-1" to be untabable.
}

//=================================5.2. CLOSE NAV===========================================
function closeNav() { //Used to close the sideMenu. Is called upon in the html "onclick=" on the header menu icon (hamburger-icon) after openNav is run.
    document.querySelector(".app-box__header__sidemenu").style.width = "0"; //Decreases the sidemenus width.
    document.querySelector("#app-box__header__menuicon").removeAttribute("onclick", "closeNav()"); //Removes the function
    document.querySelector("#app-box__header__menuicon").setAttribute("onclick", "openNav()"); //To instead set the next click to open the sidemenu
    document.querySelector(".app-box__main--menuHover").classList.add("hide"); //removes the hide-class of the sidemenu. <<NTS: Is this nessecary at all? If time - Double check>>
    document.querySelector(".main").setAttribute("tabindex", "-1"); //Deactivates the tabindex when the sidemenu is closed.
    document.querySelector(".stats").setAttribute("tabindex", "-1"); //Deactivates the tabindex when the sidemenu is closed.
    document.querySelector(".about").setAttribute("tabindex", "-1"); //Deactivates the tabindex when the sidemenu is closed.
    controlChildrenTabIndexPlus(); //Sets the tabindex on the children of the main to back to "1".
}

//==========================================================================================
//================================6. SET UP FUNCTIONS=======================================
//==========================================================================================

//=================================6.1. CLEAR MAIN==========================================
function clearMain(){ //Used to empty the main-container pre-rendering in several cases.
    let main = document.querySelector("#app-box__main"); //Selects the main-container
    main.innerHTML=" "; //Then clears the innerHTML
}

//=================================6.2. RESTART QUIZ==========================================
function restartQuiz() { //Function to remove the modal, clear out the main, reset the allAnswer-array and then re-render the quiz with new questions.
    let popUpCover = document.querySelector(".app-box__popup__cover"); //Selects the modal-container
    popUpCover.classList.add("hide"); //Re-adds the hide-class to it.
    clearMain(); //Clears out main.
    allAnswers = []; //Empties the allAnswers-array
    getData() //Calls upon the data again
    .then (data => renderQuiz(data));   //Renders the data again
}

//=================================6.3. EXIT POP UP==========================================
function exitPopup (){ //Function to exit the pop-up without playing a new round, thus returning to the main-startpage
    let popUpCover = document.querySelector(".app-box__popup__cover"); //Selects the modal-container
    popUpCover.classList.add("hide"); //Readds the hide-class to it.
    let main = document.querySelector("#app-box__main"); //selects the main-container
    setClassMain(); //Sets the main-containers class to the start-class and removes the others classes.
    allAnswers = []; //Empties the allAnswers-array
    renderMain(); //Renders out the startPage
}

//===========================6.4. FOUR CLASS CONTROLLERS FOR MAIN============================
//All four functions to basically the same thing: Removes all of the pre-existing classes the main-container
//and then adds the class that is needed for the current page. For example, if you move from the aboutPage to the startPage,
//the main needs different css. So when you enter the aboutPage, the setClassAbout() is run and the class is now activating the css
//needed for the aboutPage. When you go from the aboutPage to the startPage the setClassMain is run, removing the pre-existing class
//containing the aboutPage-css, and instead sets the class to the one containing the startPage-css.
//<<NTS: Could be one function with a bunch of IFs? Looked messy, but worth a look later>>

//=========================6.4.1 SETS START CLASS OF MAIN==========================================
function setClassMain(){
    let main = document.querySelector("#app-box__main");
    main.classList.remove("app-box__main__quiz");
    main.classList.remove("app-box__main__stats");
    main.classList.remove("app-box__main__about");
    main.classList.add("app-box__main__start");
}

//=========================6.4.2 SETS QUIZ CLASS OF MAIN==========================================
function setClassQuiz(){
    let main = document.querySelector("#app-box__main");
    main.classList.remove("app-box__main__start");
    main.classList.remove("app-box__main__stats");
    main.classList.remove("app-box__main__about");
    main.classList.add("app-box__main__quiz");
}

//=========================6.4.3 SETS STAT CLASS OF MAIN==========================================
function setClassStats(){
    let main = document.querySelector("#app-box__main");
    main.classList.remove("app-box__main__start");
    main.classList.remove("app-box__main__quiz");
    main.classList.remove("app-box__main__about");
    main.classList.add("app-box__main__stats");
}

//=========================6.4.4 SETS ABOUT CLASS OF MAIN==========================================
function setClassAbout(){
    let main = document.querySelector("#app-box__main");
    main.classList.remove("app-box__main__start");
    main.classList.remove("app-box__main__quiz");
    main.classList.remove("app-box__main__stats");
    main.classList.add("app-box__main__about");
}

//===========================6.5. FOUR CALCULATIONS============================

//===========================6.5.1. ROUNDS PLAYED============================
function roundsPlayed(){ //Function to calculate the total amount of rounds
    rounds++; //rounds increased by one everytime the Done-button is clicked.
}

//===========================6.5.2 COLLECTED RIGHT ANSWERS============================
function collectedRights() { //Function to collect the amount of right answers.
    collectedRightAnswers = collectedRightAnswers + amountRightAnswers; //Updates the variable with itself plus the new value of amountRightAnswers
}

//===========================6.5.3 COLLECTED WRONG ANSWERS============================

//Den här borde kunna göras mycket mer generell. 10 måste ersättas med answerArray.length för att fungera även när antalet frågor ökar eller minskas.
function collectedWrongs() { //Function to calculate all the wrong answers.
    let tempWrong = rounds * 10; //Calculates all the possible answers
    collectedWrongAnswers = tempWrong - collectedRightAnswers; //Removes all the correct answers from the total amount of possible answers to show the amount of wrong.
    
    /*NY KOD:
    getData()
    .then (data => function(data)) //EN function som kastar in datan i en array behövs. Ta ut nycklarna i answers?
    /*END NY KOD*/
}

//Den här borde kunna göras mycket mer generell. 10 måste ersättas med answerArray.length för att fungera även när antalet frågor ökar eller minskas.
//===================6.5.4 COLLECTED RIGHT ANSWERS IN PERCENTAGE======================
function correctPercentage() {
    
    let tempPercentage = collectedRightAnswers / rounds*10; //Calculates the percentage of correct answers
    percentage = Math.round(tempPercentage * 10) / 10; //Uses the Math.round to set the decimal to 1, instead of being unchecked. If no decimal exists, no decimal is shown. E.g. 45.1 = YES, 45.0 = NO.

}

//========================6.5.5 COLLECTED CALCULATIONS FUNCTION========================
function collectedDone() { //Collection of functions meant to run when you press the Done-button in the quiz.
    correctAnswers();
    roundsPlayed();
    collectedRights();
    collectedWrongs()
    correctPercentage();
    controlChildrenTabIndexMinus()   
}


//========================6.6. SET UP TABINDEX FUNCTIONS========================

//========================6.6.1. MAIN TABINDEX TO MINUS========================
function controlChildrenTabIndexMinus(){ //A function to set all the children of the main-container to "tabindex = -1"
    let mainChilds = document.querySelector("#app-box__main").children; //Selects all the children of the main-container.

    for (let i = 0; i < mainChilds.length; i++){ //Loops through all the children
        mainChilds[i].setAttribute("tabindex", "-1"); //and sets the tabindex to "-1"
    }
}

//========================6.6.2. MAIN TABINDEX TO PLUS========================
function controlChildrenTabIndexPlus(){ //A function to set all the children of the main-container to "tabindex = 1"
    let mainChilds = document.querySelector("#app-box__main").children; //Selects all the children of the main-container.

    for (let i = 0; i < mainChilds.length; i++){ //Loops through all the children
        mainChilds[i].setAttribute("tabindex", "1"); //and sets the tabindex to "1"
    }
}

//========================6.6.3. MODAL TABINDEX HANDLING========================
function controlChildrenTabIndexModal(){ //A function to set the modals children to "tabindex = 1" and set the menu children to "tabindex = -1"
    let modalChilds = document.querySelector(".app-box__popup").children; //Selects all the children of the modal dialog
    let menuChilds = document.querySelector(".app-box__header").children; //Selects all the children of the header-container

    for (let i = 0; i < modalChilds.length; i++){ //Loops through all the children of the modal
        modalChilds[i].setAttribute("tabindex", "1"); //and sets their tabindex to "1"
        menuChilds[i].setAttribute("tabindex", "-1"); //while setting the children of the modal to "-1". Slightly unnessecary but for possible future use.
    }
    document.querySelector(".material-icons").setAttribute("tabindex", "-1"); //Selects and sets the tabindex of the sidemenu icon to "-1"
    document.querySelector(".app-box__popup--buttons").setAttribute("tabindex", "-1"); //Selects and sets the tabindex of the button-container in the modal to "-1" to make the tab-navigation easier.
}
