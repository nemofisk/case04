<?php
ini_set("display_errors", 1);
header('Content-Type: application/json');

$filename = __DIR__ . "/../DATA/users.json";
$users = json_decode(file_get_contents($filename), true);

function sortLeaderboard($user1, $user2)
{
    return $user2['popcorn'] - $user1['popcorn'];
}

usort($users, 'sortLeaderboard');


echo json_encode($users, JSON_PRETTY_PRINT);

file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));
?>
