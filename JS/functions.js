
function popUpFunction(action, information) {

    let main = document.querySelector("main");
    let message;
    if (action === "gameInvites") {
        message = information.message[0].hostName + " invited you to a game!"
    }
    let div = document.createElement("div");
    div.setAttribute("id", "invitationPopUp")
    div.textContent = message;
    div.classList.add("#gameInvite");
    let acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept!"
    let declineBtn = document.createElement("button");
    declineBtn.textContent = "Decline"

    acceptBtn.addEventListener("click", accept => {
        acceptInvite(information.message[0].gameID)
    });
    declineBtn.addEventListener("click", declineInvite);

    main.appendChild(div);
    main.appendChild(acceptBtn);
    main.appendChild(declineBtn);

    clearInterval()

}

function acceptInvite(gameID) {
    console.log(gameID);
}
function declineInvite(event) {
    console.log("declined");
}

function resetTimer() {
    let request = new Request("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "addResetTimer" })
    })
    callAPI(request);
}
function giveClue() {
    console.log("You have reciedev one clue, you can use in the singleplayer mode!");
    let request = new Request("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "addClue" })
    })
    callAPI(request);


}
function addPoints(num) {
    let request = new Request("../PHP/api.php", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: window.localStorage.getItem("username"), guess: "correct", action: "profile", subAction: "quizGuess", points: num })
    })
    callAPI(request);
}
function nothing() {

}

function displayCurtains(ClassName1, ClassName2) {
    let curtains =
        `
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    <div class="${ClassName2}"></div>
    <div class="${ClassName1}"></div>
    `
    return curtains;
}