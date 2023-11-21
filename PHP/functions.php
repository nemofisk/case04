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

?>