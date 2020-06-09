<?php
    # Die Session muss immer zuerst gestartet werden, bevor
    # eine Ausgabe an den Browser erfolgt !!!
SESSION_START();
$timeformat = getConfigValue('timeformat');
$infoWeatherIcons = getConfigValue('info_weatherIcons');
$owmApiKey = getConfigValue('owmApiKey');
$city = getConfigValue('info_city');
if(empty($city)) {
	$city = getConfigValue('city');
}
 
if($infoWeatherIcons == 'true') {
	echo 'var infoWeatherIcons="animated";';
} else {
	echo 'var infoWeatherIcons="static";';
}

$infoTemperatureUnit = getConfigValue('info_temperatureUnit');

if($infoTemperatureUnit == 'default') {
	$infoTemperatureUnitChar = 'K';
} else if($infoTemperatureUnit == 'imperial') {
	$infoTemperatureUnitChar = '&deg;F';
} else  {
	$infoTemperatureUnitChar = '&deg;C';
	$infoTemperatureUnit = 'metric';
}
?>

 
var hoursFormat = (<?php echo $timeformat;?> == 12 ? 'hh' : 'HH');
var owmApiKey = '<?php echo $owmApiKey;?>';
var isFullwidth = $('.infomodule').hasClass('module__fullwidth');


$(document).ready(function() {
	//getEvents("",0);
	updateTime();
	updateWeather();
	isFullwidth && updateMoon();
})

function getEvents(lastState,counter) {
  var state="";
  if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      state = this.responseText.trim();
      lastState = String(lastState);
/*      if (state != "" + lastState) {

//	... hier Ihr code

      }
      else if (counter <= 10) {
	counter++;
      }
      else {

//	... hier Ihr code

      }*/
    }
  };
  xhttp.open("GET", "../modules/info/frontend/getState.php", true);
  xhttp.send();
        window.setTimeout(function() {
        getEvents(state,counter);
        }, 1000);
}

function updateTime() {
	now = moment();
	$('.infomodule__time').html(now.format(hoursFormat + ':mm'));
	$('.infomodule__date').html(now.format('dd, L'));
 	if(isFullwidth) {
		$('.infomodule__time').append('<span class="seconds" style="width: 30px;">' + now.format('ss') + '</span>');
		window.setTimeout(function() {
			updateTime();
		}, 1000 - now.milliseconds());
 	} else {
		window.setTimeout(function() {
			updateTime();
		}, (61 - now.seconds()) * 1000);
	}

}

function updateDate() {
	console.log('                    '+moment()+'                    '+'**Modul Info: date update');
	now = new Date();
	console.log('next info date update: ' + moment().add(86401 - (now.getSeconds() + (60 * now.getMinutes()) + (3600 * now.getHours())), 'seconds').format('lll:ss'));
	$('.infomodule__date').html(moment().format('dd, L'));
	window.setTimeout(function() {
		updateDate();
	}, (86401 - (now.getSeconds() + (60 * now.getMinutes()) + (3600 * now.getHours()))) * 1000);
}

function updateWeather() {
	console.log('                    '+moment()+'                    '+'**Modul Info: Wetter update');
	getWeather();
	console.log('next info weather update: ' + moment().add(1800, 'seconds').format('lll:ss'));
	window.setTimeout(function() {
		updateWeather();
	}, 1800000);
}

function getWeather() {
	console.log('                    '+moment()+'                    '+'**Modul Info: getWeather() ');
	if(owmApiKey.length < 1 || '<?php echo $city;?>'.length < 1) {
		$('.infomodule__temperature > span').html('99.9<?php echo $infoTemperatureUnitChar; ?>');
		$('.infomodule__today--right span:nth-child(1)').html('min <b>99.9<?php echo $infoTemperatureUnitChar; ?></b>');
		$('.infomodule__today--right span:nth-child(2)').html('max <b>99.9<?php echo $infoTemperatureUnitChar; ?></b>');
		$('.infomodule__rainprob').html('99&#037;');
		$('.infomodule__wind').html('0.0m/s');
		$('#windpath > path').attr('transform', 'rotate(90, 14.175, 14.175)');
		$('.infomodule__temperature > svg').remove();
		$('.infomodule__temperature').prepend('<svg viewBox="25 25 60 60">' + svgTable[infoWeatherIcons]['01d'] + '</svg>');
		for(var i = 0; i < 6; i++) {
			isFullwidth ? $('#justify' + i + ' > span').html('00:00') : $('#justify' + i + ' > span').html('00');
			$('#justify' + i + ' > svg').remove();
			$('#justify' + i).append('<svg viewBox="15 15 70 70">' + svgTable[infoWeatherIcons]['01d'] + '</svg>');
		}
	} else { 
		$.ajax({
			url: 'http://api.openweathermap.org/data//2.5/weather?id=<?php echo $city;?>&units=<?php echo $infoTemperatureUnit; ?>&lang=DE&APPID=' + owmApiKey
		}).done(function(data) {
			$('.infomodule__temperature > span').html(data.main.temp.toFixed(1) + '°c');
			$('.infomodule__today--right span:nth-child(1)').html('min <b>' + data.main.temp_min.toFixed(1) + '<?php echo $infoTemperatureUnitChar; ?></b>');
			$('.infomodule__today--right span:nth-child(2)').html('max <b>' + data.main.temp_max.toFixed(1) + '<?php echo $infoTemperatureUnitChar; ?></b>');
			$('.infomodule__rainprob').html(data.main.humidity + '&#037;');
			$('.infomodule__wind').html(data.wind.speed.toFixed(1) + 'm/s');
			if(data.wind.hasOwnProperty('deg')) {
				$('#windpath > path').attr('transform', 'rotate(' + (data.wind.deg - 90) + ', 14.175, 14.175)');
			}
			$('.infomodule__temperature > svg').remove();
			$('.infomodule__temperature').prepend('<svg viewBox="25 25 60 60">' + svgTable[infoWeatherIcons][data.weather[0].icon] + '</svg>');
		}).complete(function() {
			window.setTimeout(function() {
				$.ajax({
					url: 'http://api.openweathermap.org/data//2.5/forecast?id=<?php echo $city;?>&units=<?php echo $infoTemperatureUnit; ?>&lang=DE&APPID=' + owmApiKey + '&cnt=5'
				}).done(function(data) {
					for(var i = 0; i < 4; i++) {
  						isFullwidth ? $('#justify' + i).html(moment(data.list[i].dt * 1000).format(hoursFormat+':mm')) : $('#justify' + i ).html(moment(data.list[i].dt * 1000).format(hoursFormat));

						$('#justify' + i + '> svg').remove();

						$('#justify' + i).append('<svg viewBox="15 15 70 70">' + svgTable[infoWeatherIcons][data.list[i].weather[0].icon] + '</svg>');
                                                //$('#justify' + i + '> p').remove();
                                                $('#justify' + i).append("<span id='forecastTemp'><b>" + data.list[i].main.temp.toFixed(1) + '</b>°</span>');
					}
				});
			}, 300);
		}).error(function(data) {console.log('error: ' + data)});
	}
	
}

Date.prototype.getJulian = function() {
    return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
};


function moon_day(today) {
    console.log('                    '+moment()+'                    '+'**Modul Info: moon_day()');
    var GetFrac = function(fr) {
        return (fr - Math.floor(fr));
    };
    var thisJD = today.getJulian();
    var year = today.getFullYear();
    var degToRad = 3.14159265 / 180;
    var K0, T, T2, T3, J0, F0, M0, M1, B1, oldJ;
    K0 = Math.floor((year - 1900) * 12.3685);
    T = (year - 1899.5) / 100;
    T2 = T * T;
    T3 = T * T * T;
    J0 = 2415020 + 29 * K0;
    F0 = 0.0001178 * T2 - 0.000000155 * T3 + (0.75933 + 0.53058868 * K0) - (0.000837 * T + 0.000335 * T2);
    M0 = 360 * (GetFrac(K0 * 0.08084821133)) + 359.2242 - 0.0000333 * T2 - 0.00000347 * T3;
    M1 = 360 * (GetFrac(K0 * 0.07171366128)) + 306.0253 + 0.0107306 * T2 + 0.00001236 * T3;
    B1 = 360 * (GetFrac(K0 * 0.08519585128)) + 21.2964 - (0.0016528 * T2) - (0.00000239 * T3);
    var phase = 0;
    var jday = 0;
    while (jday < thisJD) {
        var F = F0 + 1.530588 * phase;
        var M5 = (M0 + phase * 29.10535608) * degToRad;
        var M6 = (M1 + phase * 385.81691806) * degToRad;
        var B6 = (B1 + phase * 390.67050646) * degToRad;
        F -= 0.4068 * Math.sin(M6) + (0.1734 - 0.000393 * T) * Math.sin(M5);
        F += 0.0161 * Math.sin(2 * M6) + 0.0104 * Math.sin(2 * B6);
        F -= 0.0074 * Math.sin(M5 - M6) - 0.0051 * Math.sin(M5 + M6);
        F += 0.0021 * Math.sin(2 * M5) + 0.0010 * Math.sin(2 * B6 - M6);
        F += 0.5 / 1440;
        oldJ = jday;
        jday = J0 + 28 * phase + Math.floor(F);
        phase++;
    }

    // 29.53059 days per lunar month
    return (((thisJD - oldJ) / 29.53059));
}

function phase_junk(phase) {
    var sweep = [];
    var mag;
    if (phase <= 0.25) {
        sweep = [ 1, 0 ];
        mag = 20 - 20 * phase * 4
    } else 
    if (phase <= 0.50) { 
        sweep = [ 0, 0 ];
        mag = 20 * (phase - 0.25) * 4
    } else
    if (phase <= 0.75) {
        sweep = [ 1, 1 ];
        mag = 20 - 20 * (phase - 0.50) * 4
    } else
    if (phase <= 1) {
        sweep = [ 0, 1 ];
        mag = 20 * (phase - 0.75) * 4
    } else { 
        return; 
    }
    var d = "m100,0 ";
    d = d + "a" + mag + ",20 0 1," + sweep[0] + " 0,150 ";
    d = d + "a20,20 0 1," + sweep[1] + " 0,-150";
    
    $('#moon').remove();
    $('.infomodule__weather').prepend('<svg version="1.1" id="moon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" ' + 
    	    'width="28px" height="28px" viewBox="0 -23 200 200"  xml:space="preserve"><path d="' + d + '"></path></svg>'); 
}


function updateMoon() {
	console.log('                    '+moment().add(6 * 3600, 'seconds').format('lll:ss') + 'update moon');
	date = new Date();
	var bluemoon = new Date( 96, 1, 3, 16, 15, 0 )
	lunarperiod = 29 * ( 24 * 3600 * 1000 ) + 12 * ( 3600 * 1000 ) + 44.05 * ( 60 * 1000 ),
	phasetime = ( date.getTime() - bluemoon.getTime() ) % lunarperiod,
	fullmoon = lunarperiod - phasetime;
	fullmoondate= moment().add(fullmoon, 'milliseconds').format('L');
	$('#infomodule__fullmoondate').text(fullmoondate.substr(0, 6));
	var phase = moon_day(new Date());
	phase_junk(phase);
	
	window.setTimeout(function() {
		updateMoon();
	}, 3600000);
}

var svgTable = {};
<?php 
include('svg/weatherSVGs'); 
include('svg/staticWeatherSVGs');
?>
