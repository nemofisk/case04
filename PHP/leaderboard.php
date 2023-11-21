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
    } elseif ($subAction == "friendy") {
        // Get the user ID for whom you want the friends leaderboard
        $userId = $received_data["userId"];

        // Find the user by ID
        $user = findUserById($users, $userId);

        if ($user) {
            // Get the user's friends
            $friends = $user['friends'];

            // Filter users based on friends
            $friendsLeaderboard = array_filter($users, function ($u) use ($friends) {
                return in_array($u['id'], $friends);
            });

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
