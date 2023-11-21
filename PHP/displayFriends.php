<?php 

function displayFriends($users, $received_data){
    $username = $received_data["username"];

    foreach ($users as $user) {
        if($username === $user["username"]){
            $message = ["friendRequests" => $user["friendRequests"]];
            sendJSON($message, 200);
        }
    }
}

?>