import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

interface ArtistData {
  id: string;
  name: string;
  image: string;
  genres: string[];
}

interface TrackData {
  id: string;
  name: string;
  artistID: string;
  image: string;
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
  const trackIDs: string[] = req.body.trackIDs || "";
  const username = req.body.username || "";

  // data to be returned
  // const artistGenres: Record<string, Record<string, string>> = {}; // id -> image url
  let displayName = "";
  let profileImage = "";
  const trackData: Record<string, TrackData> = {}; //id -> track data 

  // map of artist ids to artist names / genres
  const artistIDs: Record<string, ArtistData> = {}

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
      const artistIDsString = Object.keys(artistIDs).join('%2C');
      const artistRes = await fetch(`https://api.spotify.com/v1/artists?ids=${artistIDsString}`, header);
      const artistData = await artistRes.json();
      const artists: any[] = artistData.artists;

      // parse artist data
      for (const artist of artists) {
        artistIDs[artist.id].image = artist.images[0].url || "";
        artistIDs[artist.id].genres = artist.genres;
      }

    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).send(`An error occurred\n${error}`);
      return;
    }
  }

  // return the data
  res.json({
    displayName: displayName,
    profileImage: profileImage,
    artistData: artistIDs,
    trackData: trackData
  });
});


// Expose Express API as a single Cloud Function
exports.getData = functions.https.onRequest(app);
