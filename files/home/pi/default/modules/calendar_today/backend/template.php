<script src="../modules/calendar_today/assets/jquery-ui.min.js"></script>
<link href="../modules/calendar_today/assets/jquery-ui.min.css" rel="stylesheet">
<?php 
$calendarString = getConfigValue('calendar_today_calendars');

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
		setConfigValue('calendar_today_calendars', json_encode($calendarArray));
	}
}

foreach ($calendarArray as $calendarObject) { 
	if(strlen(trim($calendarObject['name'])) > 0) {
?>
            	<p style="border: 1px solid #ddd; height: 35px;">
            		<button class="calendar_today__edit">
            			<span class="fi-pencil"></span>
            		</button>
            		<span class="calendar_today"><?php echo trim($calendarObject['name']); ?></span> <span class="parent_calendar_today_timeShift">(<span class="calendar_today_timeShift"><?php echo trim($calendarObject['timeShift']); ?></span>h)</span>
            		<button class="calendar_today__delete">
            			<span class="fi-trash"></span>
            		</button>
            	</p>
<?php }
} ?> 
			<div class="row">
				<input type="text" id="new_calendar_today" placeholder="<?php echo _('calendar url input');?>"/>
            		<input id="new_calendar_today_timeShift"/>
			</div>
			<div style="height:0;">
 				<div class="validate" id="validate_calendar_today"><?php echo _('validate');?></div>
				<div class="validate" id="invalid_calendar_today"><?php echo _('invalid calendar url');?></div>
			</div>
			<div class="block__add button" id="calendar_today__add" style="display: none">
				<button class="calendar_today__add--button" aria-label="plus button">
					<span><?php echo _('add');?></span>
                </button>
            </div>
            <div class="block__add button" id="calendar_today__validate" style="display: none">
            		<button class="calendar_today__validate--button">
                    	<div class="loading__button--inner"></div>
                </button>
            </div>
            <div>
                <?php echo _('calendar tutorial link') . ' <i>' . _('calendar example') . '</i>';?>
            </div>
