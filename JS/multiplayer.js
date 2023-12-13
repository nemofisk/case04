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
        document.getElementById("Mixed").addEventListener("click", mixedCatagories);
    }

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
        ContinueButton.addEventListener("click", event => {
            ContinueFunction(SelectedGarnres);
        });
    }

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

    function ContinueFunction(array) {
        inviteFriends(array);
    }
}





function inviteFriends(genreArray) {
    console.log(genreArray);
    document.querySelector("main").innerHTML = `
    <input id="userSearch"></input>
    <button id="inviteUser">Invite User!</button>
    
    `
    document.getElementById("inviteUser").addEventListener("click", inviteFriends)

    document.getElementById("inviteUser").addEventListener("click", e => {
        let inviteUser = document.querySelector("input").value;
        let hostUsername = window.localStorage.getItem("username");


        fetch("../PHP/api.php", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username: hostUsername, invitedUser: inviteUser, action: "multiplayer", genres: genreArray, subAction: "inviteToGame" })
        }).then(r => r.json()).then(resource => {
            console.log(resource);
        });

    })

}


