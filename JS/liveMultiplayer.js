"use strict";

async function joinGame(gameID) {
    console.log(`joinGame GameID: ${gameID}`);
    const request = new Request("../PHP/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: window.localStorage.getItem("username"),
            action: "liveGame",
            subAction: "fetchGameInfo",
            gameID: gameID
        })
    })

    const response = await callAPI(request, true, false);
    const resource = await response.json();

    window.localStorage.setItem("gameInfo", JSON.stringify(await resource));

    const initialEpoch = Math.round(Date.now() / 1000)

    calculateNextFetch(initialEpoch, gameID);
}

async function calculateNextFetch(initialEpoch, gameID) {
    console.log(`calculateFetch GameID: ${gameID}`);
    const secondsSinceEpoch = Math.round(Date.now() / 1000);

    if (secondsSinceEpoch > initialEpoch) {

        const intervalID = await startFetchGameInfo(gameID);
        renderLobby(intervalID);

    } else {
        setTimeout(function () {
            calculateNextFetch(initialEpoch, gameID)
        }, 50);
    }

}

async function startFetchGameInfo(gameID) {
    console.log(`startFetch GameID: ${gameID}`);
    const intervalID = setInterval(async function () {
        console.log(`interval GameID: ${gameID}`);
        const body = {
            username: window.localStorage.getItem("username"),
            action: "liveGame",
            subAction: "fetchGameInfo",
            gameID: gameID
        }
        const request = new Request("../PHP/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        console.log(body);

        const response = await callAPI(request, true, false);
        const resource = await response.json();

        window.localStorage.setItem("gameInfo", JSON.stringify(await resource));
        const randomNum = Math.floor(Math.random() * 100) + 1;
        console.log("**************************************" + randomNum);
    }, 1000)

    return intervalID;
}

async function renderLobby(fetchIntervalID) {

    console.log(fetchIntervalID);

    const main = document.querySelector("main");

    main.innerHTML = `
        <div id="contentWrapper">
        
            <h1>Waiting for the host to start the game</h1>
            <div id="lobbyMemberList"></div>
            <button id="lobbyButton"></button>

        </div>
    `

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    const username = window.localStorage.getItem("username");
    const userID = window.localStorage.getItem("userID");
    console.log(userID);
    console.log(gameInfo, gameInfo.hostID);
    console.log(gameInfo.hostID);

    const intervalID = setInterval(function () {
        if (window.localStorage.getItem("gameInfo")) {

            const gameObject = JSON.parse(window.localStorage.getItem("gameInfo"));
            const gameMembers = gameObject.members;
            console.log(gameMembers);

            const memberListDom = main.querySelector("#lobbyMemberList")
            const lobbyMembers = memberListDom.querySelectorAll(".member");


            if (lobbyMembers.length != gameMembers.length) {
                memberListDom.innerHTML = "";

                gameMembers.forEach(member => {
                    const memberDiv = document.createElement("div");
                    memberDiv.classList.add("member");

                    memberDiv.innerHTML = `
                        <div class="crown"></div>
                        <div class="lobbyProfilePic" style="background-image: url('${member.profilePicture}')"></div>
                        <div class="lobbyProfileName">${member.name}</div>
                    `

                    memberListDom.appendChild(memberDiv);
                })
            }

            if (gameObject.isStarted === true) {
                clearInterval(intervalID);
                prepareQuestion(0);
            }
        }
    }, 1000)

    if (userID == gameInfo.hostID) {
        const button = main.querySelector("#lobbyButton")
        button.textContent = "Start game!";
        button.addEventListener("click", async function (ev) {
            const request = new Request("../PHP/api.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: window.localStorage.getItem("username"),
                    action: "liveGame",
                    subAction: "startGame",
                    gameID: gameInfo.gameID
                })
            })

            const response = await callAPI(request, true, false);
        })
    } else {
        const button = main.querySelector("#lobbyButton")
        button.textContent = "Leave game";

        button.addEventListener("click", async function (ev) {
            const request = new Request("../PHP/api.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    userID: userID,
                    action: "liveGame",
                    subAction: "leaveGame",
                    gameID: gameInfo.gameID
                })
            })

            const response = await callAPI(request, true, false);

            clearInterval(fetchIntervalID)
            clearInterval(intervalID);
            window.localStorage.removeItem("gameInfo");
            renderStartingpage();


        })
    }

}


function prepareQuestion(questionToLoad) {
    const main = document.querySelector("main");

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    window.localStorage.removeItem("gameInfo");

    gameInfo.currentQuestion = gameInfo.questions[questionToLoad];

    window.localStorage.setItem("gameInfo", gameInfo);

    main.innerHTML = `
        <h1>GET READY</h1>
        <div id="countdown">5</div>
    `

    const intervalID = setInterval(function () {
        const countdown = document.querySelector("main > #countdown")

        const currentSec = parseInt(countdown.textContent);

        if (currentSec === 0) {
            clearInterval(intervalID);
            nextQuestion(questionToLoad);
        } else {
            countdown.textContent = currentSec - 1;
        }

    }, 1000)
}

function nextQuestion(questionToLoad) {
    const gameObject = JSON.parse(window.localStorage.getItem("gameInfo"));

    const questions = gameObject.questions;

    const currentQuestion = questions[questionToLoad];
    const questionType = currentQuestion.type;

    console.log(currentQuestion);

    switch (questionType) {
        case "plot":
            mpTextQuestion(currentQuestion);
            break;
        case "actors":
            mpTextQuestion(currentQuestion);
            break;
        case "trailer":
            mpTrailerQuestion(currentQuestion);
            break;
        case "poster":
            mpPosterQuestion(currentQuestion);
            break;
    }
}

function mpTextQuestion(question) {
    const main = document.querySelector("main");

    main.innerHTML = `

        <div id="contentWrapper">
            <div id="questionContainer">
            
                <div id="timer">10</div>
                <div id="questionTitle">${question.questionTitle}</div>
                <div id="questionText">${question.questionText}</div>
        
            </div>
            <div id="alternatives"></div>
        </div>

    `

    startQuestionTimer(question)

    const qAlternatives = question.alternatives;

    qAlternatives.forEach(alternative => {
        const altDiv = main.querySelector("#alternatives");

        const alt = document.createElement("div");
        alt.classList.add("alternative");

        alt.textContent = alternative.title;

        alt.addEventListener("click", (event) => {
            mpCheckAnswer(event, question)
        })

        altDiv.append(alt);
    })

}

function mpTrailerQuestion(question) {
    const main = document.querySelector("main");

    main.innerHTML = `
    
        <div id="contentWrapper">
        
            <div id="timer">10</div>
            <div id="videoContainer">
            
                <iframe></iframe>

            </div>

            <div id="answerContainer">

                <input id="searchAnswer">
                <div id="foundAnswers"></div>

            </div>

        </div>

    `

    startQuestionTimer(question)

}

function mpPosterQuestion(question) {
    const main = document.querySelector("main");

    main.innerHTML = `
    
        <div id="contentWrapper">
        
            <div id="contentWrapper">
                <div id="timer">10</div>
                <div id="poster"></div>

            </div>
        
            <div id="answerContainer">
            
                <input id="searchAnswer">
                <div id="foundAnswers"></div>
            
            </div>

        </div>

    `

    startQuestionTimer(question)

}

async function mpCheckAnswer(ev, question) {

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    const answerTime = document.querySelector("#timer").textContent
    const questType = question.type;

    console.log(gameInfo);

    let answer;
    switch (questType) {
        case "actor":
            answer = ev.target.textContent;
        case "plot":
            answer = ev.target.textContent;
    }

    const request = new Request("../PHP/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "liveGame",
            subAction: "answerQuestion",
            userID: window.localStorage.getItem("userID"),
            username: window.localStorage.getItem("username"),
            gameID: gameInfo.gameID,
            questionID: question.questionID,
            answerTime: parseFloat(answerTime).toFixed(1),
            answer: ev.target.textContent
        })
    })

    const response = await callAPI(request, true, false);
    const resource = await response.json();

    if (resource.correct == false) {

    }

    if (resource.correct == true) {

    }
}

function startQuestionTimer(question) {
    const timer = document.querySelector("#timer");

    if (timer) {
        const intervalID = setInterval(() => {
            let currentTimerValue = parseFloat(timer.textContent);

            timer.textContent = (currentTimerValue - 0.1).toFixed(1);

            if (currentTimerValue == 0) {
                clearInterval(intervalID);
                checkNextQuestion(question);
            }
        }, 100);
    }
}

function checkNextQuestion(question) {
    const currentGame = JSON.parse(window.localStorage.getItem("gameInfo"));
    const questionsArray = currentGame.questions;

    const nextIndex = question.questionID + 1;

    if (questionsArray.length - 1 != question.questionID) {
        prepareQuestion(nextIndex);
    } else {
        // loadEndScreen()
    }
}