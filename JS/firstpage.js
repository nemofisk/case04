"use strict";

function renderFirstPage(){

    document.querySelector("main").innerHTML = `
        <div id="container">
            <button id="SignIn">Sign in</button>
            <button id="SignUp">Sign up</button>
        </div>
    `

    document.getElementById("SignIn").addEventListener("click", signInpage);
    document.getElementById("SignUp").addEventListener("click", signUppage);
}