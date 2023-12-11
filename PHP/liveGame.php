<?php 

function liveGame($users, $games, $recieved_data){
    $subAction = $recieved_data["subAction"];
    // $username = $users["username"];

    $gameID = $recieved_data["gameID"];
    $currentGame;
    $currentGameIndex;

    foreach($games as $index => $game){
        if($game["gameID"] == $gameID){
            $currentGame = $game;
            $currentGameIndex = $index;
        }
    }

    if($subAction === "fetchGameInfo"){

        foreach($currentGame["questions"] as $index => $question){
            unset($currentGame["questions"][$index]["correctAnswer"]);
        }

        sendJSON($currentGame, 200);        

    }

    if($subAction === "answerQuestion"){
        
    }

    if($subAction === "startGame"){
        $games[$currentGameIndex]["isStarted"] = true;
        putInMultiplayerJSON($games);
    }

    if($subAction === "leaveGame"){
        
    }

}

?>