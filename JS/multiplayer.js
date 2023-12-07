function chooseCatagoryMultiplayer(params) {
    genreArray = [
        "Crime",
        "Drama",
        "History",
        "Action",
        "Romance",
        "Adventure",
        "Fantasy",
        "Sci-Fi",
        "Thriller",
        "Animation",
        "Comedy",
        "Horror",
    ];



    document.querySelector("main").innerHTML = `
    <header id="menu">

        <div class="profile">
            <div id="profilePic"></div>
            <p>TheMovieStar</p>
        </div>
    </header>
    

    <div>Choose a category!</div>
    <div id="catergoryMenu"></div>
    <div> i dont want to choose a category</div>
        

    </div>`
    let genresCategorty = document.querySelector("#catergoryMenu");

    for (let i = 0; i < genreArray.length; i++) {
        let div = document.createElement("div");
        div.textContent = genreArray[i];
        genresCategorty.appendChild(div)
        div.addEventListener("click", chooseGenre)
    }
}




function inviteFriends(genreArray){
    document.getElementById("inviteUser").addEventListener("click", inviteFriends)
    document.querySelector("main").innerHTML = `
    <input id="userSearch"></input>
    <button id="inviteUser">Invite User!</button
    
    `
    let inviteUser = document.querySelector("#userSearch").value;
    let hostUsername = window.localStorage.getItem("username");

    fetch("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: hostUsername, invitedUser: inviteUser, action: "inviteToGame", genres: genreArray})
    }).then(r => r.json()).then(resource => {
        console.log(resource);
    });
    
    
}