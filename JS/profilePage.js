async function renderProfilePage() {
    document.querySelector("main").innerHTML =
    `
    <div id="pointsInfo">
        <div>Total Score</div>
        <div id="totalPoints"></div>
        <div id="seperator"></div>
        <div id="totalPoints"></div>
    </div>
    <img id="profileImage" src="" alt="Profile Picture">
    <form id="profile_image" action="./profile/php/upload.php" method="POST" enctype="multipart/form-data">
        <input type="file" id="upload_profile_picture" name="upload">
    </form>
    

    <h1></h1>
    <div id="popcorn"></div>
    <div id="showlevel">Level
        <div id="levelBar">
            <div id="progressBar"></div>
            <div id="displayLevels">
                <div id="currentLevel"></div>
                <div id="nextLevel"></div>
            </div>
        </div>

    </div>
    <div id="showfriends"></div>
    `
    document.querySelector("h1").textContent = window.localStorage.getItem("username");
    document.getElementById("upload_profile_picture").addEventListener("change", upload_picture);
    let userInfo = await getUserinformation(window.localStorage.getItem("username"));
    console.log(userInfo);
    document.querySelector("#profileImage").src = `../images/${userInfo.profile_picture}`
    document.getElementById("totalPoints").textContent = userInfo.popcorn + "p"
    let lvlProgress = levelprogress(userInfo.popcorn, userInfo.xpGoal)
    console.log(lvlProgress);
    document.getElementById("progressBar").style.width = `${lvlProgress}%`
    document.getElementById("currentLevel").textContent = userInfo.level;
    document.getElementById("nextLevel").textContent = userInfo.level + 1;


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

        formData.append("action","profile_picture");
        check_profile_pic = true;
    
    formData.append("username",localStorage.getItem("username"));
    

    let request = new Request("../PHP/api.php",{
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
function levelprogress(points, goal){
    let procentage = points / goal;
    return procentage * 100;

}