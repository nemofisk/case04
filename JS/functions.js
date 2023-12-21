
function popUpFunction(action, information) {
    console.log("HUF");

    let main = document.querySelector("main");
    let message;
    let div = document.createElement("div");
    if (action === "gameInvites") {
        message = information.message[0].hostName + " invited you to a game!"

        div.setAttribute("id", "invitationPopUp")
        div.textContent = message;
        div.classList.add("#gameInvite");
        let acceptBtn = document.createElement("button");
        acceptBtn.textContent = "Accept!"
        let declineBtn = document.createElement("button");
        declineBtn.textContent = "Decline"

        acceptBtn.addEventListener("click", accept => {
            acceptInvite(information.message[0].gameID)
        });
        declineBtn.addEventListener("click", declineInvite);

        main.appendChild(div);
        main.appendChild(acceptBtn);
        main.appendChild(declineBtn);

        clearInterval()
    }
    if (action === "wheel") {
        div.innerHTML = `
        <div id="removePopUp">X</div>
        You got ${information}
        <br>
        <p>You get a new chance tomorrow</p>
    `
        console.log(div.textContent);
        div.classList.add("wheelClass")
        main.appendChild(div);
        document.getElementById("removePopUp").addEventListener("click", element => {
            console.log(element);
            element.target.parentElement.remove();
        })
    }
    
    if(action === "changeUserOrPass"){
        div.innerHTML = `
        <h1>Your profile</h1>
        
        `
    }
    if(action === "addFriends"){
        div.innerHTML = `
        <div id="addFriendsContainer">
            <div id="searchField">
                <img id="searchImage" src="../images/searchlala.png">
                <input id="searchUsers"placeholder="Add new friends"></input>    
            </div>
            <div id="userDisplay"></div>
        </div>
        `
        main.appendChild(div)

        fetch("PHP/api.php", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "friendRequest", subAction: "getAllUsers" })
        }).then(r => r.json()).then(resource => {
            let usersArray = resource.message;

            document.querySelector("#searchUsers").addEventListener("keydown", event => {
                let searchField = document.querySelector("#searchUsers").value;
                let matchingUsers = usersArray.filter(user => user.username.includes(searchField));

                let userDisplayDiv = document.querySelector("#userDisplay");
                userDisplayDiv.innerHTML = ""; 

                matchingUsers.forEach(matchingUser => {
                    
                let userDiv = document.createElement("div");
                userDiv.innerHTML = `
                <div class="friendDivLeft">
                    <div class="friendDivImage" style="background-image: url('images/${matchingUser.profile_picture}')"></div>
                    <div class="friendDivName">${matchingUser.username}</div>
                </div>
                <div>
                    <div class="sendRequestButton">Add +</div>
                </div>

                
                `
                userDisplayDiv.appendChild(userDiv);

                userDiv.querySelector(".sendRequestButton").addEventListener("click", event => {
                    event.target.style.backgroundColor = "rgba(103, 101, 159, 0.35)"

                    
                    searchUsers(matchingUser.username)
                });
                
            });

            })
            
        });
        
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