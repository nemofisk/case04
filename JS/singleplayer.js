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
        "Family",
        "Mystery",
        "Animation",
        "Comedy",
        "Horror",
        "Musical",


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

    let quizQuiestions = ["quote", "trailer", "poster", "actors", "plot"]
    
    let questionCategory = quizQuiestions[Math.floor(Math.random()*quizQuiestions.length)];

    console.log(questionCategory);
    switch (questionCategory) {
        case "quote":
            textQuestion(correctMovie, otherMovies, "quotes")
            break;

        case "trailer":
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

    document.getElementById("searchMovie").addEventListener("input", filterString);
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
    document.getElementById("nextQuestion").addEventListener("click", e => {
        clearInterval(intervalID);
        chooseGenre(window.localStorage.getItem("genre"));
    })
}

function textQuestion(correctMovie, otherMovies, type){
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
    let questionText;
    let plotText;

    switch(type){
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
            checkAnswer(correctMovie, e)
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
    </header>
    
    
    <iframe width="900" height="562" src=${correctMovie.youtubeLink}?autoplay=1 title="Yung Lean - Hurt" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <input id="searchMovie"></input>
    
    <div id="displaySearchedMovies"></div>
    <div id="answer">Answer</div>

    <div id="newQuestion">New question</div>
    
    <br>
    `
    document.getElementById("searchMovie").addEventListener("input", filterString);

    document.getElementById("answer").addEventListener("click", movie => {
        checkAnswer(document.querySelector("#searchMovie").value)
    })

    document.getElementById("newQuestion").addEventListener("click", element => {
        chooseGenre(window.localStorage.getItem("genre"))
    })

}