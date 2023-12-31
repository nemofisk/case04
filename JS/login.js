"use strict";

function signInpage(event) {
    document.querySelector("header").innerHTML =
        `
    <img src="images/Title.png" alt="Logo">
    `
    document.querySelector("main").innerHTML = `
   
        <h1 class="LoginHeader">Login</h1>
        <div class="con">
            <div class="box">
            <input placeholder="Username" id="loginUsername" class="loginRegisterInput"></input>
            <input type="password" placeholder="Password" id="loginPassword" class="loginRegisterInput"></input>
            </div>
            <p id="loginFeedback"></p>
            <button class="loginRegister "id="login">Login</button>
            <p id="registerShortCut">Don't have an account?<span> Register</span></p>
        </div>
    
    `
    document.getElementById("loginUsername").addEventListener("keydown", e => {
        document.getElementById("loginPassword").style.opacity = "0.5"
    })
    document.getElementById("loginPassword").addEventListener("keydown", e => {
        document.getElementById("loginPassword").style.opacity = "1"
    })
    document.getElementById("registerShortCut").addEventListener("click", f => {
        signUppage()
    })

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

            let feedback = document.getElementById("loginFeedback")
            feedback.innerHTML = `login failed`;
        }
    });

}