function singlePlayer(event){
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

for(let i = 0;i < genreArray.length;i++){
    let div = document.createElement("div");
    div.textContent = genreArray[i];
    genresCategorty.appendChild(div)
    div.addEventListener("click", chooseGenre)
}
}

function chooseGenre(event){
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
            
            if(resource[i].Genre !== undefined){
                if(resource[i].Genre.includes(chosenGenre)){
                    
                    movieGenerArray.push(resource[i])
                }
            }  
        }
           
        let otherMovies = []
        let correctMovie = movieGenerArray[Math.floor(Math.random()*movieGenerArray.length)];
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

    let quizQuiestions = ["quote", "trailer", "poster", "actors", "plot"]
    textQuestion(correctMovie, otherMovies)

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
        div.addEventListener("click", e => {
            checkAnswer(correctMovie, e)
        })
    });
}

function checkAnswer(correctMovie, event){
    let guess;

    if(event.target.textContent === correctMovie.Title){
        console.log("sucess!");
        guess = true;
    }else{
        console.log("wrong");
        guess = false;
    }
}