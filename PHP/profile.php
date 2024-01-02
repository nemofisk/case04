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
            foreach($users as $index => $user){
                if($user["username"] === $username){
                    
                    $users[$index]["popcorn"] += $points;

                    if($users[$index]["popcorn"] > $users[$index]["xpGoal"]){
                        $users[$index]["level"] += 1;
                        $level = $users[$index]["level"] * 25;
                        $users[$index]["xpGoal"] += 1000 + $level;
                    }
                    putInUsersJSON($users);
                    sendJSON(["message" => $user], 200);
                }
            }
        }
       
    }
    if($subAction === "addClue"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                $users[$index]["clues"] += 1;
                putInUsersJSON($users);
                sendJSON(["message" => $user], 200);
            
            }
        }
    }

    if($subAction === "useClue"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                if($users[$index]["clues"] === 0){
                    sendJSON(["message" => "no more clues:("], 404);
                }
                $users[$index]["clues"] -= 1;
                putInUsersJSON($users);
                sendJSON(["message" => $user], 200);
                    
            }
        }
    }
    if($subAction === "useFifty"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                if($users[$index]["fiftyfifty"] === 0){
                    sendJSON(["message" => "no more clues:("], 404);
                }
                $users[$index]["fiftyfifty"] -= 1;
                putInUsersJSON($users);
                sendJSON(["message" => $user], 200);
                    
            }
        }
    }
    if($subAction === "addClue"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                $users[$index]["clues"] += 1;
                putInUsersJSON($users);
                sendJSON(["message" => $user], 200);
            
            }
        }
    }
    if($subAction === "addResetTimer"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                $users[$index]["resetTimer"] += 1;
                putInUsersJSON($users);
                sendJSON(["message" => $user], 200);
                    
            }
        }
    }
    if($subAction === "useResetTimer"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                $users[$index]["resetTimer"] -= 1;
                putInUsersJSON($users);
                sendJSON(["message" => $user], 200);
                    
            }
        }
    }
    if($subAction === "getInfo"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                sendJSON(["message" => $user], 200);
                    
            }
        }
    }
        if ($subAction === "getfriends") {
            foreach ($users as $index => $user) {
                if($user["username"] === $username){
                    sendJSON(["message" => $user["friends"]], 200);
                        
                }
            }
        }
    if($subAction === "saveSpinDate"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                $users[$index]["lastSpun"] = date("d");
                putInUsersJSON($users);
                sendJSON(["message" => date("d")], 200);
                    
            }
        }
    }
    if($subAction === "getLastSpun"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                
                sendJSON(["message" => $user["lastSpun"]], 200);
                    
            }
        }
    }
    if($subAction === "resetMonth"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                $user["lastSpun"] = 1;
                putInUsersJSON($users);
                sendJSON(["message" => $user["lastSpun"]], 200);
                    
            }
        }
    }
    if($subAction === "deleteAccount"){
        foreach($users as $index => $user){
            if($user["username"] === $username){
                unset($users[$user]);
                putInUsersJSON($users);
                sendJSON(["message" => $user["lastSpun"]], 200);
                    
            }
        }
    }
    
        
}

function uploadImage($users, $received_data){
    $filename = __DIR__."/../DATA/users.json";
    if (isset($_FILES["upload"])) {
        $username = $_POST["username"];
        $source = $_FILES["upload"]["tmp_name"];
        $name = $_FILES["upload"]["name"];
        $size = $_FILES["upload"]["size"];
        $destination = __DIR__."/../images/".$name;

        if (move_uploaded_file($source, $destination)) {
            header("Content-Type: application/json");
            http_response_code(201);
            echo json_encode([
                "message" => "Success!",
                "filename" => $name,
                "size" => $size,
                "action" => $_POST["action"],
                "destination" => $destination,
            ]);
            foreach ($users as $index => $user) {
                if ($user["username"] === $username) {
                    $users[$index]["profile_picture"] = $name;
                }
            }
        }
        file_put_contents($filename,json_encode($users,JSON_PRETTY_PRINT));
        exit();
    }
    

}


?>

