<?php
$timeformat = getConfigValue('timeformat');
$calendarString = getConfigValue('calendar_week_calendars');

$calendars = [];
if(empty($calendarString)) {
	$calendars[0]['name'] = 'https://calendar.google.com/calendar/ical/de.german%23holiday%40group.v.calendar.google.com/public/basic.ics';
	$calendars[0]['timeShift'] = 0;
	$calendars[0]['label'] = 'default';
} else {
	$calendars = json_decode($calendarString, true);
}

$labels = [];
foreach($calendars as $calendar) {
	if(!in_array($calendar['label'], $labels)) {
		$labels[] = $calendar['label'];
	}
}

?>
String.prototype.hashCode = function() {
	var hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

var labels = <?php echo json_encode($labels);?>;
var hoursFormat = (<?php echo $timeformat;?> == 12 ? 'hh' : 'HH');

$('document').ready(function() {	
	updateWeekCalendar();
});

function updateWeekCalendar() {
	$.ajax({
		dataType: "json",
		url: '../modules/calendar_week/assets/getCalendars.php'
	}).done(function(data) {
		var tdwidth = (parseInt($('#calendar_week_table').width()) - 60) / labels.length; 
		
		html = '<tr><td></td>';
		for(head = 0; head < labels.length; head++) {
			html += '<td style="min-width: ' + tdwidth + 'px; max-width: ' + tdwidth + 'px">' + labels[head] + '</td>';
		}
		html += '</tr>';
		
		for(row = 0; row < 5; row++) {
			html += '<tr><td>' + moment().add(row, 'days').format('dd') + '</td>';
			for(col = 0; col < labels.length; col++) {
				html += '<td class="content" style="min-width: ' + tdwidth + 'px; max-width: ' + tdwidth + 'px" id="table_calendar_week_' + labels[col].hashCode() + '_' + row + '"></td>';
			}
			html += '</tr>';
		}


		$("#calendar_week_table").html(html);
		if(data != null) {
			$.each(data, function( date, events ){
				deltaDays = moment.unix(date).diff(moment().startOf('day'), 'days');
				for(eventcount = 0; eventcount < events.length; eventcount ++) {
					nodeToInsert = $('#table_calendar_week_' + events[eventcount].label.hashCode() + '_' + deltaDays);
					insertPrefix = ''
					if(nodeToInsert.html().length) {
						insertPrefix = nodeToInsert.html() + ', ';
					}
					if(events[eventcount].fulltime) {
						nodeToInsert.html(insertPrefix + '<object data="../modules/calendar_week/assets/24-hours.svg" width="20" height="20"/> ' + events[eventcount].name);
					} else {
						nodeToInsert.html(insertPrefix + moment.unix(date).format(hoursFormat + ':mm') + ' ' + events[eventcount].name);
					}
				}
					  
			});
		}

	});

	now = new Date();
	console.log('next week calendar update: ' + moment().add(300, 'seconds').format('lll:ss'));
	
	window.setTimeout(function(){
		updateWeekCalendar();
	}, 300000);
};
