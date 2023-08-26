# This is the main file for the Firebase Functions
import json
from firebase_functions import https_fn
from firebase_admin import initialize_app

# Initialize the app and get environment variables
app = initialize_app()
config = app.options

@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    SPOTIFY_CLIENT_ID = config.get('spotify').get('client_id')
    SPOTIFY_CLIENT_SECRET = config.get('spotify').get('client_secret')
    
    data = {
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET,
    }

    return https_fn.Response(json.dumps(data), headers=headers, mimetype="application/json")
