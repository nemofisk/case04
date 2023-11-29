function singlePlayer(event){
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

for(let i = 0;i < genreArray.length;i++){
    let div = document.createElement("div");
    div.textContent = genreArray[i];
    genresCategorty.appendChild(div)
    div.addEventListener("click", chooseGenre)
}
}

function chooseGenre(event){
    let chosenGenre;
    if(window.localStorage.getItem("genre")){
        chosenGenre = window.localStorage.getItem("genre")
    }else{
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
            
            if(resource[i].Genre !== undefined){
                if(resource[i].Genre.includes(chosenGenre)){
                    
                    movieGenerArray.push(resource[i])
                }
            }  
        }
           
        let otherMovies = []
        let correctMovie = movieGenerArray[Math.floor(Math.random()*movieGenerArray.length)];
        window.localStorage.setItem("movie", correctMovie.Title)
        let i = 0;
        while(i < 4){
            let movie = movieGenerArray[Math.floor(Math.random()*movieGenerArray.length)];  
            if(movie !== correctMovie && movie !== undefined){
                otherMovies.push(movie)
                i++
            }
        }
        startGame(correctMovie, otherMovies)
    })    
}
  
function startGame(correctMovie, otherMovies){
    console.log(correctMovie,otherMovies);

    let quizQuiestions = ["quotes", "trailers", "poster", "actors", "plot"]
    trailerQuestion(correctMovie)

    /*let questionCategory = quizQuiestions[Math.floor(Math.random()*quizQuiestions.length)];

    console.log(questionCategory);
    switch (questionCategory) {
        case "quotes":
            quotesQuiestion(correctMovie, otherMovies)
            break;

        case "trailers":
            trailerQuestion(correctMovie)
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

function plotQuestion(correctMovie, otherMovies){
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
    
    for(let i = 0; i < otherMovies.length; i++){
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

function checkAnswer(event){
    let guess;

    let movie;
    if(event.target === undefined){
        movie = event;
    }
    else{
        movie = event.target.textContent
    }
    if(movie === window.localStorage.getItem("movie")){
        let request = new Request("../PHP/api.php", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username: window.localStorage.getItem("username"), guess: "correct", action: "profile", subAction: "quizGuess", points: 25})
        })
        callAPI(request);
    }else{
        console.log("wrong");
        guess = false;
    }
}

function trailerQuestion(correctMovie){
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