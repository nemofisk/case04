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
    <h1>Choose a category!</h1>
    <div id="catergoryMenu"></div>
    <button id="Mixed">Mixed Catagories</button>
    <button id="Continue" class="mpButton">Continue</button>
        

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


        const request = new Request("PHP/api.php", {
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

        <div id="findFriends">
            <input id="userSearch">
            <div id="searchResults"></div>
        </div>

        <div id="addedUsers"></div>
        <button id="inviteUsers" class="mpButton">Nästa</button>
    </div>
    `

    const request = new Request(`PHP/api.php?action=multiplayer&subAction=fetchFriends&userID=${userID}&username=${username}`);

    const response = await callAPI(request, true, false);
    const resource = await response.json();

    const friendsArray = await resource;

    console.log(friendsArray);

    const searchResultsDiv = document.querySelector("#searchResults");
    const input = document.querySelector("#userSearch");
    const body = document.querySelector("body")

    input.addEventListener("click", ev => {
        ev.stopPropagation();
        searchResultsDiv.classList.add("searching");
        searchResultsDiv.innerHTML = "";
        input.style.borderRadius = "20px 20px 0px 0px";
        findUsers(ev, friendsArray);
    });

    input.addEventListener("input", ev => {
        findUsers(ev, friendsArray);
    })

    document.querySelector("#searchResults").addEventListener("click", ev => {
        ev.stopPropagation();
    })

    body.addEventListener("click", ev => {
        ev.stopPropagation();
        searchResultsDiv.classList.remove("searching");
        input.value = "";
        input.style.borderRadius = "20px 20px 20px 20px";
    })

    document.getElementById("inviteUsers").addEventListener("click", e => {

        const addedUsers = document.querySelectorAll(".addedUser");

        addedUsers.forEach(user => {
            let inviteUser = user.querySelector(".addedUserName").textContent;
            let hostUsername = window.localStorage.getItem("username");

            fetch("PHP/api.php", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ username: hostUsername, invitedUser: inviteUser, action: "multiplayer", gameID: gameID, subAction: "inviteToGame" })
            }).then(r => r.json()).then(resource => {
                console.log(resource);
            });
        })

        joinGame(gameID);
    })

}

async function findUsers(event, ar) {
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ``;

    //input event listner för att hämta strängen. 
    const string = event.target.value;

    let filteredArray = [];

    ar.forEach(friend => {
        if (friend !== undefined) {
            const friendName = friend.name;
            //The startsWith method is like the includes() method but it checks the beginning of the string instead. 
            if (friendName.toLowerCase().startsWith(string.toLowerCase())) {
                filteredArray.push(friend);
            }
        }
    })

    filteredArray.splice(3);

    for (let i = 0; i < filteredArray.length; i++) {

        let friendDiv = document.createElement("div");
        friendDiv.classList.add("mpFriend");

        friendDiv.innerHTML = `
            <div class="friendDivLeft">
                <div class="friendDivImage" style="background-image: url('images/${filteredArray[i].profilePicture}')"></div>
                <div class="friendDivName">${filteredArray[i].name}</div>
            </div>

            <div class="inviteFriendButton">+</div>
        `

        const inviteButton = friendDiv.querySelector(".inviteFriendButton");

        const addedUsers = document.querySelectorAll(".addedUser");

        let eventListAdded = false;

        addedUsers.forEach(user => {
            if (user.querySelector(".addedUserName").textContent == filteredArray[i].name) {
                inviteButton.textContent = "x";

                inviteButton.addEventListener("click", ev => {
                    document.querySelector(`#username${filteredArray[i].name}`).remove();
                })

                eventListAdded = true;
            }
        })

        if (!eventListAdded) {
            inviteButton.addEventListener("click", addUser);
        }

        searchResults.appendChild(friendDiv);

        function addUser(ev) {
            const userDiv = document.createElement("div");

            userDiv.innerHTML = `
                <div class="removeAddedUser">
                    <div>x</div>
                </div>
                <div class="addedUserImage" style="background-image: url('images/${filteredArray[i].profilePicture}')"></div>
                <div class="addedUserName">${filteredArray[i].name}</div>
            `

            userDiv.querySelector(".removeAddedUser > div").addEventListener("click", eve => {
                userDiv.remove();
            })

            userDiv.id = "username" + filteredArray[i].name;
            userDiv.classList.add("addedUser");

            document.querySelector("#addedUsers").appendChild(userDiv);
        }
    }
}

