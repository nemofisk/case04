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
        $userToRespondToData = null;
    
        foreach ($users as &$userOuter) {
            
            if ($userOuter["username"] === $userToRespondTo) {
                foreach ($users as &$userInner) {
                    if ($userInner["username"] === $username) {
                        $friendObject = [
                            "name" => $userInner["username"],
                            "profilePicture" => $userInner["profile_picture"],
                            "popcorn" => $userInner["popcorn"]
                        ];
    
                        foreach ($users as &$user) {
                            if ($user["username"] === $userToRespondTo) {
                                $user["friends"][] = $friendObject;
                            }
                        }
                    }
                }
    
                foreach ($users as &$user) {
                    if ($user["username"] === $username) {
                        foreach ($users as &$userInner) {
                            if ($userInner["username"] === $userToRespondTo) {
                                $friendObject = [
                                    "name" => $userToRespondTo,
                                    "profilePicture" => $userInner["profile_picture"],
                                    "popcorn" => $userInner["popcorn"]
                                ];
                                foreach ($users as &$userOuter) {
                                    if ($userOuter["username"] === $username) {
                                        $userOuter["friends"][] = $friendObject;
                                        $key = array_search($userToRespondTo, $userOuter["friendRequests"]);
                                        unset($userOuter["friendRequests"][$key]);
                                    }
                                }
                            }
                        }
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
    if($subAction === "getAllUsers"){
        $message = ["message" => $users];
        sendJSON($message, 200);
    }
}



?>