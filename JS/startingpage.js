"use strict"


function RenderStartingpage() {
    console.log(localStorage.getItem("username"));
    let username = localStorage.getItem("username");
    document.querySelector("main").innerHTML = `
    <main id"startingpageContainer">
    <header id="menu">

        <div class="profile">
            <div id="profilePic"></div>
            <p>TheMovieStar</p>
        </div>

        <div id="containerLogo">
            <div class="friendRequests"></div>
            <div class="unknown"></div>
            <div class="Logo">
                <img src="">
            </div>
        </div>

        <input id="searchBar"></input>
        <button id="searchButton">Search</button>

    </header>

    <div id="displayMenu">

        <div id="sectionOneWrapper">
            <div id="profileContainer">
                <div class="profile">
                    <div id="profilePic">
                        <img
                            src="">
                    </div>
                    <p>TheMovieStar</p>
                    <div id="levelProgressBar">Level</div>
                </div>
            </div>
            <div id="leaderBoard">
                <div id"LeaderBoard1">Leaderboard 1</div>
                <div class="LeaderBoard">Leaderboard 2</div>
            </div>
        </div>

        <div id="sectionTwoWrapper">
            <div id="Multiplayer">Play with friends</div>
            <div id="Singelplayer">Play alone</div>
            <div id="Challenges">Challenges</div>
        </div>

    </div>
</main>
    `
    document.querySelector("#searchButton").addEventListener("click", searchUsers);
    displayFriendRequests()
}

async function fetchLeaderboard() {
    try {
        const response = await fetch(`../PHP/leaderboard.php`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

function displayLeaderboard(leaderboardData) {
    const leaderboard1 = document.getElementById("LeaderBoard1");

    leaderboardData.forEach(user => {
        const userElement = document.createElement("div");
        userElement.textContent = `${user.username}: ${user.popcorn}`;
        leaderboard1.appendChild(userElement);
    });
}
async function initializeLeaderboard() {
    const leaderboardData = await fetchLeaderboard();
    displayLeaderboard(leaderboardData);
}





function displayFriendRequests() {
    let requestBox = document.querySelector(".friendRequests");

    fetch("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "displayFriends" })
    }).then(r => r.json()).then(resource => {
        console.log(resource);
        for (let i = 0; i < resource.friendRequests.length; i++) {
            let div = document.createElement("div");
            div.textContent = resource.friendRequests[i];
            requestBox.appendChild(div);
            let button = document.createElement("button");
            button.textContent = "Accept!"
            button.setAttribute("id", "accept")

            let button2 = document.createElement("button");
            button2.textContent = "Decilne!"
            button2.setAttribute("id", "decline")
            requestBox.appendChild(button);
            requestBox.appendChild(button2);

            button.addEventListener("click", respondFriendRequest)
            button2.addEventListener("click", respondFriendRequest)
        }
    })

}

function respondFriendRequest(event) {
    let user = event.target.previousElementSibling.textContent;
    let action;
    if (event.target.id === "accept") {
        action = "accept"
    } else {
        action = "decline"
    }

    fetch("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), requestedUser: user, action: "friendRequest", subAction: action })
    }).then(r => r.json()).then(resource => {
        console.log(resource);
    });

}
