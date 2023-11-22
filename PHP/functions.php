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

?>