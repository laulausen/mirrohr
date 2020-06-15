<?php
$ch = curl_init($_POST['url']);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_exec($ch);
$retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Apple iCloud responds to a HEAD request with 401 Not Authorized, even if the calendar is publicly available via GET.
if($retcode != 200 && $retcode != 401) {
    echo '0';
    exit();
}

$content = file($_POST['url']);
if(strtoupper(trim($content[0])) == 'BEGIN:VCALENDAR'){
	echo '1';
} else {
	echo '0';
}	
