import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

interface SpotifyArtistData {
  name: string;
  image: string;
  genres: string[];
  id: string;
}

interface SpotifyTrackData {
  id: string;
  name: string;
  artistID: string;
  image: string;
}

interface SpotifyDataRes {
  displayName: string;
  profileImage: string;
  artistData: Record<string, SpotifyArtistData>;
  trackData: Record<string, SpotifyTrackData>;
  artistImages: Record<string, string>; // name: ImageUrl
}

// initlize app
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.post('/', async (req, res) => {


  const config = functions.config().spotify;
  if (!config || !config.client_id || !config.client_secret) {
    res.status(500).send("Spotify config missing");
    return;
  }

  // Retrieve the client ID and secret from the Firebase config
  const { client_id: SPOTIFY_CLIENT_ID, client_secret: SPOTIFY_CLIENT_SECRET } = config;
  const base64Credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  // Retrieve the 'query params
  const trackIDs: string[] = req.body.trackIDs || [];
  const artistNames: string[] = req.body.artistNames || [];
  const username = req.body.username || "";

  // data to be returned
  // const artistGenres: Record<string, Record<string, string>> = {}; // id -> image url
  let displayName = "";
  let profileImage = "";
  const trackData: Record<string, SpotifyTrackData> = {}; //id -> track data 
  const artistImageUrls: Record<string, string> = {}; // name -> image url

  // map of artist ids to artist names / genres
  const artistIDs: Record<string, SpotifyArtistData> = {}

  if (trackIDs.length > 0) {
    try {
      // Get access token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      const header = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }

      //? make request for user data
      const UserDataResponse = await fetch(`https://api.spotify.com/v1/users/${username}`, header);
      // parse user data
      const UserData = await UserDataResponse.json();
      displayName = UserData.display_name;
      profileImage = UserData.images[0].url || "";


      //? make request for track data
      const trackIDsChunks = []; // serparate track ids into chunks of 50
      for (let i = 0; i < trackIDs.length; i += 50) {
        const chunk = trackIDs.slice(i, i + 50);
        trackIDsChunks.push(chunk.join('%2C'));
      }

      // iterate over chunks and make requests
      for (const chunk of trackIDsChunks) {
        const chunkRes = await fetch(`https://api.spotify.com/v1/tracks?market=US&ids=${chunk}`, header);
        const chunkJson = await chunkRes.json();
        const chunkTracks: any[] = chunkJson.tracks || [];
        for (const track of chunkTracks) {
          if (track && track.artists && track.artists.length > 0) {
            const artist = track.artists[0];
            trackData[track.id] = {
              id: track.id,
              name: track.name,
              artistID: artist.id,
              image: track.album.images[0].url || ""
            }
            artistIDs[artist.id] = {
              name: artist.name,
              id: artist.id,
              image: "",
              genres: [] // will be filled in later
            };
          } else {
            console.warn('Invalid track or artist data', track);
          }
        }
      }

      //? make request for missing artist data
      const artistIDsArray = Object.keys(artistIDs);
      const artistIDsChunks = []; // serparate track ids into chunks of 50
      for (let i = 0; i < artistIDsArray.length; i += 50) {
        const chunk = artistIDsArray.slice(i, i + 50);
        artistIDsChunks.push(chunk);
      }
      // iterate over chunks and make requests
      for (const chunk of artistIDsChunks) {
        const artistRes = await fetch(`https://api.spotify.com/v1/artists?ids=${chunk.join('%2C')}`, header);
        const artistData = await artistRes.json();
        const artists: any[] = artistData.artists;
        // parse artist data
        for (const artist of artists) {
          artistIDs[artist.id].name = artist.name;
          artistIDs[artist.id].id = artist.id;
          artistIDs[artist.id].image = artist.images[0].url || "";
          artistIDs[artist.id].genres = artist.genres || [];
        }


        //? make requests for artist images
        for (const artistName of artistNames) {
          const artistRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1&offset=0`, header);
          const artistData = await artistRes.json();
          const artists: any[] = artistData.artists.items;
          if (artists.length > 0) {
            const artist = artists[0];
            artistImageUrls[artist.name] = artist.images && artist.images.length > 0 ? artist.images[0].url : "";
            if (!artistIDs[artist.name]) {
              artistIDs[artist.name] = {
                name: artist.name,
                id: artist.id,
                image: "",
                genres: [] // will be filled in later
              };
            }
            artistIDs[artist.name].image = artist.images && artist.images.length > 0 ? artist.images[0].url : "";
            artistIDs[artist.name].id = artist.id || "";
            artistIDs[artist.name].name = artist.name || "";
          }
        }
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).send(`An error occurred\n${error}`);
      return;
    }
  }

  // return the data
  const resultData: SpotifyDataRes = {
    displayName: displayName,
    profileImage: profileImage,
    artistData: artistIDs,
    trackData: trackData,
    artistImages: artistImageUrls
  }
  res.json(resultData);
});


// Expose Express API as a single Cloud Function
exports.getData = functions.https.onRequest(app);
