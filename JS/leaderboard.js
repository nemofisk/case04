
async function fetchFriendsLeaderboard(userId) {
    try {
        const response = await fetch(`../PHP/api.php?action=leaderboard&subAction=friendly&userId=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching friends leaderboard:', error);
    }
}

function displayFriendsLeaderboard(leaderboardData) {
    const leaderboardFriends = document.getElementById("friendsLeaderboard");

    for (let i = 0; i < 10; i++) {
        const userElement = document.createElement("div");
        userElement.textContent = `${leaderboardData[i].username}: ${leaderboardData[i].popcorn}`;
        leaderboardFriends.appendChild(userElement);
    }
}

async function fetchLeaderboard() {
    try {
        const response = await fetch(`../PHP/api.php?action=leaderboard&subAction=global`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}
function displayLeaderboard(leaderboardData) {
    const leaderboard1 = document.getElementById("LeaderBoard1");


    for (let i = 0; i < 10; i++) {
        const userElement = document.createElement("div");
        userElement.textContent = `${leaderboardData[i].username}: ${leaderboardData[i].popcorn}`;
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
    console.log(filteredArray);




//filterString()
    filteredArray.forEach(movie => {
        let movieDiv = document.createElement("div");
        movieDiv.classList.add("displayMovie");
        movieDiv.textContent = movie;
        dropdown.appendChild(movieDiv);
    })

}
