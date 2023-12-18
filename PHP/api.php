<?php 

require_once "functions.php";
require_once "register.php";
require_once "login.php";
require_once "friendRequest.php";
require_once "displayFriends.php";
require_once "leaderboard.php";
require_once "profile.php";
require_once "multiplayer.php";
require_once "liveGame.php";

ini_set("display_errors", 1);

$requestMethod = $_SERVER["REQUEST_METHOD"];
if($requestMethod === "GET"){
    $received_data = $_GET;
}else{
    $received_data = json_decode(file_get_contents("php://input"), true);
}

$filenameUsers = __DIR__."/../DATA/users.json";
$filenameMultiplayer = __DIR__."/../DATA/multiplayer.json";

$users = checkAndReturnFile($filenameUsers);
$games = checkAndReturnFile($filenameMultiplayer);

if(!isset($action)){
    uploadImage($users, $received_data);
}
$action = $received_data["action"];
switch($action){
    case "register":
        register($users, $received_data);
        break;
    case "login":
        login($users, $received_data);
        break;
    case "displayFriends":
        displayFriends($users, $received_data);
        break;
    case "friendRequest":
        friendRequest($received_data, $users);
        break;
    case "leaderboard":
        leaderboard($users, $received_data);
    case "profile":
        profile($users, $received_data);
        break;
    case "multiplayer":
        multiplayer($users, $received_data);
        break;
    case "liveGame":
        liveGame($users, $games, $received_data);
        break;
    
}

?>