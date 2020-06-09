<script src="../modules/calendar_next/assets/jquery-ui.min.js"></script>
<link href="../modules/calendar_next/assets/jquery-ui.min.css" rel="stylesheet">
<?php 
$calendar_next_showToday = getConfigValue('calendar_next_showToday');
if(empty($calendar_next_showToday)) {
	$calendar_next_showToday = 0;
}
if($calendar_next_showToday) {
	$calendar_next_showTodayInput = "checked";
} else {
	$calendar_next_showTodayInput = "";
}
?>

<input type="checkbox" name="calendar_next_showToday" id="calendar_next_showToday" <?php echo $calendar_next_showTodayInput;?>><label for="calendar_next_showToday"><?php echo _('show today');?></label>

<?php
$calendarString = getConfigValue('calendar_next_calendars');

$calendarArray = [];
if(empty($calendarString)) {
	$calendarArray[0]['name'] = 'https://calendar.google.com/calendar/ical/de.german%23holiday%40group.v.calendar.google.com/public/basic.ics';
	$calendarArray[0]['timeShift'] = '+0';
} else {
	$calendarArray = json_decode($calendarString, true);
	if(is_null($calendarArray)) {
		$calendars = explode(",", $calendarString);
		foreach($calendars as $idx => $calendar) {
			$calendarArray[$idx]['name'] = $calendar;
			$calendarArray[$idx]['timeShift'] = '+0';
		}
		setConfigValue('calendar_next_calendars', json_encode($calendarArray));
	}
}

foreach ($calendarArray as $calendarObject) { 
	if(strlen(trim($calendarObject['name'])) > 0) {
?>
            	<p style="border: 1px solid #ddd; height: 35px;">
            		<button class="calendar_next__edit">
            			<span class="fi-pencil"></span>
            		</button>
            		<span class="calendar_next"><?php echo trim($calendarObject['name']); ?></span> <span class="parent_calendar_next_timeShift">(<span class="calendar_next_timeShift"><?php echo trim($calendarObject['timeShift']); ?></span>h)</span>
            		<button class="calendar_next__delete">
            			<span class="fi-trash"></span>
            		</button>
            	</p>
<?php }
} ?> 
            	<div class="row">
				<input type="text" id="new_calendar_next" placeholder="<?php echo _('calendar url input');?>"/>
				<input id="new_calendar_next_timeShift"/>
            	</div>
            	<div style="height:0;">
            		<div class="validate" id="validate_calendar_next"><?php echo _('validate');?></div>
            		<div class="validate" id="invalid_calendar_next"><?php echo _('invalid calendar url');?></div>
            	</div>
            	<div class="block__add button" id="calendar_next__add" style="display: none">
                	<button class="calendar_next__add--button" aria-label="plus button">
                    	<span><?php echo _('add');?></span>
				</button>
			</div>
			<div class="block__add button" id="calendar_next__validate" style="display: none">
                	<button class="calendar_next__validate--button">
                    <div class="loading__button--inner"></div>
				</button>
			</div>
			<div>
                <?php echo _('calendar tutorial link') . ' <i>' . _('calendar example') . '</i>';?>
			</div>
