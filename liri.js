//calling are required liberaries.
require('dotenv').config()
var keys = require('./keys.js')
var Spotify = require('node-spotify-api')
const axios = require('axios')
var moment = require('moment')
var r = require('request')
var fs = require('fs')
var spotify = new Spotify(keys.spotify)

//command line send argument and value after second argument
var command = process.argv[2]
var commandValue = process.argv.slice(3).join(' ')

//calling specific function based on command in commandline.
switch (command) {
  case 'concert-this':
    commandValue == '' ? getConcert() : getConcert(commandValue)
    break
  case 'spotify-this-song':
    commandValue == '' ? searchSpotify() : searchSpotify(commandValue)
    break
  case 'movie-this':
    commandValue == '' ? getMovie() : getMovie(commandValue)
    break
  case 'do-what-it-says':
    doWhatItSays()
    break
  default:
    break
}

// get track info from spotify. default track name is Ace
async function searchSpotify(trackName = 'The Sign Ace of Base') {
  spotify.search({ type: 'track', query: trackName }, function(err, data) {
    if (err) {
      return appendToLog('Error occurred: ' + err)
    }
    appendToLog('========================')
    appendToLog('tracks found ' + data.tracks.items.length)
    for (var i = 0; i < data.tracks.items.length; i++) {
      appendToLog(
        'Artist = ' + JSON.stringify(data.tracks.items[i].album.artists[0].name)
      )
      appendToLog('Song = ' + JSON.stringify(data.tracks.items[i].name))
      appendToLog(
        'Link = ' + JSON.stringify(data.tracks.items[i].external_urls.spotify)
      )
      appendToLog('Album = ' + JSON.stringify(data.tracks.items[i].album.name))
      appendToLog('========================')
    }
  })
}

//get concert list by artist name. default artist name is guns and roses
async function getConcert(artistName = 'guns and roses') {
  url = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`
  axios.get(url).then(function(response) {
    if (response.data.length == 0) {
      appendToLog(
        `No concert list available for artist ${artistName}. Try artists like: Billie Eilish, Madona`
      )
    }
    appendToLog('============================')
    for (var concertInfo of response.data) {
      appendToLog('Artist name: ' + artistName)
      appendToLog(concertInfo.venue.name)
      appendToLog(concertInfo.venue.city)
      var dateConcert = concertInfo.datetime
      var formattedDate = moment(dateConcert).format('MM/DD/YYYY')
      appendToLog(formattedDate)
      appendToLog('============================')
    }
  })
}

//get movie data from ombdAPI and default parameter value = Mr. Nobody.
async function getMovie(movieName = 'Mr. Nobody.') {
  var apiCall =
    'https://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy'

  r(apiCall, function(error, response, data) {
    appendToLog(`Title of the movie:       ${JSON.parse(data).Title}`)
    appendToLog(`Year the movie came out:  ${JSON.parse(data).Year}`)
    appendToLog(`IMDB Rating:              ${JSON.parse(data).imdbRating}`)
    appendToLog(
      `Rotten Tomatoes Rating:   ${JSON.parse(data).Ratings[1].Value}`
    )
    appendToLog(`Country:                  ${JSON.parse(data).Country}`)
    appendToLog(`Language of the movie:    ${JSON.parse(data).Language}`)
    appendToLog(`Plot:                     ${JSON.parse(data).Plot}`)
    appendToLog(`Actors:                   ${JSON.parse(data).Actors}`)
  })
}

//read from random.txt and call function based on text in random txt
async function doWhatItSays() {
  var contents = fs.readFileSync('./random.txt', 'utf8')
  var arr = contents.split(',')
  commandText = arr[0]
  commandValueText = arr[1]
  if (commandText[0] == '"') {
    commandValueText = commandValueText.replace('"', '').replace('"', '')
  }

  switch (commandText) {
    case 'concert-this':
      commandValueText == '' ? getConcert() : getConcert(commandValueText)
      break
    case 'spotify-this-song':
      commandValueText == '' ? searchSpotify() : searchSpotify(commandValueText)
      break
    case 'movie-this':
      commandValueText == '' ? getMovie() : getMovie(commandValueText)
      break
    default:
      appendToLog(
        'valid option not selected: text should be in following format:\nspotify-this-song,"I Want it That Way"\nmovie-this,"the terminator"\nconcert-this,"Madona"'
      )
      break
  }
}

//Console log and append to log file
async function appendToLog(logText) {
  logText = logText + '\n'
  console.log(logText)
  fs.appendFileSync('./log.txt', logText, 'utf8', function(err) {
    appendToLog(err)
  })
}
