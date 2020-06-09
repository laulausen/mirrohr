String.prototype.hashCode = function () {
  var hash = 0, i, chr, len
  if (this.length === 0) return hash
  for (i = 0, len = this.length; i < len; i++) {
    chr = this.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

var feedsActive
var newFeeds
var showFeedLogo

function updateFeeds () {

  console.log('next news update: ' + moment().add(5, 'minutes').format('lll:ss'))
  $.ajax({
    url: '../modules/news/assets/getFeeds.php',
    success: function (data) {

      if (data.feeds === null) {
        // No new feed entries were fetched.
        console.log('No entries in the configured feeds')
        return
      }

      feedsActive = []
      newFeeds = []
      showFeedLogo = data.showFeedLogo

      minTstamp = $('#minTstamp').val()

      $('#news > li').each(function (index) {
        feedsActive.push($(this).attr('id'))
      })
      Object.keys(data.feeds).sort().forEach(function (key) {
        if (minTstamp <= key) {
          minTstamp = key
          for (i = 0; i < data.feeds[key].length; i++) {
            var item = data.feeds[key][i]
            if (feedsActive.indexOf(item.title.hashCode().toString()) == -1) {
              feedsActive.push(item.title.hashCode())
              newFeeds.push(item)
            }
          }
        }
      })
      $('#minTstamp').val(minTstamp)
      newFeed(0)

      if ('glancr' in data) {
        if ($('#news > li').length == 5) {
          $('#news > li').last().hide('slow', function () {
            $('#news > li').last().remove()
            $('#glancrNews > li').html(data.glancr)
            $('#glancrNews').fadeIn('slow')
          })
        } else if (data.glancr != $('#glancrNews > li').html()) {
          $('#glancrNews > li').hide('slow').html(data.glancr).fadeIn('slow')
        }
      } else {
        if ($('#news > li').length == 3 && Object.keys(data.feeds).length > 3) {
          $('#glancrNews').hide('slow', function () {
            var feedItem = data.feeds[Object.keys(data.feeds).sort()[0]][0]

            var logo = (showFeedLogo === true ? ' | <img src="' + feedItem.logo + '" />' : '')

            $('<li class="newsmodule__source--rss" id="' + feedItem.title.hashCode() + '">' + feedItem.title + logo + '</li>').hide().appendTo('#news').show('slow')
          })
        }
      }
    }
  })

  window.setTimeout(function () {
    updateFeeds()
  }, 500000)
}

function newFeed (i) {
  if (i < newFeeds.length) {

    window.setTimeout(function () {
      $('#news > li').last().hide('slow', function () {
        $('#news > li').last().remove()
        var feedItem = newFeeds[i]

        var logo = (showFeedLogo === true ? ' | <img src="' + feedItem.logo + '" />' : '')

        $('<li class="newsmodule__source--rss" id="' + feedItem.title.hashCode() + '">' + feedItem.title + logo + '</li>').hide().prependTo('#news').show('slow')
      })
      newFeed(i + 1)
    }, 2000)
  } else {

  }
}

$(document).ready(function () {
  updateFeeds()
})
