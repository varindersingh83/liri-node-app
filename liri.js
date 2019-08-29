require('dotenv').config()
var keys = require('./keys.js')
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify)

/*
   - `concert-this`
   - `spotify-this-song`
   - `movie-this`
   - `do-what-it-says`
*/

spotify.search({ type: 'track', query: 'The Lion sleeps tonight' }, function(
  err,
  data
) {
  if (err) {
    return console.log('Error occurred: ' + err)
  }

  console.log(
    'Artist = ' + JSON.stringify(data.tracks.items[0].album.artists[0].name)
  )
  console.log('Song = ' + JSON.stringify(data.tracks.items[0].name))
  console.log(
    'Link = ' + JSON.stringify(data.tracks.items[0].external_urls.spotify)
  )
  console.log('Album = ' + JSON.stringify(data.tracks.items[0].album.name))
})
