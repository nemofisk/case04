
function popUpFunction(action, information) {
    console.log("HUF");

    let main = document.querySelector("main");
    let message;
    let div = document.createElement("div");
    if (action === "gameInvites") {


        console.log("hje");
        div.setAttribute("id", "invitationPopUp")
        div.innerHTML = `
        <h1>Invite</h1>

        <p><span>${information.message[0].hostName}</span> has invited you to a game. Do you want to join?</p>

        <div id="buttonFlex">
            <button id="decline">Decline!</button>
            <button id="accept">Accept!</button>
        </div>
        `;
        let overlayDiv = document.createElement("div");
        overlayDiv.classList.add("Overlay");
        div.classList.add("friendRequestPopUp");
        document.querySelector("main").appendChild(overlayDiv)
        document.querySelector("main").appendChild(div)

        document.querySelector("#accept").addEventListener("click", accept => {
            document.querySelector(".friendRequestPopUp").remove()
            document.querySelector(".Overlay").remove()
            acceptInvite(information.message[0].gameID)
        });
        document.querySelector("#decline").addEventListener("click", declineInvite);



        clearInterval()
        //document.querySelector(".friendRequestPopUp").remove()
    }

    if (action === "wheel") {
        div.innerHTML = `
        <div id="removePopUp">X</div>
        <p class="whatYouGot">You got ${information}</p>
        <br>
        <p class="newChance">You get a new chance tomorrow</p>
    `
        let Overlaydiv = document.createElement("div");
        Overlaydiv.setAttribute("class", "Overlay");
        main.appendChild(Overlaydiv);

        console.log(div.textContent);
        div.classList.add("wheelClass")
        main.appendChild(div);
        document.getElementById("removePopUp").addEventListener("click", element => {
            document.querySelector(".Overlay").remove();
            console.log(element);
            element.target.parentElement.remove();
        })
        if (information !== "Nothing") {
            let img = document.createElement("img");
            img.classList.add("crownImage")
            img.src = "images/crownWheel.png"
            document.querySelector(".wheelClass").appendChild(img)
        }
    }

    if (action === "changeUserOrPass") {
        div.innerHTML = `
        <h1>Your profile</h1>
        
        `
    }
    if (action === "addFriends") {



        fetch("PHP/api.php", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "friendRequest", subAction: "getAllUsers" })
        }).then(r => r.json()).then(resource => {
            let usersArray = resource.message;
            usersArray.forEach(user => {
                if (user.username === window.localStorage.getItem("username")) {
                    //console.log(user.friends);
                }
            });
            div.innerHTML = `
        <div id="addFriendsContainer">
            <div id="searchField">
                <img id="searchImage" src="../images/searchlala.png">
                <input id="searchUsers" placeholder="Add new friends"></input> 
                  
            </div>
            <div id="userDisplay"></div>
        </div>
        `
            let overlayDiv = document.createElement("div");
            overlayDiv.classList.add("Overlay");
            main.appendChild(overlayDiv)
            main.appendChild(div)



            document.querySelector("#searchUsers").addEventListener("keydown", event => {
                let searchField = document.querySelector("#searchUsers").value;
                let matchingUsers = usersArray.filter(user => user.username.includes(searchField));

                let userDisplayDiv = document.querySelector("#userDisplay");
                userDisplayDiv.innerHTML = "";

                matchingUsers.forEach(matchingUser => {
                    if (!matchingUser.friends.some(friend => friend.name.toLowerCase() === window.localStorage.getItem("username").toLowerCase())) {

                        if (matchingUser.username !== window.localStorage.getItem("username")) {

                            let userDiv = document.createElement("div");
                            userDiv.setAttribute("id", "userDiv")
                            userDiv.innerHTML = `
                                        <div class="friendDivLeft">
                                            <div class="friendDivImages" style="background-image: url('images/${matchingUser.profile_picture}')"></div>
                                            <div class="friendDivName">${matchingUser.username}</div>
                                        </div>
                                        <div>
                                            <div class="sendRequestButton">Add +</div>
                                        </div>
                                        `
                            userDisplayDiv.appendChild(userDiv);
                            if (matchingUser.friendRequests.includes(window.localStorage.getItem("username"))) {

                                document.querySelector(".sendRequestButton").style.backgroundColor = "rgba(103, 101, 159, 0.35)"
                                event.target.style.pointerEvents = "none";
                            }


                            userDiv.querySelector(".sendRequestButton").addEventListener("click", event => {
                                event.target.style.backgroundColor = "rgba(103, 101, 159, 0.35)"
                                event.target.style.pointerEvents = "none";


                                searchUsers(matchingUser.username)
                            });
                        } else {
                            console.log("already a friends");
                        }
                    }
                });

            })
            document.querySelector("main").addEventListener("click", e => {
                console.log(e.target);
                if (e.target.id !== "userDisplay") {
                    if (e.target.id !== "searchField") {
                        if (e.target.id !== "searchUsers") {
                            if (e.target.id !== "userDiv") {

                                if (e.target.classList[0] !== "sendRequestButton") {
                                    if (document.querySelector("#addFriendsContainer")) {

                                        document.querySelector("#addFriendsContainer").remove()
                                        document.querySelector(".Overlay").remove()
                                    }

                                }
                            }

                        }
                    }

                }
            })

        });
        document.getElementById("sendRequest").addEventListener("click", () => {
            popUpFunction("addFriends", "lala")

        })

    }


}


async function acceptInvite(gameID) {
    const request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: window.localStorage.getItem("username"),
            userID: window.localStorage.getItem("userID"),
            gameID: gameID,
            action: "multiplayer",
            subAction: "acceptInvite"

        })
    })

    const response = await callAPI(request, true, false);
    joinGame(gameID);
}
function declineInvite(event) {
    document.querySelector(".friendRequestPopUp").remove()
    document.querySelector(".Overlay").remove()
    console.log("declined");
}

function resetTimer() {
    let request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "addResetTimer" })
    })
    callAPI(request);
}
function giveClue() {
    console.log("You have reciedev one clue, you can use in the singleplayer mode!");
    let request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "addClue" })
    })
    callAPI(request);


}
function addPoints(num) {
    let request = new Request("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), guess: "correct", action: "profile", subAction: "quizGuess", points: num })
    })
    callAPI(request);
}
function nothing() {

}

function displayCurtains(ClassName1, ClassName2) {
    if (window.innerWidth < 400) {
        let mobileCurtains = `
        <div class="${ClassName1}"></div>
        <div class="${ClassName2}"></div>
        <div class="${ClassName1}"></div>
        <div class="${ClassName2}"></div>
        <div class="${ClassName1}"></div>
        <div class="${ClassName2}"></div>
        <div class="${ClassName1}"></div>
        `
        return mobileCurtains
    }
    let curtains =
        `
   
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    
   
    `
    return curtains;
}

async function getUserinformation(user) {
    try {
        const response = await fetch(`PHP/api.php?action=profile&subAction=getInfo&username=${user}`);
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }

}