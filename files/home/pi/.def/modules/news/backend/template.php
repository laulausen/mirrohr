<?php
$feed_json = getConfigValue('news_feeds');

// Ensure compatibility with old data storage format, which was simply a comma-separated string.
$feeds = !is_null(json_decode($feed_json)) ? json_decode($feed_json) : explode(',', $feed_json);

if (empty($feeds)) {
    // If the configuration key does not exist or is an empty array, show default news from Süddeutsche Zeitung.
    $feeds[0] = 'http://rss.sueddeutsche.de/rss/Topthemen';
}

$showGlancrNews = getConfigValue('news_showGlancrNews');

if (empty($showGlancrNews)) {
    $showGlancrNews = 'true';
}
$showFeedLogo = !empty(getConfigValue('news_showFeedLogo')) ? getConfigValue('news_showFeedLogo') : false;

_('news_description');

?>
<div class="checkbox">
    <label><input type="checkbox" id="showGlancrNews"
                  name="showGlancrNews" <?php if ($showGlancrNews == 'true') {
            echo 'checked';
        } ?>><?php echo _('enable glancrNews'); ?>
    </label>
</div>
<div class="checkbox">
    <label><input type="checkbox" id="showFeedLogo"
                  name="showFeedLogo" <?php if ($showFeedLogo == 'true') {
            echo 'checked';
        } ?>><?php echo _('enable feedLogo'); ?>
    </label>
</div>

<div id="configured_feeds">
    <?php
    foreach ($feeds as $feed) {
        if (strlen(trim($feed)) > 0) {
            ?>

            <p class="feed">
                <span class="feed__url"><?php echo trim($feed); ?></span>
                <button class="feed__delete">
                    <span class="fi-trash"></span>
                </button>
            </p>
        <?php }
    } ?>
</div>

<label
    for="new_feed"><?php echo _('Paste a feed URL or enter a web address like <i>nytimes.com</i> to search for its main news feed'); ?></label>
<input type="url" required id="new_feed" list="defaultURLs"
       pattern="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?"
       placeholder="<?php echo _('news feed url input'); ?>"/>

<datalist id="defaultURLs">
    <option value="https://news.google.com/news/rss/?ned=de&gl=DE&hl=de" label="Google News DE">
    <option value="http://rss.sueddeutsche.de/rss/Topthemen" label="Süddeutsche Zeitung – Topthemen">
    <option value="http://www.nytimes.com/services/xml/rss/nyt/World.xml" label="The New York Times – World">
    <option value="http://rss.kicker.de/news/aktuell">Kicker.de alle Sportnews</option>
</datalist>

<div style="height: 0;">
    <div class="validate" id="validate_feed"><?php echo _('validate'); ?></div>
    <div class="validate" id="invalid_feed"><?php echo _('invalid feed url'); ?></div>
</div>
<div class="block__add" id="feed__add" style="display: none">
    <button class="feed__add--button" href="#" aria-label="plus button">
        <span class="fi-plus"></span>
    </button>
</div>
