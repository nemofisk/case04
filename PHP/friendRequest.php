<?php
ini_set("display_errors", 1);

function friendRequest($received_data, $users){
    $action = $received_data["action"];
    $username = $received_data["username"];
    $subAction = $received_data["subAction"];
    
    $filename = __DIR__."/../DATA/users.json";
    $users = json_decode(file_get_contents($filename), true);

    if($subAction === "searchForUser"){
        $userRequest = $received_data["userToSearchFor"];
        foreach($users as &$user){
            if($user["username"] === $userRequest){
                if(in_array($username, $user["friendRequests"])){
                    $message = ["message" => "You can't add the same person twice!"];
                    sendJSON($message, 400);
                }else{
                    $user["friendRequests"][] = $username;
                }
            }
            
        }
        file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
        $message = ["message" => "Success!"];
        sendJSON($message, 200);

    }

    if($subAction === "accept"){
        $userID = $received_data["userID"];
        $userToRespondTo = $received_data["requestedUser"];
        $userToRespondID;
        foreach($users as &$user){
            if($user["username"] === $userToRespondTo){
                $userToRespondID = $user["userID"];
                $user["friends"][] = ["username" => $username, "userID" => $userID];
            }
            if($user["username"] === $username){
                $user["friends"][] = ["username" => $userToRespondTo, "userID", "userID" => $userToRespondID];
                for($i = 0;$i < count($user["friendRequests"]); $i++){
                    if($user["friendRequests"][$i] === $userToRespondTo){
                        unset($user["friendRequests"][$i]);
                    }
                }
            }
        }
        
        file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
        $message = ["message" => "Success!"];
        sendJSON($message, 200);
    }
    if($subAction === "decline"){
        $userToRespondTo = $received_data["requestedUser"];
        foreach ($users as &$user) {
            if ($user["username"] === $username) {
                for ($i = 0; $i < count($user["friendRequests"]); $i++) {
                    if ($user["friendRequests"][$i] === $userToRespondTo) {
                        unset($user["friendRequests"][$i]);
                    }
                }
            }
        }
        file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
        $message = ["message" => "Success!"];
        sendJSON($message, 200);
 
    }
}



?>