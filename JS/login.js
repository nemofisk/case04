"use strict";

function signInpage(event) {
    document.querySelector("header").innerHTML =
        `
    <img src="/Title.png" alt="Logo">
    `
    document.querySelector("main").innerHTML = `
    <main>
        <h1 class="LoginHeader">Login</h1>
        <div>
            <div class="box">
            <input placeholder="Username" id="loginUsername" class="loginRegisterInput"></input>
            <input placeholder="Password" id="loginPassword" class="loginRegisterInput"></input>
            <button class="loginRegister "id="login">Login</button>
            </div>
        </div>
    </main>
    `

    let curtains = displayCurtains("footercurtains", "footercurtainsLight");
    document.querySelector("footer").innerHTML =
        `
    ${curtains}
    `
    document.getElementById("login").addEventListener("click", loginFunction);

}

function loginFunction(event) {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;
    console.log(username);

    fetch("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: username, password: password, action: "login" })
    }).then(request => request.json()).then(resource => {
        if (resource.message === "Login successful!") {
            window.localStorage.setItem(`userID`, resource.userid);
            window.localStorage.setItem(`Popcorn`, resource.Popcorn);
            console.log("sucess");
            window.localStorage.setItem("username", username)
            renderStartingpage();
            //RenderStartingpage();
        } else {
            console.log("login failed");
        }
    });

}