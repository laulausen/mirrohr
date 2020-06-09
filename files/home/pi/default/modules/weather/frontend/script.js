<?php 
$weatherWeatherIcons = getConfigValue('weather_weatherIcons');
$owmApiKey = getConfigValue('owmApiKey');
$city = getConfigValue('weather_city');
$weather_showToday = getConfigValue('weather_showToday');

if(empty($weather_showToday)) {
	$weather_showToday = 0;
}
echo 'var weather_showToday = ' . $weather_showToday . ";\n"; 
echo 'var weather_dayOffset = ' . intval(1 - $weather_showToday) . ";\n"; 

if(empty($city)) {
	$city = getConfigValue('city');
}
 
if($weatherWeatherIcons == 'true') {
	echo 'var weatherWeatherIcons="animated";';
} else {
	echo 'var weatherWeatherIcons="static";';
}

$weatherTemperatureUnit = getConfigValue('weather_temperatureUnit');

if($weatherTemperatureUnit == 'default') {
	$weatherTemperatureUnitChar = 'K';
} else if($weatherTemperatureUnit == 'imperial') {
	$weatherTemperatureUnitChar = '&deg;F';
} else  {
	$weatherTemperatureUnitChar = '&deg;C';
	$weatherTemperatureUnit = 'metric';
}
?>
var owmApiKey = '<?php echo $owmApiKey;?>';


$(document).ready(function() {
	// weather
	window.setTimeout(function() {
		updateForecast();
	}, 1000);
});

function updateForecast() {
	getForecast();
	console.log('next forecast weather update: ' + moment().add(7200, 'seconds').format('lll:ss'));
	window.setTimeout(function() {
		updateForecast();
	}, 7200000);
}

function getForecast() {
	if(owmApiKey.length < 1 || '<?php echo $city;?>'.length < 1) {
		for(var i = 0; i < 4; i++) {
			$('#forecastTableRow' + i + ' td:nth-child(1)').html('<b>' + moment().add(i + weather_dayOffset, 'days').format('dd') + '</b>');
			$('#forecastTableRow' + i + ' td:nth-child(2)').html('<svg viewBox="15 15 70 70">' + svgTable[weatherWeatherIcons]['01d'] + '</svg>');
			$('#forecastTableRow' + i + ' td:nth-child(3)').html('min 99.9<?php echo $weatherTemperatureUnitChar; ?>');
			$('#forecastTableRow' + i + ' td:nth-child(4)').html('max 99.9<?php echo $weatherTemperatureUnitChar; ?>');
		}
	} else {
		$.ajax({
			dataType: "json",
			url: '../modules/weather/assets/getForecast.php?city=<?php echo $city;?>&unit=<?php echo $weatherTemperatureUnit; ?>&owmKey=' + owmApiKey
		}).done(function(data) {
			result = {};
			for(var i = 0; i < 4; i++) {
				result[i + weather_dayOffset] = {};
				result[i + weather_dayOffset]['min'] = 1000;
				result[i + weather_dayOffset]['max'] = -1000;
			}
			
			
			recentDay = -1 + weather_dayOffset;
			
			for(var j = 0; j < data.list.length; j++) {
				day = Math.abs(moment().startOf('day').diff(moment(data.list[j].dt * 1000), 'days'));	
				if(day == 0 && weather_dayOffset) {
					continue;
				} else if (day == 4 + weather_dayOffset) {
					break;
				} else {
					if(day != recentDay) {
						recentDay = day;
						result[day]['icon'] = data.list[j + 3].weather[0].icon;
					}
					if(result[day]['max'] < data.list[j].main.temp_max) {
						result[day]['max'] = data.list[j].main.temp_max;
					}
					if(result[day]['min'] > data.list[j].main.temp_min) {
						result[day]['min'] = data.list[j].main.temp_min;
					}	
				}
			}
			
			for(var i = 0; i < 4; i++) {
				$('#forecastTableRow' + i + ' td:nth-child(1)').html('<b>' + moment().add(i + weather_dayOffset, 'days').format('dd') + '</b>');
				$('#forecastTableRow' + i + ' td:nth-child(2)').html('<svg viewBox="15 15 70 70">' + svgTable[weatherWeatherIcons][result[i + weather_dayOffset].icon] + '</svg>');
				$('#forecastTableRow' + i + ' td:nth-child(3)').html('min ' + result[i + weather_dayOffset].min.toFixed(1) + '<?php echo $weatherTemperatureUnitChar; ?>');
				$('#forecastTableRow' + i + ' td:nth-child(4)').html('max ' + result[i + weather_dayOffset].max.toFixed(1) + '<?php echo $weatherTemperatureUnitChar; ?>');
			}
		});
	}
}
var svgTable = {};
<?php 
include('svg/weatherSVGs');
include('svg/staticWeatherSVGs');
?>
