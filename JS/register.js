"use strict";

function signUppage(event) {
    document.querySelector("header").innerHTML =
        `
<img src="images/Title.png" alt="Logo">
`
    document.querySelector("main").innerHTML = `
    <main>
    <h1 id="registerHeader" class="LoginHeader">Create an account</h1>
    <div>
        <div class="box">
        <input placeholder="Username" id="registerUsername" class="loginRegisterInput"></input>
        <input placeholder="Password" id="registerPassword" class="loginRegisterInput"></input>
        <input placeholder="Confirm Password" id="ConfirmPassword" class="loginRegisterInput"></input>
        <button class="loginRegister" id="register">Register</button>
        </div>
        <button id="loginShortCut">Already have an account? <span>Login</span></button>
    </div>
</main>
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
    });
}
