function popUpFunction(action, information){
    let main = document.querySelector("main");
    let message;
    if(action === "gameInvites"){
        message = information.hostName + "invited you to a game!"
    }
    let div = document.createElement("div");
    div.textContent = message;
    div.classList.add("#gameInvite");
    let acceptBtn = document.createElement("button");
    let declineBtn = document.createElement("button");

    acceptBtn.addEventListener("click", acceptInvite);
    declineBtn.addEventListener("click", declineInvite);

    main.appendChild(div);
    main.appendChild(acceptBtn);
    main.appendChild(declineBtn);

    clearInterval()

}

function acceptInvite(event){
    console.log("accept");
}
function declineInvite(event){
    console.log("declined");
}