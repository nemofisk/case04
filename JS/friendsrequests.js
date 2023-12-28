
function displayFriendRequests() {
    let requestBox = document.querySelector("main");

    fetch("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "displayFriends" })
    }).then(r => r.json()).then(resource => {
        console.log(resource);
        for (let i = 0; i < resource.friendRequests.length; i++) {
            let div = document.createElement("div");
            let overlayDiv = document.createElement("div");
            overlayDiv.classList.add("Overlay");
            document.querySelector("main").appendChild(overlayDiv);
            div.setAttribute("id", "popUpBox")
            div.classList.add("friendRequestPopUp")
            div.innerHTML = `
            <h1>Friend Request</h1>

            <p><span>${resource.friendRequests[i]}</span> want to be your friend. Do you accept?</p>

            <div id="buttonFlex">
                <button id="decline">Decline!</button>
                <button id="accept">Accept!</button>
            </div>
            `;
            div.setAttribute("id", resource.friendRequests[i]);
            requestBox.appendChild(div);
            

            document.getElementById("accept").addEventListener("click", respondFriendRequest)
            document.getElementById("decline").addEventListener("click", respondFriendRequest)
        }
    })

}

function respondFriendRequest(event) {
    console.log(event);
    let action;
    let user = event.target.parentElement.id;
    
    console.log(window.localStorage.getItem("username"));
    if (event.target.id === "accept") {
        action = "accept"

    } else {
        action = "decline"

    }

    document.querySelector(".friendRequestPopUp").remove()
    document.querySelector(".Overlay").remove()
    fetch("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), requestedUser: user, action: "friendRequest", subAction: action })
    }).then(r => r.json()).then(resource => {
        console.log(resource);
    });

}
