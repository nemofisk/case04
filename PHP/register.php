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
    $newDate = date("d");
    $newDate = $newDate -1;
    if (0 <= count($users)) {
        $new_user = ["username" => $username, "password" => $password, "level" => 1, "popcorn" => 0, "gameInvites" => [] ,"friends" => [], "friendRequests" => [], "xpGoal" => 1000, "clues" => 0, "fiftyfifty" => 0, "profile_picture" => "Frame 621.png", "lastSpun" => $newDate];
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