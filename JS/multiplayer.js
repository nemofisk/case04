function chooseCatagoryMultiplayer(event) {
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
            <img src="/Frame 263.png" alt="Logo">
        </div>
    </header>
    

    <h1>Choose a category!</h1>
    <div id="catergoryMenu"></div>
    <button id="Mixed">Mixed Catagories</button>
    <button id="Continue">Continue</button>
        

    </div>`
    document.querySelector("footer").innerHTML = ``;
    let genresCategorty = document.querySelector("#catergoryMenu");
    let ContinueButton = document.getElementById("Continue");
    ContinueButton.disabled = true;


    for (let i = 0; i < genreArray.length; i++) {
        let div = document.createElement("div");
        div.classList.add("SelectedCatagorys");
        div.textContent = genreArray[i];
        genresCategorty.appendChild(div)
        div.addEventListener("click", chooseGenre)
    }

    document.getElementById("Mixed").addEventListener("click", mixedCatagories);

    let SelectedGarnres;
    function mixedCatagories(event) {
        let ContinueButton = document.getElementById("Continue");
        let MixedCatagoryButton = document.getElementById("Mixed");
        MixedCatagoryButton.classList.toggle("MixedChosen");
        let disabledCatagorys = document.querySelectorAll(".SelectedCatagorys");

        if (MixedCatagoryButton.classList.contains("MixedChosen")) {
            ContinueButton.style.backgroundColor = "#FFF8BA";
            ContinueButton.style.color = "#323059";
            MixedCatagoryButton.style.backgroundColor = "#8184F8";
            ContinueButton.disabled = false;
            disabledCatagorys.forEach(catagory => {
                if (catagory.classList.contains("SelectedGanras")) {
                    catagory.classList.remove("SelectedGanras");
                }
                catagory.removeEventListener("click", chooseGenre);
            })

            SelectedGarnres = [
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
            ]
        } else {
            MixedCatagoryButton.style.backgroundColor = "#171717";
            ContinueButton.style.backgroundColor = "#171717";
            ContinueButton.style.color = "white";
            ContinueButton.disabled = true;
            SelectedGarnres = [];
            disabledCatagorys.forEach(catagory => {
                catagory.addEventListener("click", chooseGenre);
            })
        }

    }

    ContinueButton.addEventListener("click", async function () {


        const request = new Request("../PHP/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID: window.localStorage.getItem("userID"),
                username: window.localStorage.getItem("username"),
                action: "multiplayer",
                subAction: "createGameObject",
                genres: SelectedGarnres
            })
        })

        const response = await callAPI(request, true, false);
        const resource = await response.json();

        const gameID = await resource.gameID;

        ContinueFunction(gameID);
    });

    function chooseGenre(event) {
        let ContinueButton = document.getElementById("Continue");
        event.target.classList.toggle("SelectedGanras")
        let enabledCatagorys = document.querySelectorAll(".SelectedGanras");

        if (enabledCatagorys.length > 0) {
            ContinueButton.disabled = false;
            ContinueButton.style.backgroundColor = "#FFF8BA";
            ContinueButton.style.color = "#323059";
        } else {
            ContinueButton.disabled = true;
            ContinueButton.style.backgroundColor = "#171717";
            ContinueButton.style.color = "white";
        }
        let genres = []
        enabledCatagorys.forEach(category => {
            genres.push(category.textContent);
        })
        SelectedGarnres = genres;
        ContinueButton.addEventListener("click", event => {
            ContinueFunction(SelectedGarnres);
        });
    }

    function ContinueFunction(gameID) {
        inviteFriends(gameID);
    }
}

async function inviteFriends(gameID) {
    const userID = parseInt(window.localStorage.getItem("userID"));
    const username = window.localStorage.getItem("username")

    document.querySelector("main").innerHTML = `
    <div id="inviteFriendsWrapper">
        <h1 id="inviteFriendsHeader">Bjud in dina vänner</h1>
        <input id="userSearch"></input>
        <div id="displayFriends"></div>
        <button id="inviteUser">Invite User!</button>
        <button id="inviteJoinButton"></button>
    </div>
    `

    // const request = new Request(`../PHP/api.php?action=multiplayer&subAction=fetchFriends&userID=${userID}&username=${username}`);

    // const response = await callAPI(request, true, false);
    // const resource = await response.json();

    // const friendsArray = await resource;

    // const fakeInput = document.querySelector("#startSearch");

    // fakeInput.addEventListener("click", ev => {
    //     const operation = document.querySelector("#operation");
    //     operation.classList.add("popout");
    // })

    document.querySelector("#inviteJoinButton").addEventListener("click", ev => {
        joinGame(gameID)
    })

    document.getElementById("inviteUser").addEventListener("click", e => {


        let inviteUser = document.querySelector("input").value;
        let hostUsername = window.localStorage.getItem("username");

        fetch("../PHP/api.php", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username: hostUsername, invitedUser: inviteUser, action: "multiplayer", gameID: gameID, subAction: "inviteToGame" })
        }).then(r => r.json()).then(resource => {
            console.log(resource);
        });

    })

}

async function findUsers(event, question) {
    let movieResults = document.getElementById("foundMovies");
    movieResults.innerHTML = ``;
    let input = document.getElementById("searchMovie");

    //input event listner för att hämta strängen. 
    const string = event.target.value;

    const response = await fetch(`../DATA/movies.json`);
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

