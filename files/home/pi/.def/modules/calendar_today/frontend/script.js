<?php
$timeformat = getConfigValue('timeformat');
?>
var hoursFormat = (<?php echo $timeformat;?> == 12 ? 'hh' : 'HH');
var eventStack = {};
var calendar_today_style = "";
$('document').ready(function() {
	if($("#calendar_today_table").parent().hasClass('module__fullwidth')) {
		calendar_today_style = 'style="width:' + $("#calendar_today_table").width() * 0.075 + 'px;" ';
	}
	
	updateTodayCalendar();
});

function updateTodayCalendar() {
	$.ajax({
		dataType: "json",
		url: '../modules/calendar_today/assets/getCalendars.php'
	}).done(function(data) {
		html = '';	
		eventStack = {};
		counter = 0;
		if(data != null) {
			if(data['fulltime'] != null) {
				html += '<tr><td ' + calendar_today_style + '><object data="../modules/calendar_today/assets/24-hours.svg" width="20" height="20"/></td><td>' + data['fulltime'].join(', ') + '</td></tr>' ;
				counter++;
			}
			if(data['events'] != null) {
				window.setTimeout(updateEvents, Object.keys(data['events'])[0] * 1000 - Date.now());
				$.each(data['events'], function( date, events ){
					if(counter < 4) {
						html += '<tr class="eventToday" id="' + date + '"><td ' + calendar_today_style + '>' + moment.unix(date).format(hoursFormat + ':mm') + '</td><td>' + events.join(', ') + '</td></tr>' ;
						counter++;
					} else {
						eventStack[date] = events;
					}			  
				});
			}
		} 
		if(counter == 0) {
			html += '<tr><td><?php echo _('no events message'); ?></td></tr>';
		}
		$("#calendar_today_table").html(html);

	});

	now = new Date();
	console.log('next today calendar update: ' + moment().add(300000, 'seconds').format('lll:ss'));
	
	window.setTimeout(function(){
		updateTodayCalendar();
	}, 300000);
};
function updateEvents() {
	$('.eventToday').first().hide('slow', function() { 
		$('.eventToday').first().remove();
		if($('.eventToday').length > 0) {
			nextDate = $('.eventToday:first').attr('id');
			window.setTimeout(updateEvents, nextDate * 1000 - Date.now());
			
			if(!$.isEmptyObject(eventStack)) {
				date = Object.keys(eventStack)[0];
				$('<tr class="eventToday" id="' + date + '"><td>' + moment.unix(date).format(hoursFormat + ':mm') + '</td><td>' + eventStack[date].join(', ') + '</td></tr>').hide().appendTo('#calendar_today_table').show('slow');
				delete eventStack[date];			
			}
		} else {
			$('<tr><td><?php echo _('no events message'); ?></td></tr>').hide().appendTo('#calendar_today_table').show('slow');
		}
			
	});
}