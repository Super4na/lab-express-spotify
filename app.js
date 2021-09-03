require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token'])) //dotenv -> + process.env
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
//1. Create a route /index
//render a view called index.hbs
//in index.hbs, create a form with an artistName field
// this shouçd redirect to /artist-search
//with a querystring http://localhost:3000?artist-search?artishName="adasdas"

app.get("/",(req,res)=> {
    res.render("index");
});

app.get("/artist-search", async (req,res)=>{
    const data  = await spotifyApi.searchArtists(req.query.artistName);
    /* console.log(data.body.artists); */
    const allArtists = data.body.artists.items;
    /* console.log(allArtists[0].images) */
    res.render("artist-search-result", {allArtists});
    
});

app.get("/albums/:artistsId", async (req,res)=>{
    const albums = await spotifyApi.getArtistAlbums(req.params.artistsId);
    /* console.log(albums) */
    const allAlbums = albums.body.items;
    /* console.log("ALBUM STARTS HERE")
    console.log(allAlbums) */
    res.render("albums", {allAlbums});
})


app.get("/tracks/:albumsId", async (req,res)=>{
    const tracks = await spotifyApi.getAlbumTracks(req.params.albumsId);
  
    const allTracks = tracks.body.items;
    
    res.render("tracks",{allTracks});
})
// create an /artist-search route
//get the artistName that comes drom the query params
//pass that artist name to




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
