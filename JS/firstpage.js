"use strict";

function renderFirstPage() {
    document.querySelector("header").innerHTML =
        `
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    <div class="curtainsLight"></div>
    <div class="curtains"></div>
    `

    document.querySelector("main").innerHTML = `
        <div id="container">
        <img src="/Title.png" alt="Logo">
            <div id="SignInOrUpContainer">
            <button class="signInOrUp" id="SignIn">Login</button>
            <button class="signInOrUp" id="SignUp">Register</button>
            </div>
        </div>
    `

    document.getElementById("SignIn").addEventListener("click", signInpage);
    document.getElementById("SignUp").addEventListener("click", signUppage);
}