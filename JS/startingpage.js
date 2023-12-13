"use strict"


async function renderStartingpage() {
    let curtains = displayCurtains("curtainsStartingpage", "curtainsLightStartingpage");
    let username = localStorage.getItem("username");
    document.querySelector("header").innerHTML =
        `
        <div id="hamburgerMenu">
        <div></div>
        <div></div>
        <div></div>
        </div>

        ${curtains}
    `
    document.querySelector("main").innerHTML =
        `
        <img src="/Title.png" alt="Logo">
    
    <p id="message">Welcome ${username}, how would you like to play?</p>
    
    <button id="Multiplayer" class="Buttons">Multiplayer</button>
    <button id="Singelplayer" class="Buttons">Singelplayer</button>
    `
    let curtainsFooter = displayCurtains("footercurtainsStartingpage", "footercurtainsLightStartingpage");
    document.querySelector("footer").innerHTML =
        `
        ${curtainsFooter}
    `
    document.getElementById("Singelplayer").addEventListener("click", singlePlayer)
    document.getElementById("Multiplayer").addEventListener("click", chooseCatagoryMultiplayer);
    document.getElementById("hamburgerMenu").addEventListener("click", DisplaySidebar);

    setInterval(checkInvitations, 5000);
    let intervalID = setInterval(renderInvites, 5000);
    function checkInvitations() {
        if (document.querySelector("#invitationPopUp")) {
            clearInterval(intervalID)
        }
    }


    displayFriendRequests()
}

async function DisplaySidebar(event) {
    let main = document.querySelector("main");
    let div = document.createElement("div");
    div.setAttribute("id", "Overlay");
    main.appendChild(div);

    let username = localStorage.getItem("username");
    let nav = document.createElement("nav");
    nav.setAttribute(`id`, "Sidebar")
    nav.innerHTML =
        `
    <div id="CloseSidebar">X</div>

    <div id="Profile">

        <div id="progress">
            <div id="ProfilePicContainer">
                <img id="displayProfilePic"></img>
            </div>
        </div>
        
        <h2>${username}</h2>
    </div>

    <div id="SidebarMenuContainer">
        <div id="home">
            <img src="/house.png" alt="Logo">
            <p>Home</p>
        </div>

        <div id="profilePage">
            <img src="/account_circle.png" alt="Logo">
            <p>Profile</p>
        </div>

        <div id="RenderLeaderboard">
            <img src="/leaderboard.png" alt="Logo">
            <p>Leaderboard</p>
        </div>

        <div id="renderLyckyWheel">
            <img src="/emoji_events.png" alt="Logo">
            <p>Lucky Wheel</p>
        </div>

        <p>Play Christmas Game</p>
    </div>

    <div id="renderSettings">
        <img src="/settings.png" alt="Logo">
        <p>Settings</p>
    </div>
    `



    nav.querySelector("#CloseSidebar").addEventListener("click", e => {
        Sidebar = document.getElementById("Sidebar");
        Sidebar.remove();
        document.querySelector("#Overlay").remove();
    })
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
    progress();

    let userInfo = await getUserinformation(window.localStorage.getItem("username"));
    console.log(userInfo);
    document.querySelector("#displayProfilePic").src = `../images/${userInfo.profile_picture}`
}

function renderInvites() {
    fetch(`../PHP/api.php?action=multiplayer&subAction=invitations&username=${localStorage.getItem("username")}`)
        .then(r => r.json())
        .then(resource => {
            resource.message.forEach(invite => {
                if (invite.hasOwnProperty("hostName")) {
                    popUpFunction("gameInvites", resource)
                }
            })

        })

}


async function progress() {
    let userInfo = await getUserinformation(window.localStorage.getItem("username"));
    let lvlProgress = levelprogress(userInfo.popcorn, userInfo.xpGoal)

    let circularProgress = document.getElementById("progress");

    circularProgress.style.background = `conic-gradient(#FFF8BA ${lvlProgress * 3.6}deg, #323059 0deg)`;
}