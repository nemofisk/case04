<?php 

function register($users, $received_data){

    $username = $received_data["username"];
    $password = $received_data["password"];

    $id = 0;

    if (0 <= count($users)) {
        $new_user = ["username" => $username, "password" => $password, "level" => 1, "popcorn" => 0, "friends" => [], "friendRequests" => []];
        foreach ($users as $single_user) {
            if ($id < $single_user["id"]) {
                $id = $single_user["id"];
            }
        }
    }
    
    $new_user["id"] = $id + 1;
    $users[] = $new_user;
    putInUsersJSON($users);
    $message = ["message" => $new_user["username"] . " " . "has been registered successfully!"];
    sendJSON($message); 

}

?>