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
        $selectedGenres = $received_data["genres"];
        $action = $received_data["action"];
        $userToInvite = $received_data["invitedUser"];
        foreach($users as &$user){
            if($user["username"] === $hostUsername){    
 
                $inviteObject = [
                    "gameID" => $randomNumber,
                    "hostID" => $user["id"],
                    "genres" => $selectedGenres,
                    "members" => [],
                    "questions" => getRandomMovies(10, $selectedGenres),
                    "isStarted" => false,
                    "currentQuestion" => "",
                ];
                
                $multiplayerInformation[] = $inviteObject;
                file_put_contents($multiplayerFilename, json_encode($multiplayerInformation, JSON_PRETTY_PRINT));
                $message = ["message" => "Success!"];
                
            }
        }
        foreach($users as &$user){
            if($user["username"] === $userToInvite){ 
                $invitationsObject =[
                    "hostName" => $hostUsername,
                    "gameID" => $randomNumbers
                ];
                $user["gameInvites"][] = $invitationsObject;
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
        
    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
    $message = ["message" => "Success!"];
    sendJSON($message, 200);
    
}

function acceptGameInvite($gameID){
    foreach ($users as &$user) {
        if($user["username"] === $userToInvite){
            foreach($multiplayerInformation as &$game){
                if($gameID === $game["gameID"]){
                    $gameobject = [
                        "userID" => $user["id"],
                        "name" => $user["username"],
                        "profilePicture" => "url",
                        "points" => 0
                    ];
                    $game["members"][] = $gameobject;
                
                }
            }
        }
        
    }
    file_put_contents($multiplayerFilename, json_encode($multiplayerInformation, JSON_PRETTY_PRINT));
    $message = ["message" => "Success!"];
    sendJSON($message, 200);
}


?>