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
                    if($user2["username"] === $friend){
                        
                        $friendsLeaderboard[] = ["username" => $user2["username"], "popcorn" => $user2["popcorn"], "level" => $user2["level"]];
                    }
                }
            }

            // Sort the friends leaderboard
            usort($friendsLeaderboard, 'sortLeaderboard');

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
