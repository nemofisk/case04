async function renderProfilePage() {
    let username = localStorage.getItem("username");
    let userInfo = await getUserinformation(window.localStorage.getItem("username"));
    document.querySelector("main").innerHTML =

        `
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>


<div id="ProfilePageContainer">
<div id="leftSide">        
    <div id="pointsInfo">
    <div class="flexIt">
        <div>Total Score</div>
        <div id="totalPoints"></div>
    </div>
    <div id="seperatorProfile"></div>
    <div class="flexIt">
        <div id="WeeklyPoints">Weekly Points</div>
        <div id="totalPointsWeekly">12374 p</div>
    </div>
    </div>

    <div id="profilePicWrapper">
    <img id="profileImage" src="" alt="Profile Picture">
    <h1 id="profilePageUsername"></h1>
    </div>

    <form id="profile_image" action="./profile/php/upload.php" method="POST" enctype="multipart/form-data">
        <label for="upload_profile_picture" class="customFileUpload">
            <img id="CameraImg" src="images/add_a_photo.png" alt="Profile Picture">
        </label>
        <input type="file" id="upload_profile_picture" name="upload">
    </form>
    


   
    <div id="showfriends"></div>
    <button class="AddFriends" id="sendRequest">+ Add Friends!</button>
    
</div>

    <div id="middle"></div>

    <div id="rightSide">
        <div id="rightSideContainer">
            <div id="friendsAndPoints">
                <p class="pElementShit">Friends</p>
                <p class="pElementShit">Total Points</p>
            </div>
            <div id="myProfile">
            <div class="WrapperForPicAndName">
            <img id="myProfileImage" src="images/${userInfo.profile_picture}" alt="Profile Picture">
                <p>${username}</p>
            </div>
                <div class="userPoints">${userInfo.popcorn} p</div>
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
    document.querySelector("#profileImage").src = `images/${userInfo.profile_picture}`
    document.getElementById("totalPoints").textContent = userInfo.popcorn + " p"
    

    document.getElementById("sendRequest").addEventListener("click", () => {
        popUpFunction("addFriends", "lala")
        
    })


}
async function displayFriendList(userInfo) {
    let friends;
    try {
        const response = await fetch(`PHP/api.php?action=profile&subAction=getfriends&username=${userInfo.username}`);
        const data = await response.json();
        friends = data.message;
    } catch (error) {
        console.error('Error fetching friends leaderboard:', error);
    }

    let container = document.getElementById("rightSideContainer");
    let counter = 0;
    
    console.log(friends.length);
    friends.forEach(friend => {
        
        let div = document.createElement("div");
        div.classList.add("myProfile")
        div.innerHTML =
            `
            <div class="WrapperForPicAndName">
                <img class="myProfileImage" src="images/${friend.profilePicture}" alt="Profile Picture">
                <p class="friendName">${friend.name}</p>
            </div>
            <div class="userPoints">${friend.popcorn} p</div>
        `
        container.appendChild(div);
        console.log(counter);
        counter++
        if(counter === friends.length){
            div.style.border = "none"
        }
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


    let request = new Request("PHP/api.php", {
        method: "POST",
        body: formData,
    })


    // Här skickas det man laddar upp och det som skickas beror på event.targets ID.
    fetch(request)
        .then(response => response.json())
        .then(data => {
            document.getElementById("profileImage").src = `images/${data.filename}`;
        })
}
function levelprogress(points, goal) {
    let procentage = points / goal;
    return procentage * 100;

}