import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/', async (req, res) => {
  const config = functions.config().spotify;
  if (!config || !config.client_id || !config.client_secret) {
    res.status(500).send("Spotify config missing");
    return;
  }

  // Retrieve the client ID and secret from the Firebase config
  const { client_id: SPOTIFY_CLIENT_ID, client_secret: SPOTIFY_CLIENT_SECRET } = config;
  const base64Credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  // Retrieve the 'query params
  const artistIDs = typeof req.query.artists === 'string' ? req.query.artists : "";
  const username = typeof req.query.username === 'string' ? req.query.username : "";
  const artistGenreIDs = typeof req.query.artistGenres === 'string' ? req.query.artistGenres : "";

  // data to be returned
  const artistImages: Record<string, string> = {}; // id -> image url
  const genres: Record<string, string[]> = {}; // id -> genres[]
  let displayName = "";
  let profileImage = "";

  if (artistIDs.length > 0) {
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
      // const apiHeader = {
      //   'Authorization': `Bearer ${accessToken}`
      // }


      //? make the Spotify API request with the obtained token
      const spotifyArtistsResponse = await fetch(`https://api.spotify.com/v1/artists?ids=${artistIDs}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // parse the response as JSON
      const spotifyData = await spotifyArtistsResponse.json();
      const artists: any[] = spotifyData.artists;
      for (const artist of artists) {
        artistImages[artist.id] = artist.images[0].url;
      }


      //? make request for user data
      const UserDataResponse = await fetch(`https://api.spotify.com/v1/users/${username}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // parse the response 
      const UserData = await UserDataResponse.json();
      displayName = UserData.display_name;
      profileImage = UserData.images[0].url;


      //? make request for genres
      //TODO - change to list, check value, and then separate with '%2C' or build a url
      const artistGenreData = await fetch(`https://api.spotify.com/v1/artists?ids=${artistGenreIDs}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // parse the response
      const artistGenreResponse = await artistGenreData.json();
      const artistsResults: any[] = artistGenreResponse.tracks;
      for (const artist of artistsResults) {
        genres[artist.id] = artist.genres;
      }

    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).send(`An error occurred\n${error}`);
      return;
    }
  }

  res.json({
    artists: artistImages,
    genres: genres,
    displayName: displayName,
    profileImage: profileImage
  });
});


// Expose Express API as a single Cloud Function
exports.getData = functions.https.onRequest(app);
