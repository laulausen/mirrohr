var netatmo_url;

$(document).ready(function() {

	$.get("/modules/netatmo/assets/getAccessToken.php").done(function(access_token){
		url = "https://api.netatmo.com/api/getstationsdata";
		netatmo_url = url + "?" + "access_token" + "=" + access_token + "&get_favorites=true";
		setNetatmoValues();
	});
});

function setNetatmoValues(){
	$.ajax({url: netatmo_url }).done(function( content ) {

			stations = content.body.devices;
			config = $.parseJSON('<?php echo getConfigValue('netatmo_config'); ?>');
			station = config["id"];
			base = null;

			// Selecting station from available stations (own + favorites) based on selected station
			$.each(stations, function(index, el) { if (el["_id"] == station){	base = el; }	});

			if (config.modules.length != 0){
				if (base != null) {

					station_name = base.station_name;
					modules = base.modules;

					// adding base station to the modules array
					modules.push(base);

					$.each(modules, function(index, el) {
						type = el.type;

						// Aussenmodul
						if (type == "NAModule1") {
							outdoor_pressure = base.dashboard_data.Pressure;
							outdoor_temperature = el.dashboard_data.Temperature;
							outdoor_humidity = el.dashboard_data.Humidity;
							min_temperature = el.dashboard_data.min_temp;
							max_temperature = el.dashboard_data.max_temp;

							// akt. Temp -> akt. Temp Netatmo
							$(".infomodule__temperature span").text(outdoor_temperature + "°C");

							// Regenwahrscheinlichkeit -> Luftfeutigkeit aussen Netatmo
							$(".infomodule__rainprob").text(outdoor_humidity+ "%");
							<?php $icon_outdoor_humidity = str_replace(array("\r","\n"), "", file_get_contents("/var/www/html/modules/netatmo/assets/icons/NAModule3/luftfeuchtigkeit2.svg")); ?>
							$("#umbrella").after('<span style="margin-left: 10px"><?php echo $icon_outdoor_humidity; ?><span>');
							$("#umbrella").remove();

							// Windgeschwindigkeit -> Luftdruck aussen Netatmo
							$(".infomodule__wind").text(outdoor_pressure + " mbar");
							<?php $icon_outdoor_pressure = str_replace(array("\r","\n"), "", file_get_contents("/var/www/html/modules/netatmo/assets/icons/barometer.svg")); ?>
							$("#windpath").after('<span style="margin-left: 10px"><?php echo $icon_outdoor_pressure; ?><span>');
							$("#windpath").remove();

							// min. Temp -> min. Temp Netatmo
							$(".infomodule__today--right span:first b").text(min_temperature + "°C");

							// max. Temp -> max. Temp Netatmo
							$(".infomodule__today--right span:last b").text(max_temperature + "°C");
						}

						// Windmodul
						if (type == "NAModule2") { }

						// Regenmodul
						if (type == "NAModule3") {
							last_hour = el.dashboard_data.sum_rain_1;

							// akt. Wetterzustand -> akt. Wetterzustand Netatmo
							if (last_hour != 0){
								$(".infomodule__temperature svg").remove();
								$(".infomodule__temperature").prepend('<svg viewBox="25 25 60 60">' + svgTable[infoWeatherIcons]['10d'] + '</svg>');
							}
						}

						// Zusätzliches Innenmodul und Basisstation
						if (type == "NAModule4" || type == "NAMain") { }
					});
				}
			}
	}).fail(function(content){
		error = content.responseJSON["error"]["message"];
		console.log("Error " + content.status + ": " + error);

		$.get("/modules/netatmo/assets/getNewAccessToken.php");
		//location.reload();
	});

	window.setTimeout(function() {
		setNetatmoValues();
	}, 60000);
}
