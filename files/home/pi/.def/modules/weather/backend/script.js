$('input[value=""]').addClass('error');
$('#animatedWeatherIconsWeather').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'weather_weatherIcons', 'value' : $('#animatedWeatherIconsWeather').val()})
		.done(function() { 
			$('#ok').show(30, function() {
				$(this).hide('slow');
			});	
		});
});
$('#weather_temperatureUnit').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'weather_temperatureUnit', 'value' : $('#weather_temperatureUnit').val()})
		.done(function() { 
			$('#ok').show(30, function() {
				$(this).hide('slow');
			});	
		});
});

$('#weather_showToday').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'weather_showToday', 'value' : $(this).is(':checked') ? 1 : 0})
	.done(function() { 
		$('#ok').show(30, function() {
			$(this).hide('slow');
		})
	});
});

  
var owmApiKey = '<?php echo $owmApiKey;?>';
$('#owmApiKeyWeather').on('input',function() {
	var newApiKey = $(this).val();
	$('.validate_owmKey').show();
	$('.invalid_owmKey').hide();
	if(newApiKey.length > 0) {
		elem = this;		
		$.get('http://api.openweathermap.org/data//2.5/weather?id=2911522&units=metric&lang=DE&APPID=' + newApiKey)
		.done(function(data) {
			$('.validate_owmKey').hide();
			if(typeof(data) == 'object') {
				$.post('setConfigValueAjax.php', {'key' : 'owmApiKey', 'value': newApiKey})
		 		.done(function(data) {
		 			owmApiKey = newApiKey;
	 				$('#ok').show(30, function() {
	 					$(this).hide('slow');				
	 				});
		 		});
			} else {
				$('.invalid_owmKey').show();
			} 
		})
		.error(function(data) {
			$('.validate_owmKey').hide();
			$('.invalid_owmKey').show();
		});
	} else {
		$('.validate_owmKey').hide();
	}
});

$('.owmApiKey').focusout(function() {
	$('.owmApiKey').val(owmApiKey);
	$('.invalid_owmKey').hide();
	$('input[value=""]').addClass('error');
});

var cityWeatherId = $('#cityWeatherId').val();
var cityWeather = $('#cityWeather').val();

$(document).ready(function() {
	$('.ui-autocomplete').css('position', 'fixed');
});

$("#cityWeather").autocomplete({
    source: "../wlanconfig/autocompleteCities.php",
    html: true, 
    minLength: 2,
    appendTo: '#cityWeatherDiv',
    change: changeCityWeather,
    select: changeCityWeather
});

function changeCityWeather(event, ui) {
	if(ui.item) {
    	if(cityWeatherId != ui.item.id) {
    		$(this).val(ui.item.value);
    		$('#cityWeatherId').val(ui.item.id);
    		cityWeatherId = ui.item.id;
    		cityWeather = ui.item.value;
    		$.post('setConfigValueAjax.php', {'key': 'weather_city', 'value' : cityWeatherId})
    		.done(function() { 
    			$('#ok').show(30, function() {
    				$(this).hide('slow');
    			});	
    		});
    	}
    } else {
    	$(this).val(cityWeather);
		$('#cityWeatherId').val(cityWeatherId);
    }
}

function animateWeatherPencil() {
	if(owmApiKey.length < 1) {
		$('.module__edit[data-open="gr-modal-weather"]').animateRotate(0, 20,100,'linear', 
	    	    function() { $('.module__edit[data-open="gr-modal-weather"]').animateRotate(20, 0,100,'linear', 
	    	    	   function() { $('.module__edit[data-open="gr-modal-weather"]').animateRotate(0, 20,100,'linear', 
	    	    	    	   function() { $('.module__edit[data-open="gr-modal-weather"]').animateRotate(20, 0,100,'linear')}
	    	    	   )}
		    	 )}
		   	);
	}
};

setInterval(function() {animateWeatherPencil()}, 1500);
