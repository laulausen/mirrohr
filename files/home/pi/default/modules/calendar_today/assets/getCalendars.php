<?php
	include('../../../config/glancrConfig.php');
	$calendarString = getConfigValue('calendar_today_calendars');
	if(empty($calendarString)) {
		$calendars[0]['name'] = 'https://calendar.google.com/calendar/ical/de.german%23holiday%40group.v.calendar.google.com/public/basic.ics';
		$calendars[0]['timeShift'] = 0;
	} else {
		$calendars = json_decode($calendarString, true);
		if(is_null($calendars)) {
			$calendars = explode(",", $calendarString);
			foreach($calendars as $idx => $calendar) {
				$calendars[$idx]['name'] = $calendar;
				$calendars[$idx]['timeShift'] = 0;
			}
			setConfigValue('calendar_today_calendars', json_encode($calendars));
		}
	}
	
	echo json_encode(parseCalendars(get_calendar_by_urls($calendars)) );
	
	function get_calendar_by_urls($someCalendars) {
		$content="";
		// user	agent is very necessary, otherwise some	websites like google.com wont give zipped content
		$opts =	array(
			'http'=>array(
				'method'=>"GET",
				'header'=>"Accept-Language:	de-DE,de;q=0.8rn" .
//							"Accept-Encoding: gzip,deflate,sdchrn" .
							"Accept-Charset:UTF-8,*;q=0.5rn" .
							"User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:19.0) Gecko/20100101 Firefox/19.0 FirePHP/0.4rn",
				"ignore_errors"	=> true		//Fix problems getting data
			),
			//Fixes	problems in	ssl	
			"ssl" => array(
				"verify_peer"=>false,
				"verify_peer_name"=>false
			)
		);
		
		$context = stream_context_create($opts);
		
		foreach($someCalendars as $cal)	{  
			$precontent =	file_get_contents($cal['name'] ,false,$context); 

            //If http response header mentions that content is gzipped, then uncompress it
		    foreach($http_response_header as $c => $h) {
		        if(stristr($h, 'content-encoding') and stristr($h, 'gzip')) {
		            //Now lets uncompress the compressed data
		            $precontent = gzinflate(substr($precontent,10,-8) );
		        }
		    }
	       
	        $content .=	timeShift($precontent, $cal['timeShift']);
		}
		
		return $content;
	}
	
	function timeShift($calendars, $timeShift) {
		if($timeShift == 0) {
			return $calendars;
		} else {
			$calendarRows = explode("\n", $calendars);
			foreach($calendarRows as $rowNr => $calendarRow) {
				if(strpos(trim($calendarRow), 'DTSTART') === 0 || strpos(trim($calendarRow), 'DTEND') === 0) {
					$parts = explode(':', $calendarRow);
					if(sizeof($parts) > 1) {
						$date = trim($parts[1]);
						$dateParts = explode('T', $date);
						if(sizeof($dateParts) > 1) {
							$newDate = strtotime(substr($date,6,2) . '-' . substr($date,4,2) . '-' . substr($date,0,4) .
									' ' . substr($date,9,2) . ':' . substr($date,11,2) . ':' . substr($date,13,2) . ' +' .
									$timeShift . ' hours');
							$calendarRows[$rowNr] = $parts[0] . ':' . date('Ymd', $newDate) . 'T' . date('His', $newDate) . substr($date, 15);
						}
					}
				} else if(strpos(trim($calendarRow), 'RRULE') === 0) {
					$parts = explode('UNTIL=', $calendarRow);
					if(sizeof($parts) > 1) {
						$date = trim($parts[1]);
						if(substr($date, 8, 1) == 'T') {
							$newDate = strtotime(substr($date,6,2) . '-' . substr($date,4,2) . '-' . substr($date,0,4) .
									' ' . substr($date,9,2) . ':' . substr($date,11,2) . ':' . substr($date,13,2) . ' +' .
									$timeShift . ' hours');
							$calendarRows[$rowNr] = $parts[0] . 'UNTIL=' . date('Ymd', $newDate) . 'T' . date('His', $newDate) . substr($date, 15);
						}
					}
				}
			}
			return implode("\n", $calendarRows);
		}
	}
	
	function parseCalendars($calendars) {
		$calendarRows = explode("\n", $calendars);

		$isToday = false;
		$isInFuture = false;
		$isFullTime = false;
		$event = [];
		
		foreach($calendarRows As $rowNr => $calendarRow) {
			if(strpos(trim($calendarRow), 'SUMMARY') === 0) {
				$parts = explode(':', $calendarRow);
				unset($parts[0]);
				$event['title'] = trim(implode(':',$parts));
				
			} else if(strpos(trim($calendarRow), 'DTSTART') === 0) {
				$parts = explode(':', $calendarRow);
				$event['start'] = trim($parts[1]);
							
			} else if(strpos(trim($calendarRow), 'DTEND') === 0) {
				$parts = explode(':', $calendarRow);
				$event['end'] = trim($parts[1]);
				
			} else if(strpos(trim($calendarRow), 'RRULE') === 0) {
				$parts = explode(':', $calendarRow);
				$event['rrule'] = trim($parts[1]);
				
			} else if(strpos(trim($calendarRow), 'RDATE') === 0) {
				$parts = explode(':', $calendarRow);
				$event['rdate'][] = trim($parts[1]);
				
			} else if(strpos(trim($calendarRow), 'END') === 0) {
				if(isset($event['title'])) {
					$startDateParts = explode('T', $event['start']);
					if(sizeof($startDateParts) == 1) {
						$isFullTime = true;
					}
					
					if(isset($event['rrule'])) {
						$tempParts = explode(';', $event['rrule']);
						$rrulePart = [];
						foreach ($tempParts as $tempPart) {
							$temp2Parts = explode('=', $tempPart);
							$rrulePart[$temp2Parts[0]] = $temp2Parts[1];
						}
						if($rrulePart['FREQ'] == 'DAILY') {
							$interval = 'DAY';
						} else {
							$interval = substr($rrulePart['FREQ'], 0, -2);
						}
						$lastTimeInterval = $interval;
						
						if(isset($rrulePart['INTERVAL'])) {
							$count = $rrulePart['INTERVAL'];
						} else {
							$count = 1;
						}
						
						if($count > 1) {
							$interval .= 'S';
						}
						$until = -1;
						if(isset($rrulePart['UNTIL'])) {
							$until = strtotime(substr($rrulePart['UNTIL'],6,2) . '-' . substr($rrulePart['UNTIL'],4,2) . '-' . substr($rrulePart['UNTIL'],0,4) . 
									' ' . substr($rrulePart['UNTIL'],9,2) . ':' . substr($rrulePart['UNTIL'],11,2) . ':' . substr($rrulePart['UNTIL'],13,2));
						}
						if(isset($rrulePart['COUNT'])) {
							if(isset($rrulePart['INTERVAL'])) {
								$lastTime = $rrulePart['COUNT'] * $rrulePart['INTERVAL'];
							} else {
								$lastTime = $rrulePart['COUNT'];
							}
								
							if($lastTime > 1) {
								$lastTimeInterval .= 'S';
							}
							
							if(strlen($event['start']) > 10) {
								$timeOffset = substr($event['start'],9,2) * 3600 + substr($event['start'],11,2) * 60 + substr($event['start'],13,2);
							} else {
								$timeOffset = 0;
							}
							
							$until = strtotime(substr($event['start'],6,2) . '-' . substr($event['start'],4,2) . '-' . substr($event['start'],0,4) . 
									' +' . $lastTime . ' ' . $lastTimeInterval) + $timeOffset;
						} 
						if(time() < $until || $until == -1) {
							$compareDate = time();
							if($isFullTime) {
								for($i = 0; $i < 5; $i++) {
									if(isset($event['end'])) {
										$endDate = strtotime(substr($event['end'],6,2) . '-' . substr($event['end'],4,2) . '-' . substr($event['end'],0,4));
									} else {
										$endDate = strtotime(substr($event['start'],6,2) . '-' . substr($event['start'],4,2) . '-' . substr($event['start'],0,4) . ' +1 day');
									}
									while($endDate <= $compareDate) {
										$endDate = strtotime("+$count $interval", $endDate);
									}
									if($endDate <= $until || $until == -1) {
										$startDate = strtotime(substr($event['start'],6,2) . '-' . substr($event['start'],4,2) . '-' . substr($event['start'],0,4));
										
										while($startDate < $endDate) {
											$newStartDate = $startDate;
											$startDate = strtotime("+$count $interval", $startDate);
										}
										$startDate = $newStartDate;
										while($startDate < $endDate) {
											if(date('Ymd', $startDate) == date('Ymd')) {
												$today['fulltime'][] = $event['title'];
											} 
											$startDate = strtotime('+1 day', $startDate);
										}
									} else {
										break;
									}
									$compareDate = $endDate;
								}
							} else {
								for($i = 0; $i < 5; $i++) {
									$startDate = mktime(substr($event['start'],9,2), substr($event['start'],11,2), substr($event['start'],13,2),
										substr($event['start'],4,2), substr($event['start'],6,2), substr($event['start'],0,4));
									while($startDate <= $compareDate) {
										$startDate = strtotime("+$count $interval", $startDate);									
									}
									if($startDate <= $until || $until == -1) {
										if(date('Ymd', $startDate) == date('Ymd')) {
											$today['events'][$startDate][] = $event['title'];
										} 
									} else {
										break;
									} 
									$compareDate = $startDate;
								}
							}
						}
					} /*else if(isset($event['rdate'])) {
						// todo...
					}*/ else {
						if($isFullTime) {
							// schon vorbei?
							if(isset($event['end'])) {
								$endDate = strtotime(substr($event['end'],6,2) . '-' . substr($event['end'],4,2) . '-' . substr($event['end'],0,4));
							} else {
								$endDate = strtotime(substr($event['start'],6,2) . '-' . substr($event['start'],4,2) . '-' . substr($event['start'],0,4) . ' +1 day');
							}
							if($endDate	> time()) {
								$date = strtotime(substr($event['start'],6,2) . '-' . substr($event['start'],4,2) . '-' . substr($event['start'],0,4));
								while($date < $endDate) {
									if(date('Ymd', $date) == date('Ymd')) {
										$today['fulltime'][] = $event['title'];
									} 
									$date = strtotime('+1 day', $date);
								}			
							}
						} else {
							// schon vorbei?
							$startDateTstamp = mktime(substr($event['start'],9,2), substr($event['start'],11,2), substr($event['start'],13,2), 
									substr($event['start'],4,2), substr($event['start'],6,2), substr($event['start'],0,4));
							if($startDateTstamp > time()) {
								if(substr($event['start'],0,8) == date('Ymd')) {
									$today['events'][$startDateTstamp][] = $event['title'];
								} 
							}
						}
					}
				}
				$isFullTime = false;
				$event = [];
			} 
			
		}
		
		if(isset($today)) {
			if(array_key_exists('events', $today)) {
				ksort($today['events']);
			}
			return $today;
		} else {
			return null;
		}
	}
	
	
?>