<?php 

$url = 'http://api.openweathermap.org/data//2.5/forecast?id=' . $_GET['city'] .  '&units=' . $_GET['unit'] . '&lang=DE&APPID=' . $_GET['owmKey'];

$refresh = true; 

if(file_exists('/var/www/html/tmp/owmForecast.json')) {
    $forecast = file_get_contents('/var/www/html/tmp/owmForecast.json');
    $forecastJSON = json_decode($forecast, 1);
    if($forecastJSON['list'][0]['dt'] > time() && $forecastJSON['url'] == $url) {
        $refresh = false;
    }
}

if($refresh) {
    $forecast = file_get_contents($url);
    $forecastJSON = json_decode($forecast, 1);
    $forecastJSON['url'] = $url;
    $forecastJSON['time'] = time();
    file_put_contents('/var/www/html/tmp/owmForecast.json', json_encode($forecastJSON));
}

echo $forecast;

?>