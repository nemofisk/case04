<?php 

function login($users, $received_data){
    
    $username = $received_data["username"];
    $password = $received_data["password"];

    $userFound = false;

    foreach($users as $user){
        if($username === $user["username"] && $password === $user["password"]){
            $message = ["userid" => $user["id"], "username" => $user["username"], "message" => "Login successful!"];
            $userFound = true;
            sendJSON($message, 200);
        }
    }
    if (!$userFound) {
        $message = ["message" => "User not found"];
        sendJSON($message, 404);
    }
    
}

?>