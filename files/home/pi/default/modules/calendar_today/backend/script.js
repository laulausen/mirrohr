$(document).ready(function() {
	var style = $('<style>.calendar_today { max-width: ' + Math.min(455, $(document).width() - 154)  + 'px; }</style>');
	$('html > head').append(style);
	var spinner = $('#new_calendar_today_timeShift').spinner({
		min: -12, 
		max: 12,
		spin: function(data) {
			setTimeout(function () {
				if(parseInt(spinner.val()) > -1) {
					spinner.val('+' + spinner.val());
				}	
			});		
		}
	});
	spinner.val('+0');
	$('#new_calendar_today').css('width', Math.min(492, $(document).width() - 129)  + 'px');
});


var validatingCalendar = false;

function validateTodayCalendar() {
	if(!validatingCalendar) {
		$('#calendar_today__validate').show();
		$('#calendar_today__add').hide();
		$('#new_calendar_today').prop('readonly', true);
		$('#validate_calendar_today').show();
		$('#invalid_calendar_today').hide();
		validatingCalendar = true;
		var calendar = $('#new_calendar_today').val().trim();
    		if(calendar.length > 0) {  
		    $.post("../modules/calendar_today/assets/isCalendar.php", {url: calendar})
			.done(function(data) {
				$('#calendar_today__validate').hide();
				$('#validate_calendar_today').hide();
				
				if(data == '1') {
					calendarTodayAdd();
				} else {
					$('#new_calendar_today').addClass('error');
					$('#new_calendar_today').prop('readonly', false);
					$('#invalid_calendar_today').show();
				} 
			})
			.complete(function() {
				validatingCalendar = false;
			});
	    	} else {
	    		$('#validate_calendar_today').hide();
	    	}
	}
};

$('#calendar_today__add').click(validateTodayCalendar);

$('#new_calendar_today').on('input', function() {
	$('#calendar_today__add').hide();
	$('#calendar_today__validate').hide();
	var calendar = $('#new_calendar_today').val().trim();
    	if(calendar.length > 0) {  
    		$('#calendar_today__add').show();
    	}  		
});

function writeTodayCalendars() {
	$.post('setConfigValueAjax.php', {'key' : 'calendar_today_calendars', 'value' : JSON.stringify(prepareCalendarTodayData())})
	.done(function() { 
		$('#ok').show(30, function() {
			$(this).hide('slow');
		});
		$('#new_calendar_today').prop('readonly', false);
	});
};

function prepareCalendarTodayData() {
	data = [];
	$(".calendar_today").each(function(i, element){ 
		data[i] = {};
		data[i]['name'] = $(element).text();
		data[i]['timeShift'] = $('.calendar_today_timeShift').eq(i).text();
	});
	return data;
};

function calendarTodayAdd() {
	$('#new_calendar_today').before('<p style="border: 1px solid #ddd; height: 35px;">' + 
			'	<button class="calendar_today__edit">' +
			'	<span class="fi-pencil"></span></button>' +
			'	<span class="calendar_today">' + $('#new_calendar_today').val().trim() + '</span>' +
			' 	<span class="parent_calendar_today_timeShift"> (<span class="calendar_today_timeShift">' + $('#new_calendar_today_timeShift').val() + '</span>h)</span>' +
			'	<button style="position: absolute; right: 30px;" class="calendar_today__delete" href="#">' +
			'	<span class="fi-trash"></span></button></p>');

	$('#new_calendar_today').val('');
	$('#new_calendar_today_timeShift').spinner('value', 0);
	$('#calendar_today__add').hide('fast');
	writeTodayCalendars();	
};

$(document).on('click', '.calendar_today__delete', function() {
    $(this).parent().hide('fast', function() {
	    $(this).remove();
	    writeTodayCalendars();
	});  
});

$(document).on('click', '.calendar_today__edit', function() {
	$('#new_calendar_today').val($(this).siblings('.calendar_today').text());
	$('#new_calendar_today').trigger('input');
	var timeShift = $(this).siblings('.parent_calendar_today_timeShift').children('.calendar_today_timeShift').text().toString();
	$('#new_calendar_today_timeShift').spinner('value', timeShift);
    $(this).parent().hide('fast', function() {
	    $(this).remove();
	});  
});