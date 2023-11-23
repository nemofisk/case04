
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