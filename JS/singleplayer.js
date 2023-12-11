function singlePlayer(event) {
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



    document.querySelector("main").innerHTML = `
    <header id="menu">

        <div class="profile">
            <div id="profilePic"></div>
            <p>TheMovieStar</p>
        </div>
    </header>
    

    <h1>Choose a category!</h1>
    <div id="catergoryMenu"></div>
    <div id="mixed">Mixed Categories</div>
    <div id="Continue">Continue</div>
        

    </div>`
    let genresCategorty = document.querySelector("#catergoryMenu");

    for (let i = 0; i < genreArray.length; i++) {
        let div = document.createElement("div");
        div.classList.add("genreClass")
        div.textContent = genreArray[i];
        genresCategorty.appendChild(div)
        div.addEventListener("click", selected => {
            div.classList.add(".selected")
        })
    }
    document.querySelector("#Continue").addEventListener("click", send => {
        chooseGenre(document.querySelectorAll("selected"))
    })
}


function chooseGenre(array) {
    console.log(array);
    let chosenGenre;
    if (window.localStorage.getItem("genre")) {
        chosenGenre = window.localStorage.getItem("genre")
    } else {
        chosenGenre = event.target.textContent;
    }
    window.localStorage.setItem("genre", chosenGenre);

    document.querySelector("main").innerHTML = `
    <header id="menu">

    <div class="profile">
        <div id="profilePic"></div>
        <p>TheMovieStar</p>
    </div>
    
    </header>
    `
    fetch("../DATA/movies.json").then(r => r.json()).then(resource => {
        let movieGenerArray = []
        for (let i = 0; i < resource.length; i++) {

            if (resource[i].Genre !== undefined) {
                if (resource[i].Genre.includes(chosenGenre)) {

                    movieGenerArray.push(resource[i])
                }
            }
        }

        let otherMovies = []
        let correctMovie = movieGenerArray[Math.floor(Math.random() * movieGenerArray.length)];
        window.localStorage.setItem("movie", correctMovie.Title)
        let i = 0;
        while (i < 4) {
            let movie = movieGenerArray[Math.floor(Math.random() * movieGenerArray.length)];
            if (movie !== correctMovie && movie !== undefined) {
                otherMovies.push(movie)
                i++
            }
        }
        startGame(correctMovie, otherMovies)
    })
}

function startGame(correctMovie, otherMovies) {
    console.log(correctMovie, otherMovies);

    let quizQuiestions = ["quotes", "trailers", "poster", "actors", "plot"]

    let questionCategory = quizQuiestions[Math.floor(Math.random() * quizQuiestions.length)];

    console.log(questionCategory);
    switch (questionCategory) {
        case "quotes":
            textQuestion(correctMovie, otherMovies, "quotes")
            break;

        case "trailers":
            trailerQuestion(correctMovie, otherMovies)
            break;

        case "poster":
            posterQuestion(correctMovie, otherMovies)
            break;

        case "actors":
            textQuestion(correctMovie, otherMovies, "actors")
            break;

        case "plot":
            textQuestion(correctMovie, otherMovies, "plot")
            break;
    }
}



function posterQuestion(correctMovie, otherMovies) {
    console.log(correctMovie.Poster);
    document.querySelector("main").innerHTML = `
    <header id="menu">
    
    <div id="PosterContainer">
        <div id="question">Guess the movie</div>
        <div id="moviePoster">
            <img src="${correctMovie.Poster}" alt="">
        </div>

        <input id="searchMovie"></input>
        <div id="displaySearchedMovies"></div>
        <button id="guessingButton">Guess</button>
        <button id="nextQuestion">Next</button>
        <button id="clue">Get Clue</button>
        <button id="resetTimer">Reset Timer</button>
    </div>
    `
    
    
    document.getElementById("clue").addEventListener("click", func => {
        getClue(correctMovie)
    })
    
    function changeBlur(blur) {
        let moviePoster = document.getElementById("moviePoster");
        moviePoster.style.filter = `blur(${blur}px)`;
    }
    let blurValue = 20;

    const intervalID = setInterval(function () {
        changeBlur(blurValue);
        blurValue = blurValue - 1;

        if (blurValue < 0) {
            clearInterval(intervalID);
            console.log("L");
        }
    }, 1000);
    document.getElementById("resetTimer").addEventListener("click", func => {
        blurValue = 20;
    })

    document.getElementById("searchMovie").addEventListener("input", filterString);
    let inputGuess = document.getElementById("searchMovie");
    let guessingButton = document.getElementById("guessingButton");
    guessingButton.addEventListener("click", e => {

        let moviePoster = document.getElementById("moviePoster");
        moviePoster.style.filter = `blur(0px)`;
        clearInterval(intervalID);
        if (inputGuess.value === correctMovie.Title) {

            let request = new Request("../PHP/api.php", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ username: window.localStorage.getItem("username"), guess: "correct", action: "profile", subAction: "quizGuess", points: 25 })
            })
            callAPI(request);
        } else {
            console.log("wrong");
            guess = false;
        }
    })
    document.getElementById("nextQuestion").addEventListener("click", e => {
        clearInterval(intervalID);
        chooseGenre(window.localStorage.getItem("genre"));
    })
}

function textQuestion(correctMovie, otherMovies, type) {
    document.querySelector("main").innerHTML = `
    <header id="menu">

    <div class="profile">
        <div id="profilePic"></div>
        <p>TheMovieStar</p>
    </div>
    </header>

    <div id="timer">Time left: </div>
    <div id="question"></div>
    <div id="plotText"></div>
    <div id="questions"></div>
    <button id="nextQuestion">Next</button>
    <button id="clue">Get Clue</button>
    <button id="resetTimer">Reset Timer</button>
    <br>
    `
    let startTimer = 20;

    const intervalID = setInterval(function () {
        startTimer = startTimer - 1;
        document.getElementById("timer").textContent = "Time left: " + startTimer;

        if (startTimer < 0) {
            clearInterval(intervalID);
            console.log("L");
        }
    }, 1000);
    document.getElementById("resetTimer").addEventListener("click", func => {
        startTimer = 20;
        
    })
    
    document.getElementById("clue").addEventListener("click", func => {
        getClue(correctMovie)
    })
    document.getElementById("nextQuestion").addEventListener("click", e => {
        chooseGenre(window.localStorage.getItem("genre"));
    })

    let questionText;
    let plotText;

    switch (type) {
        case "quotes":
            questionText = "What movie is this quote from?";
            plotText = correctMovie.Title;
            break;
        case "actors":
            questionText = "What movie has these actors in it?";
            plotText = correctMovie.Actors;
            break;
        case "plot":
            questionText = "What movie does this plot describe?";
            plotText = correctMovie.Plot;
            break;
    }

    let quiestionDiv = document.getElementById("question");
    quiestionDiv.textContent = questionText;
    document.getElementById("plotText").textContent = plotText;

    let div = document.createElement("div")
    let divApped = document.getElementById("questions");

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

    moveisArray.forEach(movie => {
        let div = document.createElement("div")
        let divApped = document.getElementById("questions");
        div.textContent = movie;
        divApped.appendChild(div)
        div.addEventListener("click", e => {
            checkAnswer(e)
        })
    });
}

function checkAnswer(event) {
    let guess;

    let movie;
    if (event.target === undefined) {
        movie = event;
    }
    else {
        movie = event.target.textContent
    }
    if (movie === window.localStorage.getItem("movie")) {
        console.log("Correct");

        let request = new Request("../PHP/api.php", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username: window.localStorage.getItem("username"), guess: "correct", action: "profile", subAction: "quizGuess", points: 25 })
        })
        callAPI(request);
    } else {
        console.log("wrong");
        guess = false;
    }
}

function trailerQuestion(correctMovie) {
    document.querySelector("main").innerHTML = `
    <header id="menu">
    
    <div class="profile">
    <div id="profilePic"></div>
    <p>TheMovieStar</p>
    </div>
    <div id="back">Go to home page!</div>
    </header>
    
    <div id="timer">Time left: </div>
    <iframe width="900" height="562" src=${correctMovie.youtubeLink}?autoplay=1 title="Yung Lean - Hurt" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <input id="searchMovie"></input>
    
    <div id="displaySearchedMovies"></div>
    <div id="answer">Answer</div>

    <div id="newQuestion">New question</div>
    <button id="clue">Get Clue</button>
    <button id="resetTimer">Reset Timer</button>
    
    <br>
    `
    let startTimer = 20;

    const intervalID = setInterval(function () {
        startTimer = startTimer - 1;
        document.getElementById("timer").textContent = "Time left: " + startTimer;

        if (startTimer < 0) {
            clearInterval(intervalID);
            console.log("L");
        }
    }, 1000);
    
    document.getElementById("clue").addEventListener("click", func => {
        getClue(correctMovie)
    })
    document.getElementById("resetTimer").addEventListener("click", func => {
        startTimer = 20;
        
    })
    
    document.getElementById("searchMovie").addEventListener("input", filterString);

    document.getElementById("answer").addEventListener("click", movie => {
        checkAnswer(document.querySelector("#searchMovie").value)
    })

    document.getElementById("newQuestion").addEventListener("click", element => {
        chooseGenre(window.localStorage.getItem("genre"))
    })
    document.getElementById("back").addEventListener("click", goToHomePage)

}

function goToHomePage(event) {
    RenderStartingpage()
}

function getClue(movie){

    let request = new Request("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "useClue" })
    })
    callAPI(request);
    
    let div = document.createElement("div")
    div.textContent = `This movie was directed by ${movie.Director} and is starring ${movie.Actors} `
    document.querySelector("main").appendChild(div);

}

