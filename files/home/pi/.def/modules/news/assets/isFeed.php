<?php
require __DIR__ . '/../vendor/autoload.php';

$feed_url = $_POST['url'];

try {
    $rss = new SimplePie();
    $rss->set_feed_url($feed_url);
    $rss->init();

    if ($rss->error) {
        throw new Exception('not a valid feed');
    }
    echo json_encode(["feed_valid" => true, 'discovered_feed' => $rss->feed_url]);

} catch (Exception $e) {
    echo json_encode(["feed_valid" => false]);
}
