"use strict";

function renderFirstPage() {
    let curtains = displayCurtains("curtains", "curtainsLight");
    document.querySelector("header").innerHTML =
        `
    ${curtains}
    `

    document.querySelector("main").innerHTML = `
        <div id="container">
        <img src="/Title.png" alt="Logo">
            <div id="SignInOrUpContainer">
            <button class="Buttons" id="SignIn">Login</button>
            <button class="Buttons" id="SignUp">Register</button>
            </div>
        </div>
    `

    document.getElementById("SignIn").addEventListener("click", signInpage);
    document.getElementById("SignUp").addEventListener("click", signUppage);
}