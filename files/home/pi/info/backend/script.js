$('input[value=""]').addClass('error');

$('#timeFormat').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'timeformat', 'value' : $('#timeFormat').val()})
		.done(function() {
			$('#ok').show(30, function() {
				$(this).hide('slow');
			});
		});
});

$('#info_temperatureUnit').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'info_temperatureUnit', 'value' : $('#info_temperatureUnit').val()})
		.done(function() {
			$('#ok').show(30, function() {
				$(this).hide('slow');
			});
		});
});

$('#animatedWeatherIconsInfo').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'info_weatherIcons', 'value' : $('#animatedWeatherIconsInfo').val()})
		.done(function() {
			$('#ok').show(30, function() {
				$(this).hide('slow');
			});
		});
});

$('#includeNetatmo').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'info_include_netatmo', 'value' : $('#includeNetatmo').val()})
		.done(function() {
			$('#ok').show(30, function() {
				$(this).hide('slow');
			});
		});
});
var owmApiKey = '<?php echo $owmApiKey;?>';
$('#owmApiKeyInfo').on('input',function() {
	var newApiKey = $(this).val();
	$('.validate_owmKey').show();
	$('.invalid_owmKey').hide();
	if(newApiKey.length > 0) {
		elem = this;
		$.ajax('http://api.openweathermap.org/data//2.5/weather?id=2911522&units=metric&lang=DE&APPID=' + newApiKey)
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

var cityInfoId = $('#cityInfoId').val();
var cityInfo = $('#cityInfo').val();

//$("#cityInfo").focus
$(document).ready(function() {
	$('.ui-autocomplete').css('position', 'fixed');
});

$("#cityInfo").autocomplete({
    source: "../wlanconfig/autocompleteCities.php",
    html: true,
    minLength: 2,
    appendTo: '#cityInfoDiv',
    change: changeCityInfo,
    select: changeCityInfo
});

function changeCityInfo(event, ui) {
	if(ui.item) {
    	if(cityInfoId != ui.item.id) {
    		$(this).val(ui.item.value);
    		$('#cityInfoId').val(ui.item.id);
    		cityInfoId = ui.item.id;
    		cityInfo = ui.item.value;
    		$.post('setConfigValueAjax.php', {'key': 'info_city', 'value' : cityInfoId})
    		.done(function() {
    			$('#ok').show(30, function() {
    				$(this).hide('slow');
    			});
    		});
    	}
    } else {
    	$(this).val(cityInfo);
		$('#cityInfoId').val(cityInfoId);
    }
}

function animateInfoPencil() {
	if(owmApiKey.length < 1) {
		$('.module__edit[data-open="gr-modal-info"]').animateRotate(0, 20,100,'linear',
	    	    function() { $('.module__edit[data-open="gr-modal-info"]').animateRotate(20, 0,100,'linear',
	    	    	   function() { $('.module__edit[data-open="gr-modal-info"]').animateRotate(0, 20,100,'linear',
	    	    	    	   function() { $('.module__edit[data-open="gr-modal-info"]').animateRotate(20, 0,100,'linear')}
	    	    	   )}
		    	 )}
		   	);
	}
};

setInterval(function() {animateInfoPencil()}, 1500);
