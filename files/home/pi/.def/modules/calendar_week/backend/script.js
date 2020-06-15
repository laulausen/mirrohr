$(document).ready(function() {
	var style = $('<style>.calendar_week { max-width: ' + Math.min(455, $(document).width() - 154)  + 'px; }</style>');
	$('html > head').append(style);
	var spinner = $('#new_calendar_week_timeShift').spinner({
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
	$('#new_calendar_week').css('width', Math.min(492, $(document).width() - 129)  + 'px');
});


var validatingCalendar = false;

function validateWeekCalendar() {
	if(!validatingCalendar) {
		$('#calendar_week__validate').show();
		$('#calendar_week__add').hide();
		$('#new_calendar_week').prop('readonly', true);
		$('#new_calendar_week_label').prop('readonly', true);
		validatingCalendar = true;
		var calendar = $('#new_calendar_week').val().trim();
		if(calendar.length > 0) {  
		    $.post("../modules/calendar_week/assets/isCalendar.php", {url: calendar})
			.done(function(data) {
				$('#calendar_week__validate').hide();
				$('#calendar_week__add').show();
				
				if(data == '1') {
					calendarWeekAdd();
				} else {
					$('#invalid_calendar_week').show();
					$('#new_calendar_week').addClass('error');
					$('#new_calendar_week').prop('readonly', false);
					$('#new_calendar_week_label').prop('readonly', false);
				} 
			})
			.complete(function() {
				validatingCalendar = false;
			});
	    	} else {
	    		$('#validate_calendar_week').hide();
	    	}
	}
};

$('#calendar_week__add').click(validateWeekCalendar);

$('#new_calendar_week').on('input', function() {
	$('#invalid_calendar_week').hide();
	
	$('#calendar_week__add').hide();
	$('#calendar_week__validate').hide();
	
	var calendar = $('#new_calendar_week').val().trim();
    
	if(calendar.length > 0) {  
    	$('#calendar_week__add').show();
    }  		
});

$('#new_calendar_week_label').on('input', function() {
	$('#calendar_week_label_required').hide();
	$('#max_calendar_week_cats_exeeded').hide();
});
	
function writeWeekCalendars() {
	$('.calendar_week_category :hidden').remove();
	$('.calendar_week_entry :hidden').remove();
	$(".calendar_week_category:not(:has(.calendar_week_entry))").remove();
	$.post('setConfigValueAjax.php', {'key' : 'calendar_week_calendars', 'value' : JSON.stringify(prepareCalendarWeekData())})
		.done(function() { 
			$('#ok').show(30, function() {
				$(this).hide('slow');
			});
			$('#new_calendar_week').prop('readonly', false);
			$('#new_calendar_week_label').prop('readonly', false);
		});
};

function prepareCalendarWeekData() {
	data = [];
	$(".calendar_week").each(function(i, element){ 
		data[i] = {};
		data[i]['label'] = $(element).parent().siblings(':first-child').text();
		data[i]['name'] = $(element).text();
		data[i]['timeShift'] = $('.calendar_week_timeShift').eq(i).text();
	});

	return data;
}

function calendarWeekAdd() {
	if($('#new_calendar_week_label').val().trim().length < 1 || ($('.calendar_week_category').length == 5 && !$('#calendar_week_' + $('#new_calendar_week_label').val()).length)) {
		if($('#new_calendar_week_label').val().trim().length < 1) { 
			$('#calendar_week_label_required').show();
		} else {
			$('#max_calendar_week_cats_exeeded').show();
		}
		
		$('#new_calendar_week_label').addClass('error');
		
		$('#new_calendar_week').prop('readonly', false);
		$('#new_calendar_week_label').prop('readonly', false);
		return;
	}
	
	var newEntry = '<p class="calendar_week_entry" data-toggle="tooltip" title="' + $('#new_calendar_week').val().trim() + '">' + 
	'	<button class="calendar_week__edit">' +
	'	<span class="fi-pencil"></span></button>' +
	'	<span class="calendar_week">' + $('#new_calendar_week').val().trim() + '</span>' +
	' 	<span class="parent_calendar_week_timeShift"> (<span class="calendar_week_timeShift">' + $('#new_calendar_week_timeShift').val() + '</span>h)</span>' +
	'	<button style="position: absolute; right: 30px;" class="calendar_week__delete" href="#">' +
	'	<span class="fi-trash"></span></button></p>';
	
	$('#calendar_week_' + $('#new_calendar_week_label').val() + ':hidden').parent().remove();
	if($('#calendar_week_' + $('#new_calendar_week_label').val()).length ) {
		$('#calendar_week_' + $('#new_calendar_week_label').val()).after(newEntry);
	} else {
		$('#new_calendar_week_label').before('<div class="calendar_week_category"><h5 id="calendar_week_' + $('#new_calendar_week_label').val() + '">' + $('#new_calendar_week_label').val() + '</h5>' + newEntry + '</div>');
	}

	$('#new_calendar_week').val('');
	$('#new_calendar_week_label').val('');
	$('#new_calendar_week_timeShift').spinner('value', 0);
	$('#calendar_week__add').hide('fast');
	writeWeekCalendars();	
};

$(document).on('click', '.calendar_week__delete', function() {
	$('div.calendar_week_category :hidden').parent().show();
	$('.calendar_week_entry :hidden').parent().show();
	$(this).parent().hide('fast', function() {
    	if($(this).siblings().length == 1) {
    		$(this).parent().remove();
    	} else {
    		$(this).remove();
    	}
	    writeWeekCalendars();
	});  
});

$(document).on('click', '.calendar_week__edit', function() {
	$('div.calendar_week_category :hidden').parent().show();
	$('.calendar_week_entry :hidden').parent().show();
	
//	console.log($('.calendar_week_category :hidden'));
	
	$('#new_calendar_week').val($(this).siblings('.calendar_week').text());
	$('#new_calendar_week').trigger('input');
	$('#new_calendar_week_label').val($(this).parent().siblings(':first-child').text());
	var timeShift = $(this).siblings('.parent_calendar_week_timeShift').children('.calendar_week_timeShift').text().toString();
	$('#new_calendar_week_timeShift').spinner('value', timeShift);
    $(this).parent().hide(0, function() {
	    	if($(this).siblings().length == 1) {
	    		$(this).parent().hide();
	    		
	    	}
//	    $(this).remove();
	});  
});