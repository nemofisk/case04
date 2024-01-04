
function renderSettings() {
    document.querySelector("header").innerHTML =
        `
        <div id="hamburgerMenu">
        <div></div>
        <div></div>
        <div></div>
        </div>

        ${displayCurtains("curtainsProfile", "curtainsLightProfile")}
    `
    document.getElementById("hamburgerMenu").addEventListener("click", DisplaySidebar);
    document.querySelector("main").innerHTML = `
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>

    <h1 id="settingsHeader">Settings</h1>
    <div id="settingsContainer">
        <div id="leftSideBox">
            <div class="settingsDivs">
            <div class="middlediv">
                <img src="images/person.png">
                <p id="account">Account</p>
            </div>
                <img class="chevron" src="images/chevron_right.png"></img>
            </div>
            <div class="settingsDivs">
            <div class="middlediv">
                <img src="images/notifications (1).png">
                <p>Notifications</p>
            </div>
                <img class="chevron" src="images/chevron_right.png"></img>
            </div>
            <div class="settingsDivs2">
            <div class="middlediv">
                <img src="images/help.png">
                <p id="moreMargin">Help</p>
            </div>
                <img class="chevron" src="images/chevron_right.png"></img>
            </div>
            <div class="settingsDivs">
            <div class="middlediv">
            <img src="images/info.png">
            <p>About</p>
            </div>
            <img class="chevron" src="images/chevron_right.png"></img>
            </div>
            <div class="settingsDivs2">
            <div class="middlediv">
                <img src="images/language.png">
                <p id="moreMargins">Language</p>
                </div>
                <img class="chevron" src="images/chevron_right.png"></img>
            </div>
        </div>

        <div id="seperator"></div>

        <div id="rightSideBox">
            <div class="settingsDivs">
            <div class="middlediv">
                <img src="images/delete.png">
                <p id="deleteAccount">Delete Account</p>
            </div>
                <img class="chevron" src="images/chevron_right.png"></img>
            </div>
            <div class="settingsDivs3">
            <div class="middlediv">
                <img src="images/logout.png">
                <p id="logout">Logout</p>
            </div>
                <img class="chevron" src="images/chevron_right.png"></img>
            </div>
        </div>
    </div>

    `
    document.querySelector("footer").innerHTML = ``

    document.querySelector("#account").addEventListener("click", displayAccountOptions)
    document.querySelector("#deleteAccount").addEventListener("click", deleteAccount)
    document.querySelector("#logout").addEventListener("click", logout)
}

function displayAccountOptions(event) {
    popUpFunction("changeUserOrPass", event)
}
function deleteAccount(event) {

}
function logout(event) {
    window.localStorage.clear();
    renderFirstPage()
}