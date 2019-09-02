require('dotenv').config()
var keys = require('./keys.js')
var Spotify = require('node-spotify-api')
const axios = require('axios')
var moment = require('moment')
var r = require('request')
var fs = require('fs')

var spotify = new Spotify(keys.spotify)
var command = process.argv[2]
// console.log(' command = ' + command)
var commandValue = process.argv.slice(3).join(' ')
// console.log('command type = ' + typeof commandValue)
// console.log('command value = ' + commandValue)
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
/*
   - `concert-this`
   - `spotify-this-song`
   - `movie-this`
   - `do-what-it-says`
*/

async function searchSpotify(trackName = 'The Sign Ace of Base') {
  spotify.search({ type: 'track', query: trackName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err)
    }
    console.log('========================')
    console.log('tracks found ' + data.tracks.items.length)
    for (var i = 0; i < data.tracks.items.length; i++) {
      console.log(
        'Artist = ' + JSON.stringify(data.tracks.items[i].album.artists[0].name)
      )
      console.log('Song = ' + JSON.stringify(data.tracks.items[i].name))
      console.log(
        'Link = ' + JSON.stringify(data.tracks.items[i].external_urls.spotify)
      )
      console.log('Album = ' + JSON.stringify(data.tracks.items[i].album.name))
      console.log('========================')
    }
  })
}

async function getConcert(artistName = 'guns and roses') {
  url = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`
  axios.get(url).then(function(response) {
    if (response.data.length == 0) {
      console.log(
        `No concert list available for artist ${artistName}. Try artists like: Billie Eilish, Madona`
      )
    }
    console.log('============================')
    for (var concertInfo of response.data) {
      console.log('Artist name: ' + artistName)
      console.log(concertInfo.venue.name)
      console.log(concertInfo.venue.city)
      var dateConcert = concertInfo.datetime
      var formattedDate = moment(dateConcert).format('MM/DD/YYYY')
      console.log(formattedDate)
      console.log('============================')
    }
  })
}

async function getMovie(movieName = 'Mr. Nobody.') {
  var apiCall =
    'https://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy'

  r(apiCall, function(error, response, data) {
    // console.log(data)
    console.log(`Title of the movie:       ${JSON.parse(data).Title}`)
    console.log(`Year the movie came out:  ${JSON.parse(data).Year}`)
    console.log(`IMDB Rating:              ${JSON.parse(data).imdbRating}`)
    console.log(
      `Rotten Tomatoes Rating:   ${JSON.parse(data).Ratings[1].Value}`
    )
    console.log(`Country:                  ${JSON.parse(data).Country}`)
    console.log(`Language of the movie:    ${JSON.parse(data).Language}`)
    console.log(`Plot:                     ${JSON.parse(data).Plot}`)
    console.log(`Actors:                   ${JSON.parse(data).Actors}`)
  })
}

async function doWhatItSays() {
  //running code SYNCRONOUSLY
  var contents = fs.readFileSync('./random.txt', 'utf8')
  var arr = contents.split(',')
  command = arr[0]
  commandValue = arr[1].replace('"', '').replace('"', '')

  // console.log('command = ' + command)
  // console.log('command value = ' + commandValue)
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
    default:
      console.log('no valid option selected')
      break
  }
  // console.log('======')
}
