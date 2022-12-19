// Setting Levels
const levels = {
    "Easy": 5,
    "Normal": 3,
    "Hard": 2
};

// Arrays Of Words
const easyWords = [
    "Hello",
    "Code",
    "Town",
    "Task",
    "Scala",
    "Sugar",
    "Funny",
    "Roles",
    "Test",
    "Rust"
];

let normalWords = [
    "Country",
    "Testing",
    "Egypt",
    "Internet",
    "Shooting",
    "Styling",
    "Cascade",
    "Runner",
    "Working",
    "Playing"
];

let hardWords = [
    "Doha",
    "Javascript",
    "Coding",
    "Jerusalem",
    "Github",
    "Python",
    "Linkedin",
    "Paradigm",
    "Twitter",
    "Youtube"
];


//Get elements
let selectLevels = document.getElementById("selectLevels");
let levelSpan = document.querySelector(".lvl");
let secs = document.querySelector(".seconds");
let timeLeft = document.querySelector(".time span");
let theWord = document.querySelector(".the-word");
let input = document.querySelector(".input");
let startBtn = document.querySelector(".start");
let upcomingWords = document.querySelector(".upcoming-words");
let score = document.querySelector(".got");
let total = document.querySelector(".total");
let finish = document.querySelector(".finish");
let gameInstructions = document.querySelector(".game-instructions");

//Set default level and default values
let defaultLevel = "Easy";
let defaultSec = levels[defaultLevel];

let level = defaultLevel;
let arrLevel = easyWords;

total.innerHTML = easyWords.length;
secs.innerHTML = defaultSec;

//Check if this reloading from playAgain button
window.onload = () => {
    if (sessionStorage.getItem("replaying") === "true") {
        level = sessionStorage.getItem("level");
        selectLevels.value = level;
        secs.innerHTML = levels[level];
        //Set the total words according to the level
        if (level === "Normal") {
            total.innerHTML = normalWords.length;
            arrLevel = normalWords;
        } else if (level === "Hard") {
            total.innerHTML = hardWords.length;
            arrLevel = hardWords;
        }
        startBtn.click();
        sessionStorage.removeItem("replaying");
    }
    if (sessionStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        let themeChanger = document.querySelector(".theme-changer");
        themeChanger.innerHTML = "<i class='gg-sun'></i>";
    }
}

//While level is changing
selectLevels.onchange = function () {
    //Get the level that chosen
    level = this.value;
    //Set the time per a word according to the level
    secs.innerHTML = levels[level];

    //Set the total words according to the level
    if (level === "Normal") {
        total.innerHTML = normalWords.length;
        arrLevel = normalWords;
    } else if (level === "Hard") {
        total.innerHTML = hardWords.length;
        arrLevel = hardWords;
    }
}

//Disabled paste on the input
input.onpaste = () => {
    return false;
}

//Start Button 
startBtn.onclick = function () {
    this.remove();
    input.focus();
    generateWords();
}

function generateWords() {
    //Get and show random word from the array
    let word = arrLevel[Math.trunc(Math.random() * arrLevel.length)];
    theWord.innerHTML = word

    //Delete this word from the array
    let indxOfTheWord = arrLevel.indexOf(word);
    arrLevel.splice(indxOfTheWord, 1);

    //Empty the upcoming-words div to get it ready for newly array
    upcomingWords.innerHTML = "";

    //Show Upcoming-Words
    for (let i = 0; i < arrLevel.length; i++) {
        let span = document.createElement("span");
        let spanText = document.createTextNode(arrLevel[i]);
        span.appendChild(spanText);
        upcomingWords.appendChild(span);
    }
    startTheGame();
}

//Set Array to store the score and the date in localStorage
let savedScore = [];

function startTheGame() {
    if ((arrLevel.length + 1) == total.innerHTML) { //Check if this the first Time of playing
        let bonusSecondsForFirstTime = 3;
        timeLeft.innerHTML = levels[level] + bonusSecondsForFirstTime;
    } else {
        timeLeft.innerHTML = levels[level];
    }
    let intervalId = setInterval(() => {
        timeLeft.innerHTML--;
        if (timeLeft.innerHTML === "0") { //When time left is finished
            clearInterval(intervalId);

            if (input.value.toLowerCase() === theWord.innerHTML.toLowerCase() && arrLevel.length) {
                input.value = "";
                score.innerHTML++;
                generateWords();
            } else if (input.value.toLowerCase() === theWord.innerHTML.toLowerCase() && !arrLevel.length) {
                //End Game
                upcomingWords.remove();
                score.innerHTML++;

                let div = document.createElement("div");
                let divText = document.createTextNode("Congrats");
                div.appendChild(divText);
                div.className = "success";
                finish.appendChild(div);

                //Create play again button
                let playAgainBtn = document.createElement("button");
                let btnText = document.createTextNode("Play Again");
                playAgainBtn.appendChild(btnText);
                playAgainBtn.className = "play-again";
                finish.appendChild(playAgainBtn);

                playAgainBtn.onclick = function () {
                    sessionStorage.setItem("replaying", "true");
                    sessionStorage.setItem("level", selectLevels.value);
                    location.reload();
                }

                //Set score with the date to localStorage
                if (localStorage.length) { //if there is score saved in localStorage
                    let scores = JSON.parse(localStorage.getItem("scores"));
                    scores.push([level, score.innerHTML + " / " + total.innerHTML, new Date()]);
                    localStorage.setItem("scores", JSON.stringify(scores));
                } else { //if not
                    savedScore.push([level, score.innerHTML + " / " + total.innerHTML, new Date()]);
                    localStorage.setItem("scores", JSON.stringify(savedScore));
                }
            } else { //If array is finished but the input is false
                upcomingWords.remove();

                let div = document.createElement("div");
                let divText = document.createTextNode("Game Over");
                div.appendChild(divText);
                div.className = "failed";
                finish.appendChild(div);

                //Create play again button
                let playAgainBtn = document.createElement("button");
                playAgainBtn.className = "play-again";
                let btnText = document.createTextNode("Play Again");
                playAgainBtn.appendChild(btnText);

                finish.appendChild(playAgainBtn);

                playAgainBtn.onclick = function () {
                    sessionStorage.setItem("replaying", "true");
                    sessionStorage.setItem("level", selectLevels.value);
                    sessionStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
                    location.reload();
                }

                //Set score with the date to localStorage
                if (localStorage.length) { //if there is score saved in localStorage
                    let scores = JSON.parse(localStorage.getItem("scores"));
                    scores.push([level, score.innerHTML + " / " + total.innerHTML, new Date()]);
                    localStorage.setItem("scores", JSON.stringify(scores));
                } else { //if not
                    savedScore.push([level, score.innerHTML + " / " + total.innerHTML, new Date()]);
                    localStorage.setItem("scores", JSON.stringify(savedScore));
                }
            }
        } else { //To check before time left reach to 0
            if (input.value.toLowerCase() === theWord.innerHTML.toLowerCase() && !arrLevel.length) {
                //End Game
                upcomingWords.remove();
                score.innerHTML++;

                let div = document.createElement("div");
                let divText = document.createTextNode("Congrats");
                div.appendChild(divText);
                div.className = "success";
                finish.appendChild(div);

                //Create play again button
                let playAgainBtn = document.createElement("button");
                playAgainBtn.className = "play-again";
                let btnText = document.createTextNode("Play Again");
                playAgainBtn.appendChild(btnText);

                finish.appendChild(playAgainBtn);

                playAgainBtn.onclick = function () {
                    sessionStorage.setItem("replaying", "true");
                    sessionStorage.setItem("level", selectLevels.value);
                    location.reload();
                }

                //Stop the timer
                clearInterval(intervalId);

                //Set score with the date to localStorage
                if (localStorage.length) { //if there is score saved in localStorage
                    let scores = JSON.parse(localStorage.getItem("scores"));
                    scores.push([level, score.innerHTML + " / " + total.innerHTML, new Date()]);
                    localStorage.setItem("scores", JSON.stringify(scores));
                } else { //if not
                    savedScore.push([level, score.innerHTML + " / " + total.innerHTML, new Date()]);
                    localStorage.setItem("scores", JSON.stringify(savedScore));
                }
            } else if (input.value.toLowerCase() === theWord.innerHTML.toLowerCase() && arrLevel.length) {
                input.value = "";
                score.innerHTML++;

                clearInterval(intervalId);

                generateWords();
            }
        }
    }, 1000);
}

//Set game instructions table
if (Object.keys(levels).length) {
    //Create the table
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let th1 = document.createElement("th");
    let th2 = document.createElement("th");
    let th3 = document.createElement("th");
    let tr = document.createElement("tr");
    let td = document.createElement("td");

    //Apply style on the table
    table.setAttribute("border", 1);
    tbody.style.textAlign = "center";
    th2.style.padding = "0 5px";
    th3.style.padding = "0 5px";


    th1.appendChild(document.createTextNode("Level"));
    th2.appendChild(document.createTextNode("Seconds For A Word"));
    th3.appendChild(document.createTextNode("Total Words"));

    thead.appendChild(th1);
    thead.appendChild(th2);
    thead.appendChild(th3);

    table.appendChild(thead);

    for (const lvl in levels) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");

        td1.style.padding = "0 5px";

        let td1Text = document.createTextNode(lvl);
        td1.appendChild(td1Text);
        tr.appendChild(td1);

        let td2Text = document.createTextNode(levels[lvl]);
        td2.appendChild(td2Text);
        tr.appendChild(td2);

        if (lvl === "Normal") {
            let td3Text = document.createTextNode(normalWords.length);
            td3.appendChild(td3Text);
            tr.appendChild(td3);
        } else if (lvl === "Hard") {
            let td3Text = document.createTextNode(hardWords.length);
            td3.appendChild(td3Text);
            tr.appendChild(td3);
        } else {
            let td3Text = document.createTextNode(easyWords.length);
            td3.appendChild(td3Text);
            tr.appendChild(td3);
        }

        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    gameInstructions.appendChild(table);
}

function printScoresTableFromLocalStorage() {
    //Remove the old body in the scoreSheet if found
    let targetTbody = document.querySelector(".score-sheet tbody");
    targetTbody.remove();

    //Set Time Zne for Egypt
    let timeZone = 2;

    //create a row
    let scoreSheet = document.querySelector(".score-sheet");
    let tbody = document.createElement("tbody");


    let scoreSheetData = JSON.parse(localStorage.getItem("scores"));
    scoreSheetData.reverse().forEach(e => {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let br = document.createElement("br");

        td3.className = "date";

        //get the Level from LocalStorage
        let levelText = document.createTextNode(e[0]);
        td1.appendChild(levelText);
        //get the Score from LocalStorage
        let scoreText = document.createTextNode(e[1]);
        td2.appendChild(scoreText);
        //get the date from LocalStorage and add the def of time zone to the time
        let time = e[2].slice(12, 18) + timeZone;
        let date = e[2].slice(0, 10);
        let timeText = document.createTextNode(time);
        let dateText = document.createTextNode(date);

        td3.appendChild(timeText);
        td3.appendChild(br);
        td3.appendChild(dateText);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
        scoreSheet.appendChild(tbody);
    });
}
//Insert stored data into the ScoreSheet table
if (localStorage.length) {
    document.querySelector(".no-score-saved").remove();
    //Call the function to print stored data that sorted by the date as desc
    printScoresTableFromLocalStorage();
}

//Sort the data in score sheet by Level
let levelBtn = document.querySelector(".score-sheet th:first-child");
levelBtn.onclick = (e) => {
    if (!document.querySelector(".no-score-saved")) {
        let levels = document.querySelectorAll(".score-sheet tbody tr td:first-child");

        let sortedEasyLevel = [];
        let sortedNormalLevel = [];
        let sortedHardLevel = [];

        //Store sorted rows
        levels.forEach(e => {
            if (e.innerHTML == "Easy") {
                let targetRow = e.parentElement;
                sortedEasyLevel.push(e.parentElement);
            } else if (e.innerHTML == "Normal") {
                let targetRow = e.parentElement;
                sortedNormalLevel.push(targetRow);
            } else {
                let targetRow = e.parentElement;
                sortedHardLevel.push(targetRow);
            }
        });

        //Merge Arrays with the right order
        let sortedLevels = [...sortedHardLevel, ...sortedNormalLevel, ...sortedEasyLevel];

        //Remove the old body of the table to replace the new one
        let targetScoreSheet = document.querySelector(".score-sheet");
        let targetTbody = document.querySelector(".score-sheet tbody");
        targetTbody.remove();

        let newTbody = document.createElement("tbody");

        //Add sorted rows to the new body
        sortedLevels.forEach(e => {
            newTbody.appendChild(e);
        });
        //Add the new body to the table
        targetScoreSheet.appendChild(newTbody);
    }
}

//Sort the data in score sheet by Score
let scoreBtn = document.querySelector(".score-sheet th:nth-child(2)");
scoreBtn.onclick = () => {
    if (!document.querySelector(".no-score-saved")) {
        let unsortedScores = document.querySelectorAll(".score-sheet tbody tr td:nth-child(2)");

        //Get the scores and stor theme in the sortedValues array
        let sortedValues = [];
        unsortedScores.forEach(e => {
            sortedValues.push(e.innerHTML.slice(0, 2))
        });
        //Sort Values as desc
        sortedValues.sort().reverse();
        sortedValues.sort((a, b) => { return a == 10 ? -1 : b == 10 ? 1 : 0 })
        //Set array to store scores in
        let sortedScores = [];
        //Store rows that their scores are sorted to storedScore array
        sortedValues.forEach(val => {
            unsortedScores.forEach(e => {
                if (val == e.innerHTML.slice(0, 2)) {
                    sortedScores.push(e.parentElement);
                }
            });
        });

        //Remove the old body of the table to replace the new one
        let targetScoreSheet = document.querySelector(".score-sheet");
        let targetTbody = document.querySelector(".score-sheet tbody");
        targetTbody.remove();

        let newTbody = document.createElement("tbody");

        //Add sorted rows to the new body
        sortedScores.forEach(e => {
            newTbody.appendChild(e)
        });
        //Add the new body to the table
        targetScoreSheet.appendChild(newTbody)
    }
}

//Sort the data in scoreSheet by the Date
let dateBtn = document.querySelector(".score-sheet th:last-child");
dateBtn.onclick = () => {
    if (!document.querySelector(".no-score-saved")) {
        printScoresTableFromLocalStorage();

        //Before create that function i used this way to get the result//
        //     let unsortedDates = document.querySelectorAll(".score-sheet tbody tr td:last-child");
        //     //Get the scores and stor theme in the sortedValues array
        //     let sortedValues = [];           
        //     unsortedDates.forEach(e => {
        //         let dateContent = e.innerHTML.replace("<br>", " ");
        //         sortedValues.push(dateContent);
        //     });
        //     //Sort Values as desc
        //     sortedValues.sort().reverse();

        //     //Set array to store Dates
        //     let sortedDates = [];
        //     //Store rows that their dates are sorted to sortedDates array
        //     sortedValues.forEach(val => {
        //         unsortedDates.forEach(e => {
        //             if (val == e.innerHTML.replace("<br>", " ")) {
        //                 sortedDates.push(e.parentElement);
        //             }
        //         });
        //     });

        //     //Remove the old body of the table to replace the new one
        //     let targetScoreSheet = document.querySelector(".score-sheet");
        // let targetTbody = document.querySelector(".score-sheet tbody");
        // targetTbody.remove();

        //     let newTbody = document.createElement("tbody");

        //     //Add sorted rows to the new body
        //     sortedDates.forEach(e => {
        //         newTbody.appendChild(e)
        //     });
        //     //Add the new body to the table
        //     targetScoreSheet.appendChild(newTbody)
    }
}

//ScrollTop button
let scrollTopBtn = document.querySelector(".scroll-top-btn");
// let show = document.querySelector("show");

window.onscroll = () => {
    this.scrollY >= 200
        ? scrollTopBtn.classList.add("show")
        : scrollTopBtn.classList.remove("show");
};

scrollTopBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

//Change Theme Button
let themeChanger = document.querySelector(".theme-changer");
let body = document.querySelector("body");
themeChanger.onclick = () => {
    if (body.classList.contains("dark-mode")) {
        themeChanger.innerHTML = "<i class='gg-moon'></i>";
        body.classList.remove("dark-mode");
        sessionStorage.removeItem("theme");
    } else {
        themeChanger.innerHTML = "<i class='gg-sun'></i>";
        body.classList.add("dark-mode");
        sessionStorage.setItem("theme", "dark");
    }
};