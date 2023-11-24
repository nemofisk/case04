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

        <input id="searchMovie"></input>
        <div id="displaySearchedMovies"></div>

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
    displayFriendRequests()

    document.getElementById("searchMovie").addEventListener("input", filterString);
}
