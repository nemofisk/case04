
function renderLeaderBoard() {
    document.querySelector("footer").innerHTML = ``;
    document.querySelector("main").innerHTML =
        `
        <div class="profile">
            <div id="profilePic"></div>
            <img src="images/Frame 263.png" alt="Logo">
        </div>

        <h2 id="LeaderBoardHeader">Leaderboard</h2>
    
        <div id="leaderBoardContainer">
            <div id="WorldLeaderboard"></div>
            <div id="friendsLeaderboard"></div>
       </div>
    `
    let userID = localStorage.getItem(`userID`);
    initializeLeaderboard()
    initializeFriendsLeaderboard(userID);
}


async function fetchFriendsLeaderboard(userId) {
    try {
        const response = await fetch(`PHP/api.php?action=leaderboard&subAction=friendly&userId=${userId}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching friends leaderboard:', error);
    }
}

function displayFriendsLeaderboard(leaderboardData) {
    const leaderboardFriends = document.getElementById("friendsLeaderboard");
    console.log(leaderboardData);
    let username = localStorage.getItem("username");

    let counter = 0;

    leaderboardData.forEach(user => {
        counter++;
        if (user.username === username) {
            let div = document.createElement("div")
            div.classList.add("MyProfile");
            div.innerHTML = `<div class="LeaderboardPicScore"> <p class="ranking">${counter}</p> <img class="CameraImgLeaderboard" src="images/${user.profilePicture}" alt="Profile Picture"> <p class="leaderBoardUsername"> ${user.username}</p> </div>  <p class="leaderboardScore">${user.popcorn}p</p>`;


            let h1 = document.createElement("h1");
            h1.classList.add("headerLeaderBoards");
            h1.innerHTML = `Friends`;
            leaderboardFriends.prepend(h1, div);
        }
    })

    for (let i = 0; i < leaderboardData.length && i < 25; i++) {
        const userElement = document.createElement("div");
        userElement.classList.add("LeaderBoard")
        userElement.innerHTML = `<div class="LeaderboardPicScore"> <p class="ranking">${i + 1}</p> <img class="CameraImgLeaderboard" src="images/${leaderboardData[i].profilePicture}" alt="Profile Picture"> <p class="leaderBoardUsername">${leaderboardData[i].username}</p></div> <p class="leaderboardScore">${leaderboardData[i].popcorn}p</p>`;
        leaderboardFriends.appendChild(userElement);
    }
}

async function fetchLeaderboard() {
    try {
        const response = await fetch(`PHP/api.php?action=leaderboard&subAction=global`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}
function displayLeaderboard(leaderboardData) {
    console.log(leaderboardData);
    let username = localStorage.getItem("username");

    const leaderboard1 = document.getElementById("WorldLeaderboard");

    let counter = 0;

    leaderboardData.forEach(user => {
        counter++;
        if (user.username === username) {
            let div = document.createElement("div")
            div.classList.add("MyProfile");
            div.innerHTML = `<div class="LeaderboardPicScore"> <p class="ranking">${counter}</p> <img class="CameraImgLeaderboard" src="images/${user.profile_picture}" alt="Profile Picture"> <p class="leaderBoardUsername"> ${user.username}</p> </div>  <p class="leaderboardScore">${user.popcorn}p</p>`;
            let h1 = document.createElement("h1");
            h1.classList.add("headerLeaderBoards");
            h1.innerHTML = `World`;
            leaderboard1.prepend(h1, div);
        }
    })

    for (let i = 0; i < leaderboardData.length && i < 25; i++) {
        const userElement = document.createElement("div");
        userElement.classList.add("LeaderBoard")
        userElement.innerHTML = `<div class="LeaderboardPicScore"> <p class="ranking">${i + 1}</p> <img class="CameraImgLeaderboard" src="images/${leaderboardData[i].profile_picture}" alt="Profile Picture"> <p class="leaderBoardUsername">${leaderboardData[i].username}</p> </div> <p class="leaderboardScore">${leaderboardData[i].popcorn}p</p>`;
        leaderboard1.appendChild(userElement);
    }


}

async function initializeLeaderboard() {
    const leaderboardData = await fetchLeaderboard();
    displayLeaderboard(leaderboardData);
}
async function initializeFriendsLeaderboard(userId) {
    const friendsLeaderboardData = await fetchFriendsLeaderboard(userId);
    displayFriendsLeaderboard(friendsLeaderboardData);
}



async function filterString(event) {
    let dropdown = document.getElementById("displaySearchedMovies");
    dropdown.innerHTML = ``;
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

    filteredArray.forEach(movie => {
        let movieDiv = document.createElement("div");
        movieDiv.addEventListener("click", guessMovie);
        movieDiv.classList.add("displayMovie");
        movieDiv.textContent = movie;
        dropdown.appendChild(movieDiv);

    })
    function guessMovie(event) {
        let inputBar = document.getElementById("searchMovie");
        inputBar.value = event.target.textContent;
        console.log(event.target.innerHTML);
    }
}

