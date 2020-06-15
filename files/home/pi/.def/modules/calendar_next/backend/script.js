$(document).ready(function() {
	var style = $('<style>.calendar_next { max-width: ' + Math.min(455, $(document).width() - 154)  + 'px; }</style>');
	$('html > head').append(style);
	var spinner = $('#new_calendar_next_timeShift').spinner({
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
	$('#new_calendar_next').css('width', Math.min(492, $(document).width() - 129)  + 'px');
});

$('#calendar_next_showToday').change(function() {
	$.post('setConfigValueAjax.php', {'key' : 'calendar_next_showToday', 'value' : $(this).is(':checked') ? 1 : 0})
	.done(function() { 
		$('#ok').show(30, function() {
			$(this).hide('slow');
		})
	});
});

var validatingCalendar = false;

function validateNextCalendar() {
	if(!validatingCalendar) {
		$('#validate_calendar_next').show();
		$('#invalid_calendar_next').hide();
		validatingCalendar = true;
		$('#calendar_next__validate').show();
		$('#calendar_next__add').hide();
		$('#new_calendar_next').prop('readonly', true);
		var calendar = $('#new_calendar_next').val().trim();
		if(calendar.length > 0) {  
			$.post("../modules/calendar_next/assets/isCalendar.php", {url: calendar})
			.done(function(data) {
				$('#calendar_next__validate').hide();
				$('#validate_calendar_next').hide();
				
				if(data == '1') {
					calendarNextAdd();
				} else {
					$('#new_calendar_next').addClass('error');
					$('#new_calendar_next').prop('readonly', false);
					$('#invalid_calendar_next').show();
				} 
			})
			.complete(function() {
				validatingCalendar = false;				
			});
	    	} else {
	    		$('#validate_calendar_next').hide();
	    	}
	}
};

$('#calendar_next__add').click(validateNextCalendar);

$('#new_calendar_next').on('input', function() {
	$('#calendar_next__add').hide();
	$('#calendar_next__validate').hide();
	var calendar = $('#new_calendar_next').val().trim();
    	if(calendar.length > 0) {  
    		$('#calendar_next__add').show();
    	}  		
});

function writeNextCalendars() {
	$.post('setConfigValueAjax.php', {'key' : 'calendar_next_calendars', 'value' : JSON.stringify(prepareCalendarNextData())})
	.done(function() { 
		$('#ok').show(30, function() {
			$(this).hide('slow');
		});
		$('#new_calendar_next').prop('readonly', false);
	});
};

function prepareCalendarNextData() {
	data = [];
	$(".calendar_next").each(function(i, element){ 
		data[i] = {};
		data[i]['name'] = $(element).text();
		data[i]['timeShift'] = $('.calendar_next_timeShift').eq(i).text();
	});
	return data;
}

function calendarNextAdd() {
	$('#new_calendar_next').before('<p style="border: 1px solid #ddd; height: 35px;">' + 
			'	<button class="calendar_next__edit">' +
			'	<span class="fi-pencil"></span></button>' +
			'	<span class="calendar_next">' + $('#new_calendar_next').val().trim() + '</span>' +
			'	<span class="parent_calendar_next_timeShift"> (<span class="calendar_next_timeShift">' + $('#new_calendar_next_timeShift').val() + '</span>h)</span>' +
			'	<button class="calendar_next__delete" href="#">' +
			'	<span class="fi-trash"></span></button></p>');

	$('#new_calendar_next').val('');
	$('#new_calendar_next_timeShift').spinner('value', 0);
	$('#calendar_next__add').hide('fast');
	writeNextCalendars();	
};

$(document).on('click', '.calendar_next__delete', function() {
    $(this).parent().hide('fast', function() {
	    $(this).remove();
	    writeNextCalendars();
	});	  
});

$(document).on('click', '.calendar_next__edit', function() {
	$('#new_calendar_next').val($(this).siblings('.calendar_next').text());
	$('#new_calendar_next').trigger('input');
	var timeShift = $(this).siblings('.parent_calendar_next_timeShift').children('.calendar_next_timeShift').text().toString();
	$('#new_calendar_next_timeShift').spinner('value', timeShift);
    $(this).parent().hide('fast', function() {
	    $(this).remove();
	});  
});