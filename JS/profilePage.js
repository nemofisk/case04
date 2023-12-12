async function renderProfilePage() {
    document.querySelector("main").innerHTML =
        `
    <form id="profile_image" action="./profile/php/upload.php" method="POST" enctype="multipart/form-data">
        <input type="file" id="upload_profile_picture" name="upload">
    </form>
    <img id="profileImage" src="" alt="Profile Picture">
    

    <h1></h1>
    <div id="popcorn"></div>
    <div id="showlevel"></div>
    <div id="showfriends"></div>
    `
    document.querySelector("h1").textContent = window.localStorage.getItem("username");
    document.getElementById("upload_profile_picture").addEventListener("change", upload_picture);
    let imageURL = await getUserImage(window.localStorage.getItem("username"));
    document.querySelector("#profileImage").src = `../images/${imageURL}`
    console.log(imageURL);


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