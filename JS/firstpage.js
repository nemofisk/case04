"use strict";

function renderFirstPage() {

    let curtains = displayCurtains("curtains", "curtainsLight");
    document.querySelector("header").innerHTML =
        `
    ${curtains}
    `

    document.querySelector("main").innerHTML = `
        <div id="container">
        <img src="images/Title.png" alt="Logo">
            <div id="SignInOrUpContainer">
            <button class="Buttons" id="SignIn">Login</button>
            <button class="Buttons" id="SignUp">Register</button>
            </div>
        </div>
    `

    document.getElementById("SignIn").addEventListener("click", signInpage);
    document.getElementById("SignUp").addEventListener("click", signUppage);
    if (window.localStorage.getItem("username")) {
        const username = window.localStorage.getItem("username");
        const popcorn = window.localStorage.getItem("Popcorn");
        const userID = window.localStorage.getItem("userID");
        window.localStorage.clear();
        window.localStorage.setItem(`userID`, userID);
        window.localStorage.setItem(`Popcorn`, popcorn);
        window.localStorage.setItem("username", username)
        renderStartingpage()

    }
}