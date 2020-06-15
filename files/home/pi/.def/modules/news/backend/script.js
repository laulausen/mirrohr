function validateFeed (url) {

  // Show progress indicator message
  $('#validate_feed').show()
  $('#invalid_feed').hide()

  console.log('url received: ' + url)

  if (url === undefined) {
    // If in any case url is undefined, return early.
    return
  }
  var feed = url.trim()

  if (feed.length > 0) {
    $.post('../modules/news/assets/isFeed.php', {url: feed})
      .done(function (data) {
        var res = JSON.parse(data)

        console.log(res)

        $('#validate_feed').hide()
        if (res.feed_valid) {
          $('#feed__add').show('fast')
          $('#new_feed').val(res.discovered_feed)
        } else {
          $('#feed__add').hide('fast')
          $('#invalid_feed').show()
        }
      })
  } else {
    $('#validate_feed').hide()
  }
}

/**
 * Save all configured feed addresses on the backend.
 */
function writeFeeds () {
  let feedUrls = JSON.stringify($('.feed__url').map(function (i, element) {
    return $(element).text()
  }).get())
  saveConfig({'key': 'news_feeds', 'value': feedUrls})
}

function saveConfig (data) {
  $.post('setConfigValueAjax.php', data)
    .done(function () {
      $('#ok').show(30, function () {
        $(this).hide('slow')
      })
    })
}

// jQuery event handler for feed input events. Uses input event to support continuous typing and emptying the field.
$('#new_feed').on('input', function (event) {
  let input = event.target

  if (!input.value) {
    // Input is empty, reset all state
    $('#feed__add').hide('fast')
    $('#invalid_feed').hide('fast')
    return
  }

  if (!input.validity.valid && input.value) {
    // Input does not conform to URL scheme, try to prefix with rss:// for domain search
    $('#new_feed').val('rss://' + input.value)
    return
  }

  if (input.validity.valid === true) {
    // Input conforms to URL scheme set in input field pattern, validate on backend
    validateFeed(input.value)
  }
})

// jQuery event handler when the 'add feed' button is clicked.
$('#feed__add').click(function () {
  var input = $('#new_feed')

  $('#configured_feeds').append(
    '<p class="feed"><span class="feed__url">' +
    input.val().trim() + '</span>' +
    '<button class="feed__delete"><i class="fi-trash"></i></button>' +
    '</p>'
  )

  input.val('')
  $('#feed__add').hide('fast')
  writeFeeds()
})

// jQuery event handler when the 'show glancr News' checkbox is toggled.
$('#showGlancrNews').change(function () {
  saveConfig({'key': 'news_showGlancrNews', 'value': $('#showGlancrNews').is(':checked')})
})

// jQuery event handler when the 'show feed logo' checkbox is toggled.
$('#showFeedLogo').change(function () {
  saveConfig({'key': 'news_showFeedLogo', 'value': $('#showFeedLogo').is(':checked')})
})

// Click handler for feed deletion buttons are attached to the document object because adding a feed adds a new button
// after this script has run.
$(document).on('click', '.feed__delete', function () {
  $(this).parent().hide('fast', function () {
    $(this).remove()
    writeFeeds()
  })
})
