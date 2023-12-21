"use strict";

function signUppage(event) {
    document.querySelector("header").innerHTML =
        `
<img src="images/Title.png" alt="Logo">
`
    document.querySelector("main").innerHTML = `
    
    <h1 id="registerHeader" class="LoginHeader">Create an account</h1>
    <div>
        <div class="box">
        <input placeholder="Username" id="registerUsername" class="loginRegisterInput"></input>
        <input placeholder="Password" id="registerPassword" class="loginRegisterInput"></input>
        <input placeholder="Confirm Password" id="ConfirmPassword" class="loginRegisterInput"></input>
        <p id="registerFeedback"></p>
        <button class="loginRegister" id="register">Register</button>
        </div>
        <button id="loginShortCut">Already have an account? <span>Login</span></button>
    </div>

    `
    let curtains = displayCurtains("footercurtains", "footercurtainsLight");
    document.querySelector("footer").innerHTML =
        `
   ${curtains}
    `
    document.getElementById("register").addEventListener("click", registerFunction);
    document.getElementById("loginShortCut").addEventListener("click", signInpage);
}

function registerFunction(event) {
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;

    fetch("PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: username, password: password, action: "register" })
    }).then(r => r.json()).then(l => {
        let main = document.querySelector(`main`);

        if (l.message === `${username} has been registered successfully!`) {
            let main = document.querySelector("main");
            let div = document.createElement("div");
            div.setAttribute("id", "Overlay");
            main.appendChild(div);

            let popup = document.createElement("div");
            popup.classList.add("registerLoginPopup");
            popup.innerHTML = `<p id="exitPopup">X</p> <h1 id="h1RegisterFeedback">Registered</h1> ${l.message}`;
            main.appendChild(popup);
            document.querySelector("#exitPopup").addEventListener("click", e => {
                document.querySelector("#Overlay").remove();
                signInpage();
            })
        } else {
            let feedback = document.getElementById("registerFeedback")
            feedback.innerHTML = `${l.message}`;
            main.appendChild(feedback)
        }

    })
}
