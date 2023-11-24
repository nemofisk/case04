<?php 

function profile($users, $received_data){
    $subAction = $received_data["subAction"];
    $username = $received_data["username"];

    if($subAction === "changeUsername"){
        $newUsername = $received_data["newUsername"];

        foreach($users as $user){
            if($user["username"] === $username){
                $user["username"] = $newUsername;

                putInUsersJSON($users);
                sendJSON(["message" => "Username changed successfully!"], 200);
            }
        }
    }

    if($subAction === "changePassword"){
        $newPassword = $received_data["newPassword"];

        foreach($users as $user){
            if($user["username"] === $username){
                $user["password"] = $newPassword;

                putInUsersJSON($users);
                sendJSON(["message" => "Password changed successfully!"], 200);
            }
        }
    }
}

?>