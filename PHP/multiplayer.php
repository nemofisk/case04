<?php 

ini_set("display_errors", 1);

function multiplayer($users, $received_data){
    $filename = __DIR__."/../DATA/users.json";
    $multiplayerFilename = __DIR__."/../DATA/multiplayer.json";
    $users = json_decode(file_get_contents($filename), true);
    $multiplayerInformation = json_decode(file_get_contents($multiplayerFilename), true);

    $hostUsername = $received_data["username"];
    
    $subAction = $received_data["subAction"];
    
    $randomNumber = rand(10000,99999);
    
    
    if($subAction === "inviteToGame"){
        $action = $received_data["action"];
        $userToInvite = $received_data["invitedUser"];
        $gameID = $received_data["gameID"];

        foreach($users as &$user){
            if($user["username"] === $userToInvite){ 
                $invitationsObject =[
                    "hostName" => $hostUsername,
                    "gameID" => $gameID
                ];
                $user["gameInvites"][] = $invitationsObject;
            }
        }
    }
            
    if($subAction === "createGameObject"){
        $selectedGenres = $received_data["genres"];
        $action = $received_data["action"];

        foreach($users as &$user){
            if($user["username"] === $hostUsername){    
 
                $inviteObject = [
                    "gameID" => $randomNumber,
                    "hostID" => $user["id"],
                    "genres" => $selectedGenres,
                    "members" => [[
                        "name" => $hostUsername,
                        "userID" => $user["id"],
                        "profilePicture" => $user["profile_picture"],
                        "points" => 0,
                        "inLobby" => true,
                        "latestFetch" => time()
                    ]],
                    "questions" => "",
                    "isStarted" => false,
                    "doneQuestion" => [],
                    "nextQuestion" => false,
                    "endedQuestion" => []
                ];
                
                $multiplayerInformation[] = $inviteObject;
                file_put_contents($multiplayerFilename, json_encode($multiplayerInformation, JSON_PRETTY_PRINT));
                sendJSON($inviteObject, 200);
                
            }
        }
    }

    if($subAction === "invitations"){

        foreach($users as &$user){
            if($user["username"] === $hostUsername){
                $message = ["message" => $user["gameInvites"]];
                sendJSON($message, 200);
            }
        }
    }
    
    if($subAction === "acceptInvite"){
        $gameID = $received_data["gameID"];
        $username = $received_data["username"];
        foreach ($users as &$user) {
            if($user["username"] === $username){

                foreach($user["gameInvites"] as $index => $invite){
                    if($invite["gameID"] === $gameID){
                        unset($user["gameInvites"][$index]);
                    }
                }

                foreach($multiplayerInformation as &$game){
                    if($gameID === $game["gameID"]){
                        $gameobject = [
                            "userID" => $user["id"],
                            "name" => $user["username"],
                            "profilePicture" => $user["profile_picture"],
                            "points" => 0,
                            "inLobby" => true,
                            "latestFetch" => time()
                        ];

                        $alreadyInGame = false;

                        foreach($game["members"] as &$member){
                            if($member["userID"] == $gameobject["userID"]){
                                $alreadyInGame = true;

                                if($alreadyInGame){
                                    $member["inLobby"] = true;
                                }
                            }
                        }

                        if(!$alreadyInGame){
                            $game["members"][] = $gameobject;
                        }
                    }
                }
            }
        }
        
        file_put_contents($multiplayerFilename, json_encode($multiplayerInformation, JSON_PRETTY_PRINT));
        putInUsersJSON($users);
        $message = ["message" => "Success!"];
        sendJSON($message, 200);
    }

    if($subAction == "fetchFriends"){
        $userID = $received_data["userID"];

        foreach($users as $user){
            if($user["id"] == $userID){
                sendJSON($user["friends"]);
            };
        }
    }

    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
    $message = ["message" => "Success!"];
    sendJSON($message, 200);
    
}


?>