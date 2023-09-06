import { Artist, Data, SpotifyArtistData, SpotifyTrackData, TOP_ARTISTS_NUM, Track } from "./globals";
import { calculateGenreBreakdown } from "./utils";

const baseURL = "https://us-central1-lit-mix.cloudfunctions.net"
const dataEndpoint = "/getData"
const recsEndpoint = "/getRecs"

interface SpotifyDataRes {
    displayName: string;
    profileImage: string;
    artistData: Record<string, SpotifyArtistData>;
    trackData: Record<string, SpotifyTrackData>;
    artistImages: Record<string, string>; // name: ImageUrl
}

// Call firebase function to retrieve sensitive data
export const requestSpotifyData = async (userData: Data) => {
    try {
        const trackIDs = Object.keys(userData.topTracksData);
        const artistNames = Object.keys(userData.topArtistsData).sort((a, b) => userData.topArtistsData[b].msStreamed - userData.topArtistsData[a].msStreamed).slice(0, TOP_ARTISTS_NUM);
        const payload = {
            username: userData.username,
            trackIDs: trackIDs,
            artistNames: artistNames,
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
        const data: SpotifyDataRes = await response.json();


        userData.displayName = data.displayName;
        userData.profileImage = data.profileImage;
        calculateGenreBreakdown(data.artistData, userData)

        // update image urls
        for (const [name, url] of Object.entries(data.artistImages)) {
            userData.topArtistsData[name].image = url;
        }
        for (const [name, track] of Object.entries(data.trackData)) {
            if (userData.topTracksData[name]) {
                userData.topTracksData[name].image = track.image;
            }
        }
        const top15Artists: Record<string, Artist> = {};
        for (const [, artist] of Object.entries(data.artistData)) {
            if (userData.topArtistsData[artist.name]) {
                const artistData = userData.topArtistsData[artist.name];
                artistData.genres = artist.genres;
                artistData.id = artist.id;
                top15Artists[artist.name] = artistData;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


export const requestRecommendations = async (userData: Data): Promise<Track[]> => {
    const recs: Track[] = [];
    // separate track and artist seeds
    const trackSeeds = [];
    const artistSeeds = [];
    for (const seed of userData.recommendationSeeds) {
        if (seed.track) {
            trackSeeds.push(seed.track);
        } else {
            artistSeeds.push(seed.artist);
        }
    }
    if (trackSeeds.length > 0 && artistSeeds.length > 0) {
        try {
            const payload = {
                seed_tracks: trackSeeds,
                seed_artists: artistSeeds,
            };

            const url = `${baseURL}${recsEndpoint}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();
            const tracks: any[] = json.tracks;
            for (const track of tracks) {
                if (track.preview_url) {
                    recs.push({
                        id: track.id,
                        name: track.name,
                        artistName: track.artists[0].name,
                        image: track.album.images[0].url,
                        playCount: 0,
                        msStreamed: 0,
                        discovered: "",
                        genres: [],
                        previewUrl: track.preview_url,
                    })
                }
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    return recs;
}