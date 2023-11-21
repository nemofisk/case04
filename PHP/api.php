<?php 

require_once "functions.php";
require_once "register.php";
require_once "login.php";
require_once "friendRequest.php";
require_once "displayFriends.php";

ini_set("display_errors", 1);

$requestMethod = $_SERVER["REQUEST_METHOD"];
if($requestMethod === "GET"){
    $received_data = $_GET;
}else{
    $received_data = json_decode(file_get_contents("php://input"), true);
}

$filename = __DIR__."/../DATA/users.json";

if (file_exists($filename)) {
    $users = json_decode(file_get_contents($filename), true);
} else {
    $users = [];
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
}

?>