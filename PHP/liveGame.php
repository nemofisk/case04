<?php 

function liveGame($users, $games, $recieved_data){
    $subAction = $recieved_data["subAction"];
    $username = $users["username"];

    if($subAction === "fetchGameInfo"){
        $gameID = $recieved_data["gameID"];
        $currentGame;

        foreach($games as $game){
            if($game["gameID"] == $gameID){
                $currentGame = $game;
            }
        }

        foreach($currentGame["questions"] as $question){
            unset($question["correctAnswer"]);
        }

        $gameInfo = [
            "gameID" => $gameID,
            "host" => $currentGame["host"],
            "members" => $currentGame["members"],
            "questions" => $currentGame["questions"],
            "started" => true;
        ]
    }

    if($subAction === "answerQuestion"){

    }

    if($subAction === "startGame"){

    }

}

?>