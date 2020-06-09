<script src="../modules/calendar_week/assets/jquery-ui.min.js"></script>
<link href="../modules/calendar_week/assets/jquery-ui.min.css" rel="stylesheet">
<?php 
$calendarString = getConfigValue('calendar_week_calendars');

$calendarArray = [];
if(empty($calendarString) || $calendarString == '[]') {
	$calendarArray[0]['name'] = 'https://calendar.google.com/calendar/ical/de.german%23holiday%40group.v.calendar.google.com/public/basic.ics';
	$calendarArray[0]['timeShift'] = '+0';
	$calendarArray[0]['label'] = 'default';
} else {
    $calendarArray = json_decode($calendarString, true);
}

$calendarArraySorted = [];
foreach($calendarArray as $calendarObject) {
	$label = $calendarObject['label'];
	if(isset($counts[$label])) {
		$counts[$label] ++;
	} else {
		$counts[$label] = 0;
	}
	$calendarArraySorted[$label][$counts[$label]]['url'] = $calendarObject['name'];
	$calendarArraySorted[$label][$counts[$label]]['timeShift'] = $calendarObject['timeShift'];
}


foreach ($calendarArraySorted as $label => $calendarArray) { 
	echo '<div class="calendar_week_category"><h5 id="calendar_week_' . $label . '">' . $label . '</h5>';
	foreach($calendarArray as $calendarObject) {
		if(strlen(trim($calendarObject['url'])) > 0) {
?>
            	<p class="calendar_week_entry" data-toggle="tooltip" title="<?php echo trim($calendarObject['url']); ?>">
            		<button class="calendar_week__edit">
            			<span class="fi-pencil"></span>
            		</button>
            		<span class="calendar_week"><?php echo trim($calendarObject['url']); ?></span> <span class="parent_calendar_week_timeShift">(<span class="calendar_week_timeShift"><?php echo trim($calendarObject['timeShift']); ?></span>h)</span>
            		<button class="calendar_week__delete">
            			<span class="fi-trash"></span>
            		</button>
            	</p>
<?php 
		}
	}
	echo '</div>';
} ?> 
            	<div class="row">
            		<input type="text" id="new_calendar_week_label" placeholder="<?php echo _('calendar label input');?>"/>
  					<input type="text" id="new_calendar_week" placeholder="<?php echo _('calendar url input');?>"/>
            		<input id="new_calendar_week_timeShift"/>
            	</div>
            	<div style="height:0;">
            		<div class="validate" id="invalid_calendar_week"><?php echo _('invalid calendar url');?></div>
            		<div class="validate" id="max_calendar_week_cats_exeeded"><?php echo _('max calendar week categories exeeded');?></div>
            		<div class="validate" id="calendar_week_label_required"><?php echo _('required');?></div>
            	</div>
            	<div class="block__add button" id="calendar_week__add" style="display: none">
                	<button class="calendar_week__add--button" href="#" aria-label="plus button">
                    	<span><?php echo _('add');?></span>
                    </button>
                </div>
                <div class="block__add button" id="calendar_week__validate" style="display: none">
                	<button class="calendar_week__validate--button" href="#">
                    	<div class="loading__button--inner"></div>
                    </button>
                </div>
                <div>
                <?php echo _('calendar tutorial link') . ' <i>' . _('calendar example') . '</i>';?>
                </div>
