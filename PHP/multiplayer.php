<?php 

ini_set("display_errors", 1);



function multiplayer($users, $received_data){
    
    $gameID = rand(1,9);
    echo($gameID);
    
    $hostUsername = $received_data["username"];
    $action = $received_data["action"];
    $userToInvite = $received_data["invitedUser"];
        
    $filename = __DIR__."/../DATA/users.json";
    $multiplayerFilename = __DIR__."/../DATA/multiplayer.json";
    $users = json_decode(file_get_contents($filename), true);
    $multiplayerInformation = json_decode(file_get_contents($multiplayerFilename), true);

    if($action === "inviteToGame"){
        foreach($users as &$user){
            if($user["username"] === $hostUsername){        
                $inviteObject = [
                    "gameID" => 1,
                    "hostID" => $user["id"],
                    "players" => 0,
                ];
                if($user["invites"]["players"] === 8){
                    $message = ["message" => "Lobby is full!"];
                    sendJSON($message, 400);
                }
                $user["invites"][] = $inviteObject;
            }
        }
        foreach($users as &$user){
            if($user["username"] === $userToInvite){        
                $user["gameInvites"][] = $hostUsername;
            }
        }
    }
            
        
    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
    $message = ["message" => "Success!"];
    sendJSON($message, 200);
    
}




?>