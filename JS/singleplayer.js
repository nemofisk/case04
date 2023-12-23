function singlePlayer(event) {
    const allLightCurtains = document.querySelectorAll(".curtainsLightStartingpage");
    const allDarkCurtains = document.querySelectorAll(".curtainsStartingpage");
    allLightCurtains.forEach(crtn => {
        crtn.style.height = "0vh"
    });

    allDarkCurtains.forEach(crtn => {
        crtn.style.height = "0vh"
    });

    genreArray = [
        "Crime",
        "Drama",
        "History",
        "Action",
        "Romance",
        "Adventure",
        "Fantasy",
        "Sci-Fi",
        "Thriller",
        "Animation",
        "Comedy",
        "Horror",
    ];


    document.querySelector("footer").innerHTML = ``

    document.querySelector("main").innerHTML = `
        <h1>Choose a category!</h1>
        <div id="catergoryMenu"></div>
        <div id="mixed">Mixed Categories</div>
        <div id="Continue">Continue</div>
    `

    document.querySelector("main").dataset.totalPoints = 0;

    let genresCategorty = document.querySelector("#catergoryMenu");

    for (let i = 0; i < genreArray.length; i++) {
        let div = document.createElement("div");
        div.classList.add("genreClass")
        div.textContent = genreArray[i];
        genresCategorty.appendChild(div)
        div.addEventListener("click", () => {
            if (document.getElementById("mixed").classList.contains("mixedMark")) {
                document.getElementById("mixed").classList.remove("selected");
                document.getElementById("mixed").style.backgroundColor = "";
                document.querySelectorAll("#catergoryMenu > div").forEach(div => {
                    div.classList.remove("selected")
                })
            }
            div.classList.toggle("selected");
            div.style.backgroundColor = "rgb(129, 132, 248)"
            document.querySelector("#Continue").style.backgroundColor = "#FFF8BA"
            document.querySelector("#Continue").style.color = "#323059"
        });
    }
    document.getElementById("mixed").addEventListener("click", () => {
        if (document.getElementById("mixed").classList.contains("mixedMark")) {
            document.querySelectorAll("#catergoryMenu > div").forEach(div => {
                div.classList.remove("selected");
                div.style.backgroundColor = "";
                document.getElementById("mixed").classList.remove("mixedMark")
                document.getElementById("mixed").style.backgroundColor = "#171717";
                document.querySelector("#Continue").style.backgroundColor = "#171717"
                document.querySelector("#Continue").style.color = "#747474";
                div.style.pointerEvents = "auto";

            })
        } else {

            document.querySelectorAll("#catergoryMenu > div").forEach(div => {
                div.classList.add("selected");
                div.style.backgroundColor = "#171717";
                //div.style.pointerEvents = "none";

            })
            document.getElementById("mixed").classList.add("mixedMark")
            document.getElementById("mixed").style.backgroundColor = "#8184F8"
            document.querySelector("#Continue").style.backgroundColor = "#FFF8BA"
            document.querySelector("#Continue").style.color = "#323059";
        }


    })

    document.getElementById("Continue").addEventListener("click", () => {
        if (document.getElementById("Continue").style.backgroundColor === "rgb(255, 248, 186)") {
            const selectedGenres = Array.from(document.querySelectorAll(".genreClass.selected")).map((div) => div.textContent);
            generateMovies(selectedGenres);
        }

    })
}

function generateMovies(array, questionNumber = 1, answerTime) {

    console.log("Generate Movies " + questionNumber);

    let chosenGenres = array;


    fetch("../DATA/movies.json").then(r => r.json()).then(resource => {
        let movieGenerArray = []
        for (let i = 0; i < resource.length; i++) {

            if (resource[i].Genre !== undefined) {
                chosenGenres.forEach(genre => {
                    if (resource[i].Genre.includes(genre)) {
                        movieGenerArray.push(resource[i])
                    }
                })
            }
        }

        console.log(movieGenerArray);
        let otherMovies = []
        let correctMovie = movieGenerArray[Math.floor(Math.random() * movieGenerArray.length)];

        let i = 0;
        while (i < 3) {
            let movie = movieGenerArray[Math.floor(Math.random() * movieGenerArray.length)];
            if (movie !== correctMovie && movie !== undefined) {
                otherMovies.push(movie)
                i++
            }
        }

        SPprepareQuestion(correctMovie, otherMovies, array, questionNumber, answerTime)
    })
}

function SPprepareQuestion(correctMovie, otherMovies, genres, questionNumber, answerTime) {
    const main = document.querySelector("main");


    if (questionNumber != 1) {

        const allLightCurtains = document.querySelectorAll(".curtainsLightStartingpage");
        const allDarkCurtains = document.querySelectorAll(".curtainsStartingpage");
        allLightCurtains.forEach(crtn => {
            crtn.style.height = "93vh"
        });

        allDarkCurtains.forEach(crtn => {
            crtn.style.height = "91vh"
        });

        main.innerHTML = `
                <div id="contentWrapper" class="currentStandingRoundSP">
                
                    <div id="getReadyDivSP">GET READY IN <br><span id="countdownSP">10</span></div>
    
                    <div id="pointsThisRoundSP">You got ${answerTime} points from this round</div>
                    <div id="totalPointsSP">Total points: <span id="ttlPoints">${main.dataset.totalPoints}</span></div>
                </div>
            `
        const intervalID = setInterval(function () {
            const countdown = main.querySelector("#countdownSP");

            const currentSec = parseInt(countdown.textContent);

            if (currentSec === 0) {
                clearInterval(intervalID);

                allLightCurtains.forEach(crtn => {
                    crtn.style.height = "0px"
                });

                allDarkCurtains.forEach(crtn => {
                    crtn.style.height = "0px"
                });

                startQuestion(correctMovie, otherMovies, genres, questionNumber);

            } else {
                countdown.textContent = currentSec - 1;
            }

        }, 1000)
    }

    if (questionNumber == 1) {

        main.innerHTML = `
            <h1>GET READY</h1>
            <div id="countdown">10</div>
        `

        const intervalID = setInterval(function () {
            if (document.querySelector("main > #countdown")) {
                const countdown = document.querySelector("main > #countdown")

                const currentSec = parseInt(countdown.textContent);

                if (currentSec === 0) {
                    clearInterval(intervalID);
                    startQuestion(correctMovie, otherMovies, genres, questionNumber)
                } else {
                    countdown.textContent = currentSec - 1;
                }
            } else {
                clearInterval(intervalID);
            }

        }, 1000)
    }
}

function startQuestion(correctMovie, otherMovies, genres, questionNumber) {
    console.log(correctMovie, otherMovies);

    let quizQuiestions = ["directors", "poster", "actors", "plot", "trailer"]

    let questionCategory = quizQuiestions[Math.floor(Math.random() * quizQuiestions.length)];

    console.log(questionCategory);
    switch (questionCategory) {
        case "directors":
            textQuestion(correctMovie, otherMovies, "directors", genres, questionNumber)
            break;

        case "trailer":
            trailerQuestion(correctMovie, otherMovies, "trailer", genres, questionNumber)
            break;

        case "poster":
            posterQuestion(correctMovie, otherMovies, "poster", genres, questionNumber)
            break;

        case "actors":
            textQuestion(correctMovie, otherMovies, "actors", genres, questionNumber)
            break;

        case "plot":
            textQuestion(correctMovie, otherMovies, "plot", genres, questionNumber)
            break;
    }
}

async function textQuestion(correctMovie, otherMovies, type, genres, questionNumber) {
    let questionText;

    switch (type) {
        case "directors":
            questionText = "Which movie has " + correctMovie.Director + " directed?";
            break;
        case "actors":
            questionText = "Which movie does " + correctMovie.Actors + " star in?";
            break;
        case "plot":
            questionText = correctMovie.Plot;
            break;
    }

    const main = document.querySelector("main");

    main.innerHTML = `

        <div id="contentWrapper" class="cwType${type}">

            <div id="timer" data-current-time="10">
                <div id="timerProgress"></div>
            </div>

            <div id="questionContainer" class="qctype${type}">
            
                <div id="questionText" class="type${type}">${questionText}</div>
        
            </div>
            <div id="alternatives"></div>
        </div>

    `

    SPstartQuestionTimer(genres, questionNumber);

    // document.getElementById("clue").addEventListener("click", func => {
    //     getClue(correctMovie)
    // })

    main.querySelector("#timer").dataset.answerTime = 0;

    let moveisArray = []
    moveisArray.push(correctMovie.Title)

    for (let i = 0; i < otherMovies.length; i++) {
        moveisArray.push(otherMovies[i].Title)
    }

    function shuffleArray(array) {
        array.sort(() => Math.random() - 0.5);
    }

    shuffleArray(moveisArray);
    console.log(moveisArray);

    moveisArray.forEach(alternative => {
        const altDiv = main.querySelector("#alternatives");

        const alt = document.createElement("div");
        alt.classList.add("alternative");

        alt.dataset.title = alternative;
        console.log(alternative);

        alt.innerHTML = `
            <div class="altTitle">${alternative}</div>
        `

        alt.querySelector(".altTitle").dataset.title = alternative;
        altDiv.append(alt);


    })

    const allAlts = document.querySelectorAll(".alternative")

    function altEvent(event) {
        const allAlternatives = document.querySelectorAll(".alternative")

        console.log(allAlternatives);

        allAlternatives.forEach(altern => {
            altern.removeEventListener("click", altEvent)
        })

        const timerDiv = document.querySelector("#timer")

        let targetAlt

        answer = event.target.dataset.title;

        const alternatives = document.querySelectorAll(".alternative");
        alternatives.forEach(alt => {
            if (alt.querySelector(".altTitle").textContent == answer) {
                targetAlt = alt;
            }
        })

        targetAlt.classList.add("selected");

        const correct = checkAnswer(event.target.dataset.title, correctMovie);

        const timerProgress = main.querySelector("#timerProgress");

        if (correct) {
            targetAlt.querySelector(".altTitle").classList.add("correct")
            const answerTime = parseFloat(timerDiv.dataset.currentTime);
            timerDiv.dataset.answerTime = answerTime
            const currTotalPoints = parseFloat(document.querySelector("main").dataset.totalPoints);
            document.querySelector("main").dataset.totalPoints = currTotalPoints + answerTime;
        }

        if (!correct) {
            targetAlt.querySelector(".altTitle").classList.add("wrong")
        }
    }

    allAlts.forEach(al => {
        al.addEventListener("click", altEvent);
    })
}

function posterQuestion(correctMovie, otherMovies, type, genres, questionNumber) {
    const main = document.querySelector("main");

    main.innerHTML = `
    
        <div id="contentWrapper" class="cwType${type}">
        

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

    main.querySelector("#timer").dataset.answerTime = 0;

    console.log(correctMovie);

    const posterDiv = document.querySelector("#poster");

    posterDiv.style.backgroundImage = `url('${correctMovie.Poster}')`;

    setTimeout(() => {
        posterDiv.classList.add("blur")
    }, 100)

    SPstartQuestionTimer(genres, questionNumber);

    document.getElementById("searchMovie").addEventListener("input", SPfindMovie);

}

function trailerQuestion(correctMovie, otherMovies, type, genres, questionNumber) {
    const main = document.querySelector("main");

    main.innerHTML = `
    
        <div id="contentWrapper" class="cwType${type}">
        
            <div id="timer" data-current-time="30">
                <div id="timerProgress"></div>
            </div>
            <div id="videoContainer">
            
                <iframe src=${correctMovie.youtubeLink}?autoplay=1&mute=1&controls=0&disablekb=1&showinfo=0 title="" frameborder="0" controls="0" disablekb="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

                <div id="movieCoverUp"></div>
                <div id="movieCoverDown"></div>

            </div>

            <div id="answerContainer">

                <input id="searchMovie" placeholder="Which movie?">
                <div id="foundMovies"></div>

            </div>

        </div>

    `

    main.querySelector("#timer").dataset.answerTime = 0;

    SPstartQuestionTimer(genres, questionNumber);

    const searchMovie = document.querySelector("#searchMovie");
    searchMovie.addEventListener("input", ev => {
        SPfindMovie(ev, correctMovie)
    })
}

function checkAnswer(event, correctMovie) {
    let correct;

    let movie;
    if (event.target === undefined) {
        movie = event;
    }
    else {
        movie = event.target.textContent
    }
    if (movie === correctMovie.Title) {
        console.log("Correct");

        let request = new Request("PHP/api.php", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username: window.localStorage.getItem("username"), guess: "correct", action: "profile", subAction: "quizGuess", points: 25 })
        })
        callAPI(request);

        correct = true;
    } else {
        console.log("wrong");
        correct = false;
    }

    return correct;
}

function goToHomePage(event) {
    RenderStartingpage()
}

function getClue(movie) {

    let request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "useClue" })
    })
    callAPI(request);

    let div = document.createElement("div")
    div.textContent = `This movie was directed by ${movie.Director} and is starring ${movie.Actors} `
    document.querySelector("main").appendChild(div);

}

function SPendQuiz() {
    const main = document.querySelector("main");
    const userImage = window.localStorage.getItem("userImage");
    const totalPointes = parseFloat(main.dataset.totalPoints).toFixed(1)
    main.innerHTML = `
        <div id="currentStandEndSP">
            <div id="endGameSPHead">FINAL RESULTS</div>
            <div id="endGameSPImage" style="background-image: url('images/${userImage}')"></div>

            <div id="endGameSPPointsDiv">
                <div id="endGameTotalPointsText">Total points: <br><span id="endGameTtlPoints">${totalPointes}</span></div>
            </div>

            <div id="endGameSPButtons">
                <button id="exitGameSP">Exit Game</button>
                <button id="playAgainSP">Play Again</button>

            </div>
        </div>
    `

    const allLightCurtains = document.querySelectorAll(".curtainsLightStartingpage");
    const allDarkCurtains = document.querySelectorAll(".curtainsStartingpage");
    allLightCurtains.forEach(crtn => {
        crtn.style.height = "93vh"
    });

    allDarkCurtains.forEach(crtn => {
        crtn.style.height = "91vh"
    });

    main.querySelector("#playAgainSP").addEventListener("click", ev => {
        singlePlayer();
    })

    main.querySelector("#exitGameSP").addEventListener("click", ev => {
        renderStartingpage();
    })
}

async function SPstartQuestionTimer(genres, questionNumber) {

    const timer = document.querySelector("#timer");
    const timerProgress = document.querySelector("#timerProgress");
    timerProgress.style.transitionDuration = timer.dataset.currentTime + "s"

    setTimeout(() => {
        timerProgress.classList.add("active");
    }, 50)

    timerProgress.addEventListener('transitionend', ev => {
        const answerTime = timer.dataset.answerTime;

        console.log("Inside eventlistener");
        console.log(questionNumber);


        if (questionNumber == 4) {
            SPendQuiz(genres);
        }

        if (questionNumber < 4) {
            console.log("Questionnumber < 10");
            generateMovies(genres, questionNumber + 1, answerTime);
        }
    })

    if (timer) {
        const intervalID = setInterval(() => {

            let currentTimerValue = parseFloat(timer.dataset.currentTime);

            if (currentTimerValue != 0.0) {

                timer.dataset.currentTime = (currentTimerValue - 0.1).toFixed(1);

            } else {
                clearInterval(intervalID);
            }

        }, 100);
    }
}

async function SPfindMovie(event, correctMovie) {
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
            const correct = checkAnswer(ev.target.dataset.title, correctMovie);

            const alternatives = document.querySelectorAll(".alternative");
            alternatives.forEach(alt => {
                if (alt.querySelector(".altTitle").textContent == ev.target.dataset.title) {
                    targetAlt = alt;
                }
            })

            if (!correct) {
                targetAlt.classList.add("shake");

                setTimeout(() => {
                    targetAlt.classList.remove("shake");
                }, 200)
            }

            if (correct) {
                const answerTime = parseFloat(timerDiv.dataset.currentTime).toFixed(1);
                timerDiv.dataset.answerTime = answerTime
                const totalesPoints = parseFloat(document.querySelector("main").dataset.totalPoints).toFixed(1)
                document.querySelector("main").dataset.totalPoints = totalesPoints + answerTime;

                document.querySelector("#searchMovie").setAttribute("disabled", "true");
                targetAlt.classList.add("selected");
                targetAlt.querySelector(".altTitle").classList.add("correct")
                alternatives.forEach(altern => {
                    altern.style.pointerEvents = "none";
                })
            }
        })

        movieResults.appendChild(movieDiv);
    }


}


