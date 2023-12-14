async function renderProfilePage() {
    let username = localStorage.getItem("username");
    let userInfo = await getUserinformation(window.localStorage.getItem("username"));
    document.querySelector("main").innerHTML =
        `
<div id="ProfilePageContainer">
<div id="leftSide">        
    <div id="pointsInfo">
        <div>Total Score</div>
        <div id="totalPoints"></div>
        <div id="seperator"></div>
        <div id="WeeklyPoints">Weekly Points</div>
    </div>
    <img id="profileImage" src="" alt="Profile Picture">
    <form id="profile_image" action="./profile/php/upload.php" method="POST" enctype="multipart/form-data">
        <input type="file" id="upload_profile_picture" name="upload">
    </form>
    

    <h1></h1>

    <div id="showlevel">Level
        <div id="levelBar">
            <div id="progressBar"></div>
            <div id="displayLevels">
                <div id="currentLevel"></div>
                <div id="nextLevel"></div>
            </div>
        </div>

    </div>
    <div id="AddFriends"></div>
</div>

    <div id="middle"></div>

    <div id="rightSide">
        <div id="rightSideContainer">
            <div id="friendsAndPoints">
                <p>Friends</p>
                <p>Total Points</p>
            </div>
            <div id="myProfile">
            <img id="myProfileImage" src="../images/${userInfo.profile_picture}" alt="Profile Picture">
                <p>${username}</p>
                <div>${userInfo.popcorn} p</div>
            </div>
        </div>
    </div>  
</div>
</  
    `
    displayFriendList(userInfo);
    document.querySelector("footer").innerHTML = ``;
    document.querySelector("h1").textContent = window.localStorage.getItem("username");
    document.getElementById("upload_profile_picture").addEventListener("change", upload_picture);

    console.log(userInfo);
    document.querySelector("#profileImage").src = `../images/${userInfo.profile_picture}`
    document.getElementById("totalPoints").textContent = userInfo.popcorn + " p"
    let lvlProgress = levelprogress(userInfo.popcorn, userInfo.xpGoal)
    console.log(lvlProgress);
    document.getElementById("progressBar").style.width = `${lvlProgress}%`
    document.getElementById("currentLevel").textContent = userInfo.level;
    document.getElementById("nextLevel").textContent = userInfo.level + 1;



}
async function displayFriendList(userInfo) {
    let friends;
    try {
        const response = await fetch(`../PHP/api.php?action=profile&subAction=getfriends&username=${userInfo.username}`);
        const data = await response.json();
        friends = data.message;
    } catch (error) {
        console.error('Error fetching friends leaderboard:', error);
    }

    let container = document.getElementById("rightSideContainer");

    friends.forEach(friend => {
        let div = document.createElement("div");
        div.classList.add("myProfile")
        div.innerHTML =
            `
        <img class="myProfileImage" src="../images/${friend.profilePicture}" alt="Profile Picture">
                <p>${friend.name}</p>
                <div>${friend.popcorn} p</div>
        `
        container.appendChild(div);
    });
}

function upload_picture(event) {
    console.log("HJJFJVENVIU");
    event.preventDefault();
    let image;
    let formData;
    let check_profile_pic = false;

    // Kontrollerar event.targets ID för att identifiera vad det är den ska skicka till PHP-filen och vilken bild det är som ska skickas och vart den ska visas.

    image = document.querySelector("#profile_image");
    formData = new FormData(document.getElementById("profile_image"));

    formData.append("action", "profile_picture");
    check_profile_pic = true;

    formData.append("username", localStorage.getItem("username"));


    let request = new Request("../PHP/api.php", {
        method: "POST",
        body: formData,
    })


    // Här skickas det man laddar upp och det som skickas beror på event.targets ID.
    fetch(request)
        .then(response => response.json())
        .then(data => {
            document.getElementById("profileImage").src = `../images/${data.filename}`;
        })
}
function levelprogress(points, goal) {
    let procentage = points / goal;
    return procentage * 100;

}