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

        $answer = $recieved_data["answer"];
        $questionID = $recieved_data["questionID"];
        $questionGlobal;
        $questionIndex;
        $answerTime = $recieved_data["answerTime"];
        $qType = $recieved_data["qType"];
        $userID = $recieved_data["userID"];

        foreach($currentGame["questions"] as $index => $question){

            if($question["questionID"] == $questionID){
                $questionGlobal = $question;
                $questionIndex = $index;
            }

        }

        if($qType == "actors" or $qType == "plot"){
            foreach($currentGame["questions"] as $indexx => $question){
                if($question["questionID"] == $questionID){
    
                    foreach($question["alternatives"] as $altIndex => $alternative){
                        if($alternative["title"] == $answer){
                            foreach($currentGame["members"] as $index => $member){
                                if($member["userID"] == $userID){
    
                                    $userFound = false;
    
                                    foreach($alternative["whoGuessed"] as $member2){
                                        if($member2["userID"] == $userID){
                                            $userFound = true;
                                        }
                                    }
    
                                    if(!$userFound){
                                        unset($member["points"]);
                                        $games[$currentGameIndex]["questions"][$indexx]["alternatives"][$altIndex]["whoGuessed"][] = $member;
                                    }
    
                                }
                            }
                        }
                    }

                }
    
            }
        }

        if($qType == "poster" or $qType == "trailer"){
            
            foreach($currentGame["questions"] as $index => $question){
                if($question["questionID"] == $questionID){

                    $games[$currentGameIndex]["questions"][$index]["guesses"][] = $answer;

                }
            }

        }

        if($answer == $questionGlobal["correctAnswer"]){
    
            foreach($currentGame["members"] as $index => $member){
                if($member["userID"] == $userID){
                    $games[$currentGameIndex]["members"][$index]["points"] += $answerTime;

                    putInMultiplayerJSON($games);
                    sendJSON(["correct" => true]);
                }
            }

        }

        putInMultiplayerJSON($games);
        sendJSON(["correct" => false]);
    }   

    if($subAction === "startGame"){
        $games[$currentGameIndex]["isStarted"] = true;
        putInMultiplayerJSON($games);
    }

    if($subAction === "endGame"){
        $genres = $recieved_data["genres"];
        $userID = $recieved_data["userID"];

        if($games[$currentGameIndex]["isStarted"] == true){
            $games[$currentGameIndex]["isStarted"] = false;
            $newQuestions = getRandomMovies(10, $genres);

            $games[$currentGameIndex]["questions"] = $newQuestions;
        }

        foreach($games[$currentGameIndex]["members"] as $index => $member){
            if($member["userID"] == $userID){
                array_splice($games[$currentGameIndex]["members"], $index, 1);
            }
        }

        putInMultiplayerJSON($games);
    }

    if($subAction === "leaveGame"){

        $userID = $recieved_data["userID"];

        foreach($currentGame["members"] as $index => $member){
            if($member["userID"] == $userID){
                unset($games[$currentGameIndex]["members"][$index]);
            }
        }

        putInMultiplayerJSON($games);
    }

    if($subAction == "fetchQuestion"){
        $questionID = $recieved_data["questionID"];

        foreach($games[$currentGameIndex]["questions"] as $question){
            if($questionID == $question["questionID"]){
                sendJSON($question, 200);
            }
        }
    }

}
?>