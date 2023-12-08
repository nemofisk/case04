  
function popUpFunction(action, information){

    let main = document.querySelector("main");
    let message;
    if(action === "gameInvites"){
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

function acceptInvite(gameID){
    console.log(gameID);
}
function declineInvite(event){
    console.log("declined");
}