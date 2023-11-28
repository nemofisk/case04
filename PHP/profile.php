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

    if($subAction === "quizGuess"){
        $filename = __DIR__."/../DATA/users.json";
        $guess = $received_data["guess"];
        $points = $received_data["points"];
        if($guess === "correct"){
            foreach($users as &$user){
                if($user["username"] === $username){
                    
                    $user["popcorn"] += $points;

                    if($user["popcorn"] === $user["xpGoal"]){
                        $user["level"] += 1;
                        $user["xpGoal"] += 250;
                    }
                    putInUsersJSON($users);
                    sendJSON(["message" => $user], 200);
                }
            }
        }
       
    }
}

?>