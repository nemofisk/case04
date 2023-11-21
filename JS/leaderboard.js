
async function fetchFriendsLeaderboard(userId) {
    try {
        const response = await fetch(`../PHP/api.php?action=leaderboard&subAction=friendy&userId=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching friends leaderboard:', error);
    }
}

function displayFriendsLeaderboard(leaderboardData) {
    const leaderboardFriends = document.getElementById("friendsLeaderboard");

    leaderboardData.forEach(user => {
        const userElement = document.createElement("div");
        userElement.textContent = `${user.username}: ${user.popcorn}`;
        leaderboardFriends.appendChild(userElement);
    });
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
async function initializeFriendsLeaderboard(userId) {
    const friendsLeaderboardData = await fetchFriendsLeaderboard(userId);
    displayFriendsLeaderboard(friendsLeaderboardData);
}