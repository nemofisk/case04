<?php 

function register($users, $received_data){

    $username = $received_data["username"];
    $password = $received_data["password"];

    if ($users != null) {
        foreach ($users as $user) {
            if ($user["username"] == $received_data["username"]) {
                $message = ["message" => "Username is already taken"];
                sendJSON($message, 409);
            }
        }
    }if ($username == "" or $password == "") {
        $message = ["message" => "Username or password are empty!"];
        sendJSON($message, 400);

        // Kollar så att username och password inte är kortare än 3 karaktärer.
    } elseif (strlen($username) <= 3 or strlen($password) <= 3 && strlen($username) >= 10) {
        $message = ["message" => "Username and password cannot be shorter than 3 characters!"];
        sendJSON($message, 400);
    }

    $id = 0;

    if (0 <= count($users)) {
        $new_user = ["username" => $username, "password" => $password, "level" => 1, "popcorn" => 0, "friends" => [], "friendRequests" => [], "xpGoal" => 100, "clues" => 0, "resetTimer" => 0, "gameInvites" => []];
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