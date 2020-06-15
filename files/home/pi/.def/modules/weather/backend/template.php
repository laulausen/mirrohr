<?php 
$tempWeatherIcons = getConfigValue('weather_weatherIcons');
$owmApiKey = getConfigValue('owmApiKey');
$cityWeatherId = getConfigValue('weather_city');
if(empty($cityWeatherId)) {
	$cityWeatherId = getConfigValue('city');
}

if(empty($tempWeatherIcons)) {
	$tempWeatherIcons = 'false';
}

$weatherTemperatureUnit = getConfigValue('weather_temperatureUnit');

if(empty($weatherTemperatureUnit)) {
	$weatherTemperatureUnit = 'metric';
}

$servername = "localhost";
$username = "glancr";
$password = "glancr";
$dbname = "glancr";

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = 'SELECT name FROM owm_cities WHERE id="' . $cityWeatherId . '"';

$result = $conn->query($sql);
if ($result->num_rows > 0) {
	$cityWeather = $result->fetch_assoc();
} else {
	$cityWeather['name'] = "";
}

$conn->close();

?>

  <link rel="stylesheet" type="text/css" href="bower_components/jquery/dist/jquery-ui.min.css">
  <script type="text/javascript" src="bower_components/jquery/dist/jquery-ui.min.js"></script>
  <script type="text/javascript" src="bower_components/jquery/dist/jquery.ui.autocomplete.html.js"></script>
<?php 
$weather_showToday = getConfigValue('weather_showToday');
if(empty($weather_showToday)) {
	$weather_showToday = 0;
}
if($weather_showToday) {
	$weather_showTodayInput = "checked";
} else {
	$weather_showTodayInput = "";
}
?>

<input type="checkbox" name="weather_showToday" id="weather_showToday" <?php echo $weather_showTodayInput;?>><label for="weather_showToday"><?php echo _('show today');?></label>

<!-- Modal für Uhrzeit-Widget -->
<!--        <div class="large reveal" data-reveal id="gr-modal-weather" data-animation-in="fade-in" data-animation-out="fade-out" tabindex="1" role="dialog">-->
<!--            <button class="close-button" data-close aria-label="Close modal" type="button">-->
<!--                <span aria-hidden="true">&times;</span>-->
<!--            </button>-->
<!--            <h5 class="weather-center reveal__title">--><?php //echo _('weather_description');?><!--</h5>-->
            <p>
                <input type="text" name="owmApiKey" class="owmApiKey" id="owmApiKeyWeather" value="<?php echo $owmApiKey;?>" placeholder="<?php echo _('owm api key input');?>">
           		<div style="height:0;">
	            	<div class="validate validate_owmKey"><?php echo _('validate');?></div>
	            	<div class="validate invalid_owmKey"><?php echo _('invalid owm key');?></div>
	            </div>
           		<div>
                <?php echo _('owm api key link') . ' <i>' . _('owm api key example') . '</i>';?>
                </div>
               </p><select id="weather_temperatureUnit">
                    <optgroup label="<?php echo _('temperature unit');?>">
                        <option value="metric" <?php if($weatherTemperatureUnit == 'metric') echo 'selected'; ?>><?php echo _('temperature in celsius');?></option>
                        <option value="imperial" <?php if($weatherTemperatureUnit == 'imperial') echo 'selected'; ?>><?php echo _('temperature in fahrenheit');?></option>
			<option value="default" <?php if($weatherTemperatureUnit == 'default') echo 'selected'; ?>><?php echo _('temperature in kelvin');?></option>
                    </optgroup>
                </select>
	           	<input type="hidden" id="cityWeatherId" name="cityWeatherId" value="<?php echo $cityWeatherId;?>"/>
	           	<div id="cityWeatherDiv">
	           	<input type="text" name="cityWeather" id="cityWeather" value="<?php echo $cityWeather['name'];?>" placeholder="<?php echo _('which city?');?>">
	            </div>
	            <select id="animatedWeatherIconsWeather">
                    <optgroup label="<?php echo _('animated weather icons');?>">
                        <option value="true" <?php if($tempWeatherIcons == 'true') echo 'selected'; ?>><?php echo _('animated weather icons');?></option>
                        <option value="false" <?php if($tempWeatherIcons == 'false') echo 'selected'; ?>><?php echo _('not animated weather icons');?></option>
                    </optgroup>
                </select>
           
<!--       </div>-->
