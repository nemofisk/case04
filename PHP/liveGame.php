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

        $userID = $recieved_data["userID"];

        if($currentGame["questions"]){

            foreach($currentGame["questions"] as $index => $question){
                unset($currentGame["questions"][$index]["correctAnswer"]);
            }
    
        }

        $doneQuestion = 0;
        $endedQuestion = 0;
        
        foreach($games[$currentGameIndex]["members"] as $indexxx => &$member){
            if(in_array($member["userID"], $currentGame["doneQuestion"])){
                $doneQuestion += 1;
            }
            if(in_array($member["userID"], $currentGame["endedQuestion"])){
                $endedQuestion += 1;
            }
            if($member["userID"] == $userID){
                $member["latestFetch"] = time();
            }
            if(time() > $member["latestFetch"] + 10){
                array_splice($games[$currentGameIndex]["members"], $indexxx, 1);
            }
            putInMultiplayerJSON($games);
        }

        if($doneQuestion == count($currentGame["members"]) and !$games[$currentGameIndex]["nextQuestion"]){
            $games[$currentGameIndex]["nextQuestion"] = true;
            putInMultiplayerJSON($games);
        }

        if($endedQuestion == count($currentGame["members"]) and $games[$currentGameIndex]["nextQuestion"]){
            $games[$currentGameIndex]["nextQuestion"] = false;
            putInMultiplayerJSON($games);
        }

        if(count($currentGame["doneQuestion"]) == count($currentGame["endedQuestion"])){
            $games[$currentGameIndex]["doneQuestion"] = [];
            $games[$currentGameIndex]["endedQuestion"] = [];
            putInMultiplayerJSON($games);
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

        if($qType == "actors" or $qType == "plot" or $qType == "directors"){
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

                    foreach($users as $index => &$user){   
                        if($user["id"] == $userID){
                            $user["popcorn"] += $answerTime * 10;  
                                  
                        }
                    }
                    if($users[$index]["popcorn"] > $users[$index]["xpGoal"]){
                        $users[$index]["level"] += 1;
                        $level = $users[$index]["level"] * 25;
                        $users[$index]["xpGoal"] += 1000 + $level;
                    }
                    putInUsersJSON($users);
                    foreach($games[$currentGameIndex]["questions"][$questionIndex]["pointsFromRound"] as &$qMember){
                        if($qMember["userID"] == $userID){
                            $qMember["roundPoints"] = $answerTime;
                        }
                    }
                    
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
        $games[$currentGameIndex]["questions"] = getRandomMovies(10, $currentGame["genres"]);
        foreach($games[$currentGameIndex]["members"] as &$member){
            $member["points"] = 0;
            $member["inLobby"] = false;
        }

        foreach($games[$currentGameIndex]["questions"] as &$question){
            foreach($games[$currentGameIndex]["members"] as &$member){
                $question["pointsFromRound"][] = ["username" => $member["name"] ,"userID" => $member["userID"], "roundPoints" => 0];
            }
        }

        putInMultiplayerJSON($games);
    }

    if($subAction === "endGame"){
        $userID = $recieved_data["userID"];

        if($games[$currentGameIndex]["isStarted"] == true){
            $games[$currentGameIndex]["isStarted"] = false;
        }

        putInMultiplayerJSON($games);
    }

    if($subAction === "playAgain"){
        $userID = $recieved_data["userID"];

        foreach($games[$currentGameIndex]["members"] as &$member){
            $member["inLobby"] = true;
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

    if($subAction === "doneQuestion"){
        $userID = $recieved_data["userID"];

        $games[$currentGameIndex]["doneQuestion"][] = $userID;
        putInMultiplayerJSON($games);
    }

    if($subAction === "endedQuestion"){
        $userID = $recieved_data["userID"];

        $games[$currentGameIndex]["endedQuestion"][] = $userID;
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