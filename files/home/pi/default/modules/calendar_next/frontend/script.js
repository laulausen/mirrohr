<?php
$timeformat = getConfigValue('timeformat');
?>
var hoursFormat = (<?php echo $timeformat;?> == 12 ? 'hh' : 'HH');

var calendar_next_style = '';
$('document').ready(function() {
	if($("#calendar_next_table").parent().hasClass('module__fullwidth')) {
		calendar_next_style = ' style="width:' + $("#calendar_next_table").width() * 0.075 + 'px;"';
	}
	
	updateNextCalendar();
	
	window.setInterval(function(){
		updateNextCalendar();
	}, 300000);
});

function updateNextCalendar() {
	$.ajax({
		dataType: "json",
		url: '../modules/calendar_next/assets/getCalendars.php'
	}).done(function(data) {
		html = '';	
		if(data != null) {
			var lastDate = "";
			var lines = 0;
			$.each(data, function( date, events ){
				$.each(events, function(eventId, event) {
					if(lines > 4) return false;
					lines++;
					html += '<tr><td' + calendar_next_style+ '>';
					if(lastDate != date) {
						lastDate = date;
						if(moment(date, 'DD.MM.YYYY').subtract(2, 'days').isBefore(moment(), 'day')) {
							html += moment(date, 'DD.MM.YYYY').calendar().split(' ')[0];
						} else {
							html += moment(date, 'DD.MM.YYYY').format(moment.localeData().longDateFormat('L').replace(/Y/g,'').replace(/^\W|\W$|\W\W/,''));
						}
					}
					html += '</td><td>' + event.title;
					if(event.fulltime) {
						html += '</td><td><object data="../modules/calendar_next/assets/24-hours.svg" width="20" height="20"/></td></tr>';
					} else {
						html += '</td><td>' + moment(event.time, 'HH:mm').format(hoursFormat + ':mm') + '</td></tr>';
					}
				});
				if(lines > 4) return false;	
			});
		} else {
			html += '<tr><td><?php echo _('no events message'); ?></td></tr>';
		}
		$("#calendar_next_table").html(html);
	});

	now = new Date();
	console.log('next next calendar update: ' + moment().add(300, 'seconds').format('lll:ss'));
	
	
};
