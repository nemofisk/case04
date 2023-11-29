function singlePlayer(event) {
    genreArray = [
        "Crime",
        "Drama",
        "Biography",
        "History",
        "Action",
        "Romance",
        "War",
        "Adventure",
        "Fantasy",
        "Sci-Fi",
        "Thriller",
        "Family",
        "Mystery",
        "Animation",
        "Comedy",
        "Horror",
        "Musical",
        "Music",
        "Western",

    ];



    document.querySelector("main").innerHTML = `
    <header id="menu">

        <div class="profile">
            <div id="profilePic"></div>
            <p>TheMovieStar</p>
        </div>
    </header>
    

    <div>Choose a category!</div>
    <div id="catergoryMenu"></div>
    <div> i dont want to choose a category</div>
        

    </div>`
    let genresCategorty = document.querySelector("#catergoryMenu");

    for (let i = 0; i < genreArray.length; i++) {
        let div = document.createElement("div");
        div.textContent = genreArray[i];
        genresCategorty.appendChild(div)
        div.addEventListener("click", chooseGenre)
    }
}

function chooseGenre(event) {
    let chosenGenre = event.target.textContent;

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
    //plotQuestion(correctMovie, otherMovies)
    posterQuestion(correctMovie, otherMovies);

    /*let questionCategory = quizQuiestions[Math.floor(Math.random()*quizQuiestions.length)];

    console.log(questionCategory);
    switch (questionCategory) {
        case "quotes":
            quotesQuiestion(correctMovie, otherMovies)
            break;

        case "trailers":
            trailerQuestion(correctMovie, otherMovies)
            break;
        
        case "poster":
            posterQuestion(correctMovie, otherMovies)
            break;

        case "actors":
            actorsQuestion(correctMovie, otherMovies)
            break;
        case "plot":
            plotQuestion(correctMovie, otherMovies)
            break;
    }    
    */
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
        <button id="guessingButton"></button>
    </div>
    `
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
        }
    }, 1000);

    let inputGuess = document.getElementById("searchMovie");
    let guessingButton = document.getElementById("guessingButton");
    guessingButton.addEventListener("click", e => {
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



    document.getElementById("searchMovie").addEventListener("input", filterString);
}



function plotQuestion(correctMovie, otherMovies) {
    document.querySelector("main").innerHTML = `
    <header id="menu">

    <div class="profile">
        <div id="profilePic"></div>
        <p>TheMovieStar</p>
    </div>
    </header>

    <div id="question"></div>
    <div id="plotText"></div>
    <div id="questions"></div>
    <br>
    `
    let quiestionDiv = document.getElementById("question");
    quiestionDiv.textContent = "What movie does this plot descirbe?"
    document.getElementById("plotText").textContent = correctMovie.Plot;

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
        div.addEventListener("click", checkAnswer)
    });
}

function checkAnswer(event) {
    let guess;
    if (event.target.textContent === window.localStorage.getItem("movie")) {
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