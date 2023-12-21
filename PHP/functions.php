<?php 
function sendJSON($message, $http_code = 200)
{
    header("content-type: application/json");
    http_response_code($http_code);
    echo json_encode($message);
    exit();
}

function checkAndReturnFile($filename){
    if (file_exists($filename)) {
        $fileArray = json_decode(file_get_contents($filename), true);
    } else {
        $fileArray = [];
    }

    return $fileArray;
}

function putInUsersJSON($newData){
    $filename = __DIR__."/../DATA/users.json";
    file_put_contents($filename, json_encode($newData, JSON_PRETTY_PRINT));
}
function putInMultiplayerJSON($newData){
    $filename = __DIR__."/../DATA/multiplayer.json";
    file_put_contents($filename, json_encode($newData, JSON_PRETTY_PRINT));
}

function getRandomMovies($number, $genres){
    $filename = __DIR__."/../DATA/movies.json";

    if (file_exists($filename)) {
        $movies = json_decode(file_get_contents($filename), true);
    } else {
        $movies = [];
    }

    $filteredMovieArray = removeWrongGenres($movies, $genres);

    $questionsArray = [];

    $questionTypes = ["trailer", "poster", "actors", "plot", "directors"];

    foreach(array_rand($filteredMovieArray, $number) as $arrIndex => $index){
        $movie = $filteredMovieArray[$index];

        $type = $questionTypes[array_rand($questionTypes, 1)];

        if($type === "trailer"){
            for($i = 1; $i < 2; $i++){
                if(!$movie["youtubeLink"]){
                    $movie = $filteredMovieArray[array_rand($filteredMovieArray, 1)];
                    $i = 0;
                }
            }
        }

        $alternatives = [["title" => $movie["Title"], "whoGuessed" => []]];

        $howManyAlts = 0;

        if($type == "directors"){
            $howManyAlts = 2;
        }else{
            $howManyAlts = 4;
        }

        for($i = 0; $i < 3; $i++){
            $altMovie = $filteredMovieArray[array_rand($filteredMovieArray, 1)];

            if(in_array($altMovie["Title"], $alternatives)){
                $i--;
            }elseif ($type === "directors" and $altMovie["Director"] == $movie["Director"]) {
                $i--;
            }else{
                $alternatives[] = ["title" => $altMovie["Title"], "whoGuessed" => []];
            }
            
        }

        shuffle($alternatives);
        
        $questionsArray[] = createQuestion($movie, $type, $arrIndex, $alternatives);
    }


    return $questionsArray;
}

function createQuestion($movie, $type, $arrIndex, $alternatives){

    $question = [
        "questionID" => $arrIndex,
        "type" => $type,
        "correctAnswer" => $movie["Title"],
        "alternatives" => $alternatives
    ];

    if($type == "directors"){
        $question["questionText"] = "Which movie has<br>" . $movie["Director"] . "<br>directed?";
    }

    if($type == "plot"){
        $question["questionText"] = $movie["Plot"];
    }

    if($type == "actors"){
        $question["questionText"] = "Which movie does<br>" . $movie["Actors"] . "<br>star in?";
    }

    if($type == "trailer"){
        $question["youtubeLink"] = $movie["youtubeLink"];
        $question["guesses"] = [];
        unset($question["alternatives"]);
    }

    if($type == "poster"){
        $question["poster"] = $movie["Poster"];
        $question["guesses"] = [];
        unset($question["alternatives"]);

    }

    return $question;
}

function removeWrongGenres($movies, $genres){
    foreach($movies as $index => $movie){
        $hasGenre = false;

        foreach($movie["Genre"] as $genre){
            if(in_array($genre, $genres)){
                $hasGenre = true;
            }
        }

        if($hasGenre){
            array_splice($movies, $index, 1);
        }
    }
    return $movies;
}
?>