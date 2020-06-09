<?php
$timeformat = getConfigValue('timeformat');
$infoWeatherIcons = getConfigValue('info_weatherIcons');
$owmApiKey = getConfigValue('owmApiKey');
$cityInfoId = getConfigValue('info_city');
$includeNetatmo = getConfigValue('info_include_netatmo');

if(empty($cityInfoId)) {
	$cityInfoId = getConfigValue('city');
}

if(empty($includeNetatmo)) {
	setConfigValue('info_include_netatmo', 'false');
	$includeNetatmo = getConfigValue('info_include_netatmo');
}

if(empty($infoWeatherIcons)) {
	$infoWeatherIcons = 'false';
}

$infoTemperatureUnit = getConfigValue('info_temperatureUnit');

if(empty($infoTemperatureUnit)) {
	$infoTemperatureUnit = 'metric';
}

$servername = "localhost";
$username = "glancr";
$password = "glancr";
$dbname = "glancr";

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = 'SELECT name FROM owm_cities WHERE id="' . $cityInfoId . '"';

$result = $conn->query($sql);
if ($result->num_rows > 0) {
	$cityInfo = $result->fetch_assoc();
} else {
	$cityInfo['name'] = "";
}

$conn->close();

echo '<script>console.log("' . $timeformat . '");</script>';
?>

  <link rel="stylesheet" type="text/css" href="bower_components/jquery/dist/jquery-ui.min.css">
  <script type="text/javascript" src="bower_components/jquery/dist/jquery-ui.min.js"></script>
  <script type="text/javascript" src="bower_components/jquery/dist/jquery.ui.autocomplete.html.js"></script>
<!-- Modal für Uhrzeit-Widget -->
<!--        <div class="large reveal" data-reveal id="gr-modal-info" data-animation-in="fade-in" data-animation-out="fade-out" tabindex="1" role="dialog">-->
<!--            <button class="close-button" data-close aria-label="Close modal" type="button">-->
<!--                <span aria-hidden="true">&times;</span>-->
<!--            </button>-->
<!--            <h5 class="text-center reveal__title">--><?php //echo _('info_description');?><!--</h5>-->
<!--            -->
                <select id="timeFormat">
                    <optgroup label="<?php echo _('time format');?>">
                        <option value="12" <?php if($timeformat == '12') echo 'selected'; ?>><?php echo _('12-hour timekeeping');?></option>
                        <option value="24" <?php if($timeformat == '24') echo 'selected'; ?>><?php echo _('24-hour timekeeping');?></option>
                    </optgroup>
                </select>
                <p>
	                <input type="text" name="owmApiKey" class="owmApiKey" id="owmApiKeyInfo" value="<?php echo $owmApiKey;?>" placeholder="<?php echo _('owm api key input');?>">
	           		<div style="height:0;">
	            		<div class="validate validate_owmKey"><?php echo _('validate');?></div>
	            		<div class="validate invalid_owmKey"><?php echo _('invalid owm key');?></div>
	            	</div>
	           		<div>
	                	<?php echo _('owm api key link') . ' <i>' . _('owm api key example') . '</i>';?>
	                </div>
                </p>
<select id="info_temperatureUnit">
                    <optgroup label="<?php echo _('temperature unit');?>">
                        <option value="metric" <?php if($infoTemperatureUnit == 'metric') echo 'selected'; ?>><?php echo _('temperature in celsius');?></option>
                        <option value="imperial" <?php if($infoTemperatureUnit == 'imperial') echo 'selected'; ?>><?php echo _('temperature in fahrenheit');?></option>
			<option value="default" <?php if($infoTemperatureUnit == 'default') echo 'selected'; ?>><?php echo _('temperature in kelvin');?></option>
                    </optgroup>
                </select>
	           	<input type="hidden" id="cityInfoId" name="cityInfoId" value="<?php echo $cityInfoId;?>"/>
	           	<div id="cityInfoDiv">
	           	<input type="text" name="cityInfo" id="cityInfo" value="<?php echo $cityInfo['name'];?>" placeholder="<?php echo _('which city?');?>">
	            </div>
	            <select id="animatedWeatherIconsInfo">
                    <optgroup label="<?php echo _('animated weather icons');?>">
                        <option value="true" <?php if($infoWeatherIcons == 'true') echo 'selected'; ?>><?php echo _('animated weather icons');?></option>
                        <option value="false" <?php if($infoWeatherIcons == 'false') echo 'selected'; ?>><?php echo _('not animated weather icons');?></option>
                    </optgroup>
                </select>
                <select id="includeNetatmo">
                    <optgroup label="<?php echo _('include netatmo values');?>">
                        <option value="true" <?php if($includeNetatmo == 'true') echo 'selected'; ?>><?php echo _('include netatmo values');?></option>
                        <option value="false" <?php if($includeNetatmo == 'false') echo 'selected'; ?>><?php echo _('not include netatmo values');?></option>
                    </optgroup>
                </select>

<!--       </div>-->
