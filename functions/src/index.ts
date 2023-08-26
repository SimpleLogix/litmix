import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  const config = functions.config();
  const SPOTIFY_CLIENT_ID = config.spotify.client_id;
  const SPOTIFY_CLIENT_SECRET = config.spotify.client_secret;

  res.json({
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET
  });
});

// Expose Express API as a single Cloud Function
exports.myFunction = functions.https.onRequest(app);
