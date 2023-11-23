<?php 
function sendJSON($message, $http_code = 200)
{
    header("content-type: application/json");
    http_response_code($http_code);
    echo json_encode($message);
    exit();
}


function putInUsersJSON($newData){
    $filename = __DIR__."/../DATA/users.json";
    file_put_contents($filename, json_encode($newData, JSON_PRETTY_PRINT));
}

function getRandomMovies($number){
    $filename = __DIR__."/../DATA/movies.json";

    if (file_exists($filename)) {
        $movies = json_decode(file_get_contents($filename), true);
    } else {
        $movies = [];
    }

    $randomMovies = [];

    foreach(array_rand($movies, $number) as $index){
        $randomMovie[] = $movies[$index];
    }

    return $randomMovies;
}

function checkCredentials($users, $recieved_data){
    $username = $recieved_data["username"];
    $password = $recieved_data["password"];

    $userFound = false;

    foreach($users as $user){
        if($user["username"] === $username){
            $userFound = true;
            if($user["password"] !== $password){
                $message = ["message" => "Wrong credentials"];
                sendJSON($message, 400);
            }
        }
    }
    if(!$userFound){
        $error = ["message" => "User not found"];
        sendJSON($error, 404);
    }
}

?>