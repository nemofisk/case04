
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
            div.textContent = resource.friendRequests[i];
            div.setAttribute("id", resource.friendRequests[i]);
            requestBox.appendChild(div);
            let button = document.createElement("button");
            button.textContent = "Accept!"
            button.setAttribute("id", "accept")

            let button2 = document.createElement("button");
            button2.textContent = "Decilne!"
            button2.setAttribute("id", "decline")
            div.appendChild(button);
            div.appendChild(button2);

            button.addEventListener("click", respondFriendRequest)
            button2.addEventListener("click", respondFriendRequest)
        }
    })

}

function respondFriendRequest(event) {
    console.log(event);
    let action;
    let user = event.target.parentElement.id;
    console.log(user);
    console.log(window.localStorage.getItem("username"));
    if (event.target.id === "accept") {
        action = "accept"

    } else {
        action = "decline"

    }

    fetch("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), requestedUser: user, action: "friendRequest", subAction: action })
    }).then(r => r.json()).then(resource => {
        console.log(resource);
    });

}
