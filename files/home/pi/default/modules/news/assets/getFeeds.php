<?php
/**
 * Fetch & parse all configured news feeds, output their headlines in JSON format – sorted by pubDate.
 */

require __DIR__ . '/../vendor/autoload.php';
include('../../../config/glancrConfig.php');

$feed_json = getConfigValue('news_feeds');

if (is_null($feed_json)) {
    // If the configuration key does not exist or is an empty array, show default news from Süddeutsche Zeitung.
    $feeds = array();
    $feeds[0] = 'http://rss.sueddeutsche.de/rss/Topthemen';
} else {
    // Ensure compatibility with old data storage format, which was simply a comma-separated string.
    $feeds = !is_null(json_decode($feed_json)) ? json_decode($feed_json) : explode(',', $feed_json);
}

$json = array();
// Booleans are currently stored as strings in the database, filter_var will output FALSE on all cases other than true/false.
$json['showFeedLogo'] = filter_var(getConfigValue('news_showFeedLogo'), FILTER_VALIDATE_BOOLEAN);

// Loop through feed URLs and get 5 items from each.
foreach ($feeds AS $feed) {
    try {
        $rss = new SimplePie();
        $rss->set_feed_url($feed);
        $rss->init();

        // Feeds were validated during input. For good measure, handle parsing errors here as well.
        if ($rss->error) {
            break;
        }

        $feed_img = $rss->get_image_url();
        $items = $rss->get_items();

        $i = 0;

        foreach ($items as $item) {
            $title = $item->get_title();
            $pubDate = $item->get_date();
            $json['feeds'][strtotime($pubDate)][] = ['logo' => $feed_img, 'title' => $title];

            $i++;
            if ($i === 5) {
                break;
            }
        }
    } catch (Exception $e) {
        error_log("Error parsing news feed $feed: $e");
    }
}

// Sort regular entries here, so glancr will always show last if enabled.
krsort($json['feeds']);

// If checked, include the latest item from the glancr news feed.
$showGlancrNews = getConfigValue('news_showGlancrNews');

if ($showGlancrNews === 'true' || empty($showGlancrNews)) {
    try {
        $glancrRss = new SimplePie();
        $glancrRss->set_feed_url('https://api.glancr.de/glancr-news-static.xml');
        $glancrRss->init();

        if ($glancrRss->error) {
            throw new Exception('Error parsing glancr news feed');
        }

        $glancrItems = $glancrRss->get_items();
        $i = 0;

        foreach ($glancrItems as $glancrItem) {
            $json['glancr'] = $glancrItem->get_title();
            $i++;
            if ($i === 1) {
                break;
            }
        }
    } catch (Exception $e) {
        error_log("Error parsing glancr news feed: $e");
    }
}


header('Content-Type: application/json');
echo json_encode($json);
