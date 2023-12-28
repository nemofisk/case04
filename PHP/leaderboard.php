<?php
ini_set("display_errors", 1);
header('Content-Type: application/json');

function leaderboard($users, $received_data){
    $subAction = $received_data["subAction"];

    function sortLeaderboard($user1, $user2)
    {
        return $user2['popcorn'] - $user1['popcorn'];
    }
    if($subAction == "global"){   
        usort($users, 'sortLeaderboard');
        sendJSON($users);
    } elseif ($subAction == "friendly") {
        $userId = $received_data["userId"];

        // Find the user by ID
        $user = findUserById($users, $userId);

        if ($user) {
            // Get the user's friends
            $friends = $user['friends'];
           

            // Filter users based on friends
            $friendsLeaderboard = [];
            

            foreach($users as $user2){
                foreach($friends as $friend){
                    if($user2["username"] === $friend["name"]){
                        
                        $friendsLeaderboard[] = [
                            "username" => $friend["name"],
                            "popcorn" => $user2["popcorn"],
                            "level" => $user2["level"],
                            "profilePicture" => $friend["profilePicture"]
                        ];
                    }
                }
            }

            // Sort the friends leaderboard
            $UserLoggedIn = ["username" => $user["username"], "popcorn" => $user["popcorn"], "level" => $user["level"], "profilePicture" => $user["profile_picture"]];
            $friendsLeaderboard[] = $UserLoggedIn;
            usort($friendsLeaderboard, 'sortLeaderboard');

            //array_unshift($friendsLeaderboard, $UserLoggedIn);
            
            sendJSON($friendsLeaderboard);
        } else {
            // User not found
            sendJSON([]);
        }
    }
}

function findUserById($users, $userId)
{
    foreach ($users as $user) {
        if ($user['id'] == $userId) {
            return $user;
        }
    }

    return null;
}

?>
