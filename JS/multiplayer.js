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
            <p>TheMovieStar</p>
        </div>
    </header>
    

    <div>Choose a category!</div>
    <div id="catergoryMenu"></div>
    <button id="Mixed">Mixed Catagories</button>
    <button id="Continue">Continue</button>
    <div> i dont want to choose a category</div>
        

    </div>`
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
            ContinueButton.disabled = false;
            disabledCatagorys.forEach(catagory => {
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
            ContinueButton.disabled = true;
            SelectedGarnres = [];
            disabledCatagorys.forEach(catagory => {
                catagory.classList.toggle("SelectedGanras")
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
        } else {
            ContinueButton.disabled = true;
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

function inviteFriends(gameID) {
    document.querySelector("main").innerHTML = `
    <input id="userSearch"></input>
    <button id="inviteUser">Invite User!</button>
    <button id="inviteJoinButton"></button>
    `

    const button = document.querySelector("#inviteJoinButton");
    button.addEventListener("click", ev => {
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


