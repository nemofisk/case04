
function renderSettings(){
    document.querySelector("main").innerHTML = `
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>

    <h1>Settings</h1>
    <div id="settingsContainer">
        <div id="leftSideBox">
            <div class="settingsDivs">
                <img src="../images/person.png">
                <p id="account">Account</p>
            </div>
            <div class="specificWidth">
                <img src="../images/notifications (1).png">
                <p>Notifications</p>
            </div>
            <div class="settingsDivs">
                <img src="../images/help.png">
                <p>Help</p>
            </div>
            <div class="settingsDivs">
            <img src="../images/info.png">
            <p>About</p>
            </div>
            <div class="specificWidth">
                <img src="../images/language.png">
                <p>Language</p>
            </div>
        </div>

        <div id="seperator"></div>

        <div id="rightSideBox">
            <div class="specificWidth">
                <img src="../images/delete.png">
                <p id="deleteAccount">Delete Account</p>
            </div>
            <div class="specificWidth">
                <img src="../images/logout.png">
                <p id="logout">Logout</p>
            </div>
        </div>
    </div>

    `
    document.querySelector("footer").innerHTML = ``

    document.querySelector("#account").addEventListener("click", displayAccountOptions)
    document.querySelector("#deleteAccount").addEventListener("click", deleteAccount)
    document.querySelector("#logout").addEventListener("click", logout)
}

function displayAccountOptions(event){
    popUpFunction("changeUserOrPass", event)
}
function deleteAccount(event){

}
function logout(event){
    window.localStorage.clear();
    renderFirstPage()
}