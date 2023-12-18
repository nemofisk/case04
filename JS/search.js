

function searchUsers(searchedUser) {
    
    let username = localStorage.getItem("username");
    
    

    fetch("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: username, userToSearchFor: searchedUser, action: "friendRequest", subAction: "searchForUser" })
    }).then(r => r.json()).then(resource => {
        console.log(resource);
    });
}
