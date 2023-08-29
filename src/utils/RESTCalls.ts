import { Data, SpotifyArtistData } from "./globals";
import { calculateGenreBreakdown } from "./utils";

const baseURL = "https://us-central1-lit-mix.cloudfunctions.net"
const dataEndpoint = "/getData"



// Call firebase function to retrieve sensitive data
export const requestSpotifyData = async (userData: Data) => {
    try {
        const trackIDs = Object.keys(userData.topTracksData);
        console.log(userData.username)

        const payload = {
            username: userData.username,
            trackIDs: trackIDs,
        };

        const url = `${baseURL}${dataEndpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // update data
        const data = await response.json();
        console.log(data.artistData)

        userData.displayName = data.displayName;
        userData.profileImage = data.profileImage;
        // calculateGenreBreakdown(data.artistData as Record<string, SpotifyArtistData>, userData.topArtistsData)

    } catch (error) {
        console.error('Error:', error);
    }
};
