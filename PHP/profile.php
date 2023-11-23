<?php 

function profile($users, $received_data){
    $subAction = $received_data["subAction"];
    $username = $received_data["username"];

    if($subAction === "changeUsername"){
        $newUsername = $received_data["newUsername"];

        foreach($users as $user){
            if($user["username"] === $username){
                $user["username"] = $newUsername;

                $

            }
        }
    }

    if($subAction === "changePassword"){

    }

    if($subAction === "")
}

?>