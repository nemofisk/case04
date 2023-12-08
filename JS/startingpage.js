"use strict"

/*
function RenderStartingpage() {
    console.log(localStorage.getItem("username"));

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

        <input placeholder="Search friends"id="searchBar"></input>
        <button id="searchButton">Add friend</button>

       

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
                <div id="LeaderBoard1">Leaderboard 1</div>
                <div id="friendsLeaderboard">Leaderboard 2</div>
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
    document.getElementById("Singelplayer").addEventListener("click", singlePlayer)
    document.getElementById("Multiplayer").addEventListener("click", chooseCatagoryMultiplayer);

    setInterval(checkInvitations, 5000);
    let intervalID = setInterval(renderInvites, 5000);
    function checkInvitations(){
        if(document.querySelector("#invitationPopUp")){
            clearInterval(intervalID)
        }
    }
    
    
    displayFriendRequests()


}
*/
function renderStartingpage() {
    let username = localStorage.getItem("username");
    document.querySelector("header").innerHTML =
        `
    <div id="hamburgerMenu">Hamburger</div>


    
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    `
    document.querySelector("main").innerHTML =
        `
    <h2>The</h2>
    <h1>QUIZEMA</h1>
    
    <p>Welcome ${username}, how would you like to play?</p>
    
    <button id="Multiplayer">Multiplayer</button>
    <button id="Singelplayer">Singelplayer</button>
    `

    document.querySelector("footer").innerHTML =
        `
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    `
    document.getElementById("Singelplayer").addEventListener("click", singlePlayer)
    document.getElementById("Multiplayer").addEventListener("click", chooseCatagoryMultiplayer);
    document.getElementById("hamburgerMenu").addEventListener("click", DisplaySidebar);

    setInterval(checkInvitations, 5000);
    let intervalID = setInterval(renderInvites, 5000);
    function checkInvitations(){
        if(document.querySelector("#invitationPopUp")){
            clearInterval(intervalID)
        }
    }
    
}

function DisplaySidebar(event) {
    let username = localStorage.getItem("username");
    let nav = document.createElement("nav");
    nav.setAttribute(`id`, "Sidebar")
    nav.innerHTML =
        `
    <div id="CloseSidebar"></div>
    <div id="ProfilePicContainer"></div>
    <h2>${username}</h2>

    <div id="home">
    <img></img>
    <p>Home</p>
    </div>

    <div id="profilePage">
    <img></img>
    <p>Profile</p>
    </div>

    <div id="RenderLeaderboard">
    <img></img>
    <p>Leaderboard</p>
    </div>

    <div id="renderLyckyWheel">
    <img></img>
    <p>Lucky Wheel</p>
    </div>

    <p>Play Christmas Game</p>

    <div id="renderSettings">
    <img></img>
    <p>Settings</p>
    </div>
    `
    document.querySelector("main").appendChild(nav);
    document.getElementById("home").addEventListener("click", e => {
        renderStartingpage()
    })
    document.getElementById("profilePage").addEventListener("click", e => {
        renderProfilePage()
    })
    document.getElementById("RenderLeaderboard").addEventListener("click", renderLeaderBoard)
    document.getElementById("renderLyckyWheel").addEventListener("click", e => {
        renderLuckyWheel()
    })
    document.getElementById("renderSettings").addEventListener("click", e => {
        //renderSettings()
    })
    
}

function renderInvites() {
    fetch(`../PHP/api.php?action=multiplayer&subAction=invitations&username=${localStorage.getItem("username")}`)
        .then(r => r.json())
        .then(resource => {
            if (resource.message.hasOwnProperty("hostName")) {
                popUpFunction("gameInvites", resource)
            }
            
        })

}
