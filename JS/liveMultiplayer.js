"use strict";

/*

TODO:
Ändra så att man väntar på alla innan nästa fråga ges:
    nyckel som kollar så att alla som är med i gamet(userID) har svarat och nått endscreen, sen uppdateras nyckeln nextQuestion till true, sen false när nästa börjat

Ändra end game - just nu nya frågor när första är klar och lämnar *BYTA* Nya frågor när startGame klickas, inte tas bort från members när når end screen, resetta alla poäng när klickar startGame

*/

async function joinGame(gameID) {
    const allLightCurtains = document.querySelectorAll(".curtainsLightStartingpage");
    const allDarkCurtains = document.querySelectorAll(".curtainsStartingpage");
    const allFooterLightCurtains = document.querySelectorAll(".footercurtainsLightStartingpage");
    const allFooterDarkCurtains = document.querySelectorAll(".footercurtainsStartingpage");

    allFooterLightCurtains.forEach(crtn => {
        crtn.style.height = "0vh"
    });

    allFooterDarkCurtains.forEach(crtn => {
        crtn.style.height = "0vh"
    });

    allLightCurtains.forEach(crtn => {
        crtn.style.height = "0vh"
    });

    allDarkCurtains.forEach(crtn => {
        crtn.style.height = "0vh"
    });

    document.querySelector("main").classList.add("mpMain");

    console.log(`joinGame GameID: ${gameID}`);
    const request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: window.localStorage.getItem("username"),
            action: "liveGame",
            subAction: "fetchGameInfo",
            gameID: gameID,
            userID: parseInt(window.localStorage.getItem("userID"))
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
        if (document.querySelector("main").classList.contains("mpMain")) {
            console.log(`interval GameID: ${gameID}`);
            const body = {
                username: window.localStorage.getItem("username"),
                action: "liveGame",
                subAction: "fetchGameInfo",
                gameID: gameID,
                userID: parseInt(window.localStorage.getItem("userID"))
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
        } else {
            clearInterval(intervalID);
            window.localStorage.removeItem("gameInfo");
        }

    }, 500)

    window.localStorage.setItem("fetchIntervalID", intervalID)

    return intervalID;
}

async function renderLobby(fetchIntervalID) {

    const main = document.querySelector("main");

    main.innerHTML = `
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>

        <div id="contentWrapper" class="lobbyWrapper">
        
            <div id="lobbyInfo">Waiting for the host to start the game</div>
            <div id="lobbyMemberList"></div>
            <button id="lobbyButton" class="mpButton"></button>

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
                    if (member.inLobby == true) {
                        const memberDiv = document.createElement("div");
                        memberDiv.classList.add("member");

                        memberDiv.innerHTML = `
                            <div class="lobbyProfilePic" style="background-image: url('images/${member.profilePicture}')"></div>
                            <div class="lobbyProfileName">${member.name}</div>
                        `

                        memberListDom.appendChild(memberDiv);
                        if (gameInfo.hostID == member.userID) {
                            memberDiv.querySelector(".lobbyProfilePic").classList.add("leader");
                        }

                    }
                })
            }

            if (gameObject.isStarted === true) {
                clearInterval(intervalID);
                prepareQuestion(0);
            }
        } else {
            clearInterval(intervalID);
        }
    }, 1000)

    if (userID == gameInfo.hostID) {
        const button = main.querySelector("#lobbyButton")
        const lobbyInfo = main.querySelector("#lobbyInfo");
        lobbyInfo.textContent = "Wait for your friends to join"
        button.textContent = "Start Game";
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
        const lobbyInfo = main.querySelector("#lobbyInfo");
        lobbyInfo.textContent = "Wait for the leader to start the game"
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

function prepareQuestion(questionToLoad, skipPointCheck = false) {

    if (!skipPointCheck) {
        const main = document.querySelector("main");

        const allLightCurtains = document.querySelectorAll(".curtainsLightStartingpage");
        const allDarkCurtains = document.querySelectorAll(".curtainsStartingpage");

        const userID = parseInt(JSON.parse(window.localStorage.getItem("userID")));

        const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
        window.localStorage.removeItem("gameInfo");

        gameInfo.currentQuestion = gameInfo.questions[questionToLoad];

        window.localStorage.setItem("gameInfo", gameInfo);

        const gameMembers = gameInfo.members;

        gameMembers.sort((a, b) => b.points - a.points);

        if (questionToLoad != 0) {

            const lastRoundQuestion = gameInfo.questions[questionToLoad - 1];

            allLightCurtains.forEach(crtn => {
                crtn.style.height = "93vh"
            });

            allDarkCurtains.forEach(crtn => {
                crtn.style.height = "91vh"
            });

            main.innerHTML = `
            <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>

                <div id="contentWrapper" class="currentStandingRound">
                
                    <div id="getReadyDiv">GET READY IN <span id="countdown">10</span></div>
            
                    <div id="topThree"></div>
    
                    <div id="personalPoints">
                        <div id="pointsThisRound"></div>
                        <div id="totalPoints"></div>
                    </div>
                </div>
            `

            lastRoundQuestion.pointsFromRound.forEach(user => {
                if (user.userID == userID) {
                    main.querySelector("#pointsThisRound").textContent = "You got " + user.roundPoints + " points from this round";
                }
            })

            gameMembers.forEach(gMember => {
                if (gMember.userID == userID) {
                    main.querySelector("#totalPoints").innerHTML = `Total points: <span id="ttlPoints">${gMember.points}</span>`
                }
            })

            for (let i = 0; i < gameMembers.length; i++) {
                if (i <= 2) {
                    const topThreeDiv = document.createElement("div");
                    topThreeDiv.id = `topThree${i + 1}`;
                    topThreeDiv.classList.add("topThreeDiv")
                    topThreeDiv.innerHTML = `
                        <div class="positionImage" style="background-image: url('images/position${i + 1}.svg')"></div>
                        <div class="playerImage" style="background-image: url('images/${gameMembers[i].profilePicture}')"></div>
                        <div class="currentPoints">${gameMembers[i].points} <span class="opacP">p</span></div>
                    `

                    document.querySelector("#topThree").appendChild(topThreeDiv);
                }
            }

            const intervalID = setInterval(function () {
                const countdown = main.querySelector("#countdown");

                const currentSec = parseInt(countdown.textContent);

                if (currentSec === 0) {
                    clearInterval(intervalID);

                    allLightCurtains.forEach(crtn => {
                        crtn.style.height = "0px"
                    });

                    allDarkCurtains.forEach(crtn => {
                        crtn.style.height = "0px"
                    });

                    nextQuestion(questionToLoad);

                } else {
                    countdown.textContent = currentSec - 1;
                }

            }, 1000)

        }

        if (questionToLoad == 0) {

            main.innerHTML = `
            <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>
                <h1>GET READY</h1>
                <div id="countdown">10</div>
            `

            const intervalID = setInterval(function () {
                if (document.querySelector("main > #countdown")) {
                    const countdown = document.querySelector("main > #countdown")

                    const currentSec = parseInt(countdown.textContent);

                    if (currentSec === 0) {
                        clearInterval(intervalID);
                        nextQuestion(questionToLoad);
                    } else {
                        countdown.textContent = currentSec - 1;
                    }
                } else {
                    clearInterval(intervalID);
                }

            }, 1000)
        }
    }

    if (skipPointCheck) {
        nextQuestion(questionToLoad);
    }


}

function nextQuestion(questionToLoad) {
    const gameObject = JSON.parse(window.localStorage.getItem("gameInfo"));

    const questions = gameObject.questions;

    const currentQuestion = questions[questionToLoad];
    const questionType = currentQuestion.type;

    console.log(currentQuestion);

    switch (questionType) {
        case "directors":
            mpTextQuestion(currentQuestion);
            break;
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
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>

        <div id="contentWrapper" class="cwType${question.type}">

            <div id="timer" data-current-time="30">
                <div id="timerProgress"></div>
            </div>

            <div id="questionContainer" class="qctype${question.type}">
            
                <div id="questionText" class="type${question.type}">${question.questionText}</div>
        
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
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>
    
        <div id="contentWrapper" class="cwType${question.type}">
        
            <div id="timer" data-current-time="30">
                <div id="timerProgress"></div>
            </div>
            <div id="videoContainer">
            
                <iframe src=${question.youtubeLink}?autoplay=1&mute=1&controls=0&disablekb=1&showinfo=0 title="" frameborder="0" controls="0" disablekb="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

                <div id="movieCoverUp"></div>
                <div id="movieCoverDown"></div>

            </div>

            <div id="answerContainer">

                <input id="searchMovie" placeholder="Which movie?">
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
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>
    
        <div id="contentWrapper" class="cwType${question.type}">
        

            <div id="timer" data-current-time="30">
                <div id="timerProgress"></div>
            </div>

            <div id="questionContainer">

                <div id="poster"></div>

            </div>
        
            <div id="answerContainer">
            
                <input id="searchMovie" placeholder="Which movie?">
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

async function mpCheckAnswer(ev, question) {

    console.log(ev.target.dataset.title);

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    const answerTime = document.querySelector("#timer").dataset.currentTime;
    const questType = question.type;

    console.log(questType);
    console.log(gameInfo);

    let answer = ev.target.dataset.title;

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

    if (questType == "actors" || questType == "plot" || questType == "directors") {
        const alternatives = document.querySelectorAll(".alternative");
        alternatives.forEach(alt => {
            if (alt.querySelector(".altTitle").textContent == answer) {
                targetAlt = alt;
            }
        })

        targetAlt.classList.add("selected");

        if (resource.correct == false) {
            createWrong(targetAlt);
        }
    }

    if (questType == "trailer" || questType == "poster") {
        const alternatives = document.querySelectorAll(".alternative");
        alternatives.forEach(alt => {
            if (alt.querySelector(".altTitle").textContent == answer) {
                targetAlt = alt;
            }
        })

        if (resource.correct == false) {
            targetAlt.classList.add("shake");

            setTimeout(() => {
                targetAlt.classList.remove("shake");
            }, 200)
        }

        if (resource.correct == true) {
            document.querySelector("#searchMovie").setAttribute("disabled", "true");
        }
    }

    if (resource.correct == true) {
        targetAlt.classList.add("selected");
        createRight(targetAlt);
    }
}

async function startQuestionTimer(question) {

    console.log(question.questionID + 1);
    const timer = document.querySelector("#timer");
    const timerProgress = document.querySelector("#timerProgress");
    timerProgress.style.transitionDuration = timer.dataset.currentTime + "s"
    setTimeout(() => {
        timerProgress.classList.add("active");
    }, 50)

    const checkQuestionInt = setInterval(() => {
        const gameObject = JSON.parse(window.localStorage.getItem("gameInfo"));

        if (gameObject.endEarly) {
            const timer = document.querySelector("#timer");

            const timerClone = timer.cloneNode();
            timerClone.innerHTML = `
                <div id="timerProgress" class="active"></div>
            `

            timerClone.dataset.currentTime = 0;

            timer.remove();
            document.querySelector("#contentWrapper").prepend(timerClone);

            doneRound();
            clearInterval(checkQuestionInt);
        }
    }, 100)

    timerProgress.addEventListener("transitionend", doneRound)

    async function doneRound(ev) {
        const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));

        const request = new Request("PHP/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "liveGame",
                subAction: "doneQuestion",
                gameID: gameInfo.gameID,
                userID: parseInt(window.localStorage.getItem("userID"))
            })
        })

        await callAPI(request, false, false);

        const intervalID = setInterval(() => {
            const gameObject = JSON.parse(window.localStorage.getItem("gameInfo"));

            if (gameObject.nextQuestion) {
                clearInterval(intervalID);
                endOfQuestion(question);
            }
        }, 100)
    }

    if (timer) {
        const intervalID = setInterval(async function () {

            let currentTimerValue = parseFloat(timer.dataset.currentTime);

            if (currentTimerValue != 0.0) {

                timer.dataset.currentTime = (currentTimerValue - 0.1).toFixed(1);

            } else {
                clearInterval(intervalID);
            }

        }, 100);
    }
}

async function endOfQuestion(question) {

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));

    const rqst = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "liveGame",
            subAction: "endedQuestion",
            gameID: gameInfo.gameID,
            userID: parseInt(window.localStorage.getItem("userID"))
        })
    })

    await callAPI(rqst, false, false);

    const qType = question.type;
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

    if (qType == "plot" || qType == "actors" || qType == "directors") {
        const alternativeDivs = document.querySelectorAll(".alternative");

        alternativeDivs.forEach(alternative => {

            const title = alternative.querySelector(".altTitle")

            if (title.textContent == correctAnswer) {
                createRight(alternative);
            } else {
                createWrong(alternative);
            }

            const whoGuessed = document.createElement("div");
            whoGuessed.classList.add("whoGuessed");

            whoGuessed.innerHTML = `
                <span id="restSpan"></span>
            `

            console.log(whoGuessed);

            let answersInWhoGuessed = 0;

            resource.alternatives.forEach(alt => {
                if (alt.title == title.textContent) {
                    alt.whoGuessed.forEach(player => {

                        if (answersInWhoGuessed >= 2) {
                            const restSpan = whoGuessed.querySelector("#restSpan");
                            if (restSpan.textContent == "") {
                                restSpan.textContent = "+1";
                            } else {
                                const newNumber = parseInt(restSpan.textContent.substring(1)) + 1;
                                restSpan.textContent = "+" + newNumber;
                            }
                        } else {
                            console.log(player);
                            const playerDiv = document.createElement("div");

                            playerDiv.classList.add("playerImg");

                            playerDiv.style.backgroundImage = `url('images/${player.profilePicture}')`;

                            whoGuessed.prepend(playerDiv);

                            answersInWhoGuessed += 1;
                        }
                    })
                }
            })

            alternative.appendChild(whoGuessed);

        })

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

    const gameInfo = JSON.parse(window.localStorage.getItem("gameInfo"));
    const gameMembers = gameInfo.members;
    const questions = gameInfo.questions;

    gameMembers.sort((a, b) => b.points - a.points);

    const main = document.querySelector("main");

    if (question.questionID + 1 == questions.length / 2) {

        allLightCurtains.forEach(crtn => {
            crtn.style.height = "93vh"
        });

        allDarkCurtains.forEach(crtn => {
            crtn.style.height = "91vh"
        });

        main.innerHTML = `
        <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>

            <div id="contentWrapper" class="currentStandingHalf">
            
                <div id="getReadyDiv">GET READY IN <span id="countdown">10</span></div>
        
                <div id="topThree"></div>
        
                <div id="restList"></div>
            
            </div>
        `

        const intervalID = setInterval(function () {
            if (main.querySelector("#countdown")) {
                const countdown = main.querySelector("#countdown");

                const currentSec = parseInt(countdown.textContent);

                if (currentSec === 0) {
                    clearInterval(intervalID);

                    allLightCurtains.forEach(crtn => {
                        crtn.style.height = "0px"
                    });

                    allDarkCurtains.forEach(crtn => {
                        crtn.style.height = "0px"
                    });

                    checkNextQuestion(question, true);

                } else {
                    countdown.textContent = currentSec - 1;
                }
            } else {
                clearInterval(intervalID)
            }


        }, 1000)
    }

    if (question.questionID + 1 == questions.length) {

        allLightCurtains.forEach(crtn => {
            crtn.style.height = "100vh"
            crtn.style.borderRadius = "0";
        });

        allDarkCurtains.forEach(crtn => {
            crtn.style.height = "100vh"
            crtn.style.borderRadius = "0";
        });

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
        <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>
    
            <div id="contentWrapper" class="currentStandingResults">
            
                <h1 id="endScreenHead">RESULTS</h1>
        
                <div id="topThree"></div>
        
                <div id="restList"></div>

                <div id="resultButtons">
                    <button id="exitGameButton" class="mpButton">Exit Game</button>
                    <button id="playAgainButton" class="mpButton">Play Again</button>
                </div>
            
            </div>
        `

        const playAgainButton = document.querySelector("#playAgainButton");

        playAgainButton.addEventListener("click", async function (ev) {

            const allLightCurtains = document.querySelectorAll(".curtainsLightStartingpage");
            const allDarkCurtains = document.querySelectorAll(".curtainsStartingpage");

            allLightCurtains.forEach(crtn => {
                crtn.style.height = "0vh"
                crtn.style.borderRadius = "0 0 30px 30px";
            });

            allDarkCurtains.forEach(crtn => {
                crtn.style.height = "0vh"
                crtn.style.borderRadius = "0 0 30px 30px";
            });

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

        const exitButton = document.querySelector("#exitGameButton");

        exitButton.addEventListener("click", eve => {
            renderStartingpage();
        })
    }

    for (let i = 0; i < gameMembers.length; i++) {
        if (i <= 2) {
            const topThreeDiv = document.createElement("div");
            topThreeDiv.id = `topThree${i + 1}`;
            topThreeDiv.classList.add("topThreeDiv")
            topThreeDiv.innerHTML = `
                <div class="positionImage" style="background-image: url('images/position${i + 1}.svg')"></div>
                <div class="playerImage" style="background-image: url('images/${gameMembers[i].profilePicture}')"></div>
                <div class="currentPoints">${gameMembers[i].points} <span class="opacP">p</span></div>
            `

            document.querySelector("#topThree").appendChild(topThreeDiv);
        }

        if (i >= 3 && gameMembers.length > 3) {
            const restListDiv = document.createElement("div");
            restListDiv.classList.add("restListDiv");

            restListDiv.innerHTML = `
                <div class="restListDivLeft">

                    <div class="positionImage" style="background-image: url('images/position${i + 1}.svg')"></div>
                    <div>${gameMembers[i].name}</div>
                
                </div>

                <div class="currentPoints">${gameMembers[i].points}</div>
            `

            document.querySelector("#restList").appendChild(restListDiv);
        }
    }

    console.log(gameMembers);
}

function checkNextQuestion(question, skipPointCheck) {
    const currentGame = JSON.parse(window.localStorage.getItem("gameInfo"));
    const questionsArray = currentGame.questions;

    const nextIndex = question.questionID + 1;

    if (questionsArray.length - 1 != question.questionID) {
        prepareQuestion(nextIndex, skipPointCheck);
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
        movieDiv.innerHTML = `
            <div class="altTitle">${filteredArray[i]}</div>
        `

        movieDiv.dataset.title = filteredArray[i];
        movieDiv.querySelector(".altTitle").dataset.title = filteredArray[i];

        movieDiv.addEventListener("click", ev => {
            if (document.querySelector("#timer").dataset.currentTime != 0) {
                mpCheckAnswer(ev, question);
            }
        })

        movieResults.appendChild(movieDiv);
    }


}

function createWrong(alternative) {
    if (!alternative.querySelector(".wrongDiv")) {
        const wrongDiv = document.createElement("div");

        wrongDiv.classList.add("wrongDiv");

        alternative.prepend(wrongDiv);
    }
}

function createRight(alternative) {
    if (!alternative.querySelector(".rightDiv")) {
        const rightDiv = document.createElement("div");

        rightDiv.classList.add("rightDiv");

        alternative.prepend(rightDiv);
    }

}