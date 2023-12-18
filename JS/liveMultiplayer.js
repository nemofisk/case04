"use strict";

/*

TODO:
Ändra så att man väntar på alla innan nästa fråga ges:
    nyckel som kollar så att alla som är med i gamet(userID) har svarat och nått endscreen, sen uppdateras nyckeln nextQuestion till true, sen false när nästa börjat

Ändra end game - just nu nya frågor när första är klar och lämnar *BYTA*

*/

async function joinGame(gameID) {
    console.log(`joinGame GameID: ${gameID}`);
    const request = new Request("PHP/api.php", {
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
        const request = new Request("PHP/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        // console.log(body);

        const response = await callAPI(request, true, false);
        const resource = await response.json();

        window.localStorage.setItem("gameInfo", JSON.stringify(await resource));
        const randomNum = Math.floor(Math.random() * 100) + 1;
        // console.log("**************************************" + randomNum);
    }, 1000)

    window.localStorage.setItem("fetchIntervalID", intervalID)

    return intervalID;
}

async function renderLobby(fetchIntervalID) {

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
                        <div class="lobbyProfilePic" style="background-image: url('images/${member.profilePicture}')"></div>
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
            const request = new Request("PHP/api.php", {
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
            const request = new Request("PHP/api.php", {
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

        alt.dataset.title = alternative.title
        console.log(alternative.title);

        alt.innerHTML = `
            <div class="altTitle">${alternative.title}</div>
        `

        alt.querySelector(".altTitle").dataset.title = alternative.title;
        altDiv.append(alt);
    })

    const allAlts = document.querySelectorAll(".alternative")

    function altEvent(event) {
        const allAlternatives = document.querySelectorAll(".alternative")

        console.log(allAlternatives);

        allAlternatives.forEach(altern => {
            altern.removeEventListener("click", altEvent)
        })

        mpCheckAnswer(event, question)
    }

    allAlts.forEach(al => {
        al.addEventListener("click", altEvent);
    })



}

function mpTrailerQuestion(question) {
    const main = document.querySelector("main");

    main.innerHTML = `
    
        <div id="contentWrapper">
        
            <div id="timer">20</div>
            <div id="videoContainer">
            
                <iframe src=${question.youtubeLink}?autoplay=1&mute=1&controls=0&disablekb=1&showinfo=0 title="" frameborder="0" controls="0" disablekb="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

                <div id="movieCoverUp"></div>
                <div id="movieCoverDown"></div>

            </div>

            <div id="answerContainer">

                <input id="searchMovie">
                <div id="foundMovies"></div>

            </div>

        </div>

    `


    startQuestionTimer(question)

    const searchMovie = document.querySelector("#searchMovie");
    searchMovie.addEventListener("input", ev => {
        findMovie(ev, question)
    })

}

function mpPosterQuestion(question) {
    const main = document.querySelector("main");

    main.innerHTML = `
    
        <div id="contentWrapper">
        
            <div id="questionContainer">
                <div id="timer">10</div>
                <div id="poster"></div>

            </div>
        
            <div id="answerContainer">
            
                <input id="searchMovie">
                <div id="foundMovies"></div>
            
            </div>

        </div>

    `

    const posterDiv = document.querySelector("#poster");

    posterDiv.style.backgroundImage = `url('${question.poster}')`;

    setTimeout(() => {
        posterDiv.classList.add("blur")
    }, 100)

    startQuestionTimer(question);

    const searchMovie = document.querySelector("#searchMovie");
    searchMovie.addEventListener("input", ev => {
        findMovie(ev, question)
    })

}

async function mpCheckAnswer(ev, question, txtAnswer = undefined) {

    console.log(ev.target.dataset.title);

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    const answerTime = document.querySelector("#timer").textContent
    const questType = question.type;

    console.log(questType);
    console.log(gameInfo);

    let answer;
    switch (questType) {
        case "actors":
            answer = ev.target.dataset.title;
            break;
        case "plot":
            answer = ev.target.dataset.title;
            break;
        case "trailer":
            answer = txtAnswer;
            break;
        case "poster":
            answer = txtAnswer;
            break;
    }

    console.log(answer);

    const rBody = {
        action: "liveGame",
        subAction: "answerQuestion",
        userID: window.localStorage.getItem("userID"),
        username: window.localStorage.getItem("username"),
        gameID: gameInfo.gameID,
        questionID: question.questionID,
        answerTime: parseFloat(answerTime).toFixed(1),
        qType: question.type,
        answer: answer
    }

    const request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rBody)
    })

    const response = await callAPI(request, true, false);
    const resource = await response.json();

    let targetAlt;

    if (questType == "actors" || questType == "plot") {
        const alternatives = document.querySelectorAll(".alternative");
        alternatives.forEach(alt => {
            if (alt.querySelector(".altTitle").textContent == answer) {
                targetAlt = alt;
            }
        })
    }

    if (questType == "trailer" || questType == "poster") {
        const alternatives = document.querySelectorAll(".alternative");
        alternatives.forEach(alt => {
            if (alt.textContent == answer) {
                targetAlt = alt;
            }
        })
    }

    if (resource.correct == false) {
        targetAlt.classList.add("wrong")
    }

    if (resource.correct == true) {
        targetAlt.classList.add("correct")
    }
}

function startQuestionTimer(question) {

    console.log(question.questionID + 1);
    const timer = document.querySelector("#timer");

    if (timer) {
        const intervalID = setInterval(() => {
            let currentTimerValue = parseFloat(timer.textContent);

            timer.textContent = (currentTimerValue - 0.1).toFixed(1);

            if (currentTimerValue == 0) {

                clearInterval(intervalID);

                endOfQuestion(question);
            }
        }, 100);
    }
}

async function endOfQuestion(question) {
    document.querySelector("#timer").textContent = "0";

    const qType = question.type;
    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    const request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "liveGame",
            subAction: "fetchQuestion",
            questionID: question.questionID,
            gameID: gameInfo.gameID
        })
    })

    const response = await callAPI(request, true, false);
    const resource = await response.json();

    const correctAnswer = resource.correctAnswer;

    if (qType == "plot" || qType == "actors") {
        const alternativeDivs = document.querySelectorAll(".alternative");
        const alternativesDiv = document.querySelector("#alternatives")

        alternativeDivs.forEach(alternative => {

            const title = alternative.querySelector(".altTitle")

            if (title.textContent == correctAnswer) {
                alternative.classList.add("correct");
            } else {
                alternative.classList.add("wrong");
            }

            const whoGuessed = document.createElement("div");
            whoGuessed.classList.add("whoGuessed");

            console.log(whoGuessed);

            resource.alternatives.forEach(alt => {
                if (alt.title == title.textContent) {
                    alt.whoGuessed.forEach(player => {
                        console.log(player);
                        const playerDiv = document.createElement("div");

                        playerDiv.classList.add("playerImg");

                        playerDiv.style.backgroundImage = `url('../images/${player.profilePicture}')`;

                        whoGuessed.appendChild(playerDiv);
                    })
                }
            })

            alternative.appendChild(whoGuessed);

        })

    }

    if (qType == "trailer" || qType == "poster") {

    }

    const questions = gameInfo.questions;

    if (question.questionID + 1 == questions.length / 2 || question.questionID + 1 == questions.length) {
        setTimeout(() => {
            currentStanding(question);
        }, 3000)
    } else {
        setTimeout(() => {
            checkNextQuestion(question);
        }, 3000)
    }

}

async function currentStanding(question) {

    const allLightCurtains = document.querySelectorAll(".curtainsLightStartingpage");
    const allDarkCurtains = document.querySelectorAll(".curtainsStartingpage");

    console.log(allLightCurtains);

    allLightCurtains.forEach(crtn => {
        crtn.style.height = "93vh"
    });

    allDarkCurtains.forEach(crtn => {
        crtn.style.height = "91vh"
    });

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    const gameMembers = gameInfo.members;
    const questions = gameInfo.questions;

    gameMembers.sort((a, b) => b.points - a.points);

    const main = document.querySelector("main");

    if (question.questionID + 1 == questions.length / 2) {
        main.innerHTML = `
            <div id="contentWrapper">
            
                <div id="countdown">15</div>
        
                <div id="topThree"></div>
        
                <div id="restList"></div>
            
            </div>
        `

        const intervalID = setInterval(function () {
            const countdown = main.querySelector("#countdown");

            const currentSec = parseInt(countdown.textContent);

            if (currentSec === 0) {
                clearInterval(intervalID);

                allLightCurtains.forEach(crtn => {
                    crtn.style.height = "117px"
                });

                allDarkCurtains.forEach(crtn => {
                    crtn.style.height = "109px"
                });

                checkNextQuestion(question);

            } else {
                countdown.textContent = currentSec - 1;
            }

        }, 1000)
    }

    if (question.questionID + 1 == questions.length) {

        const fetchIntervalID = parseInt(JSON.parse(window.localStorage.getItem("fetchIntervalID")));

        console.log(fetchIntervalID);

        clearInterval(fetchIntervalID);

        const request = new Request("PHP/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "liveGame",
                subAction: "endGame",
                userID: window.localStorage.getItem("userID"),
                gameID: gameInfo.gameID,
                genres: gameInfo.genres
            })
        })

        await callAPI(request, true, false);

        main.innerHTML = `
            <div id="contentWrapper">
            
                <h1 id="endScreenHead">RESULTS</h1>
        
                <div id="topThree"></div>
        
                <div id="restList"></div>

                <button id="playAgainButton">PLAY AGAIN</button>
            
            </div>
        `

        const playAgainButton = document.querySelector("#playAgainButton");

        playAgainButton.addEventListener("click", async function (ev) {

            const request = new Request("PHP/api.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: window.localStorage.getItem("username"),
                    userID: window.localStorage.getItem("userID"),
                    gameID: gameInfo.gameID,
                    action: "multiplayer",
                    subAction: "acceptInvite"

                })
            })

            const response = await callAPI(request, true, false);

            joinGame(gameInfo.gameID);
        })

    }

    for (let i = 0; i < gameMembers.length; i++) {
        if (i <= 2) {
            const topThreeDiv = document.createElement("div");
            topThreeDiv.id = `topThree${i + 1}`;
            topThreeDiv.classList.add("topThreeDiv")
            topThreeDiv.innerHTML = `
                <div class="playerImageDiv">
                    <div class="positionImage"></div>
                    <div class="playerImage" style="background-image: url('../images/${gameMembers[i].profilePicture}')"></div>
                </div>
                <div class="currentPoints">${gameMembers[i].points}</div>
            `

            document.querySelector("#topThree").appendChild(topThreeDiv);
        }

        if (i >= 3 && gameMembers.length > 3) {
            const restListDiv = document.createElement("div");
            restListDiv.classList.add("restListDiv");

            restListDiv.innerHTML = `
                <div class="restListDivLeft">

                    <div class="playerImageDiv">
                        <div class="positionImage"></div>
                        <div class="playerImage" style="background-image: url('../images/${gameMembers[i].profilePicture}')"></div>
                    </div>

                    <div>${gameMembers[i].name}</div>
                
                </div>

                <div class="currentPoints">${gameMembers[i].points}</div>
            `

            document.querySelector("#restList").appendChild(restListDiv);
        }
    }

    console.log(gameMembers);
}

function checkNextQuestion(question) {
    const currentGame = JSON.parse(window.localStorage.getItem("gameInfo"));
    const questionsArray = currentGame.questions;

    const nextIndex = question.questionID + 1;

    if (questionsArray.length - 1 != question.questionID) {
        prepareQuestion(nextIndex);
    }
}

async function findMovie(event, question) {
    let movieResults = document.getElementById("foundMovies");
    movieResults.innerHTML = ``;
    let input = document.getElementById("searchMovie");

    //input event listner för att hämta strängen. 
    const string = event.target.value;

    const response = await fetch(`DATA/movies.json`);
    const data = await response.json();
    let movies = [];

    for (let i = 0; i < data.length; i++) {
        movies.push(data[i].Title)

    }
    let filteredArray = [];

    movies.forEach(movie => {
        if (movie !== undefined) {
            //The startsWith method is like the includes() method but it checks the beginning of the string instead. 
            if (movie.toLowerCase().startsWith(string.toLowerCase())) {
                filteredArray.push(movie);
            }
        }
    })

    filteredArray.splice(3);

    for (let i = 0; i < filteredArray.length; i++) {

        let movieDiv = document.createElement("div");
        movieDiv.classList.add("alternative");
        movieDiv.textContent = filteredArray[i];

        movieDiv.addEventListener("click", ev => {
            const txtAnswer = ev.target.textContent;
            mpCheckAnswer(ev, question, txtAnswer);
        })

        movieResults.appendChild(movieDiv);
    }
}