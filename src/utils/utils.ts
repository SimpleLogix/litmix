import { EMPTY_DATA, ColorMap, DAYS, Data, HeatmapData, WeekdayDataType, heatmapDataType, hourlyDataDummy, topArtistsDummy, yearlyDataDummy, SpotifyArtistData, Track, MONTHS, GENRES, Artist, Card } from "./globals";

// takes a number and returns a human-readable string
// 18,123,456 => 18.1m
// 123,456 => 123k 
export const stringifyNum = (num: number) => {
    const suffix = num < 1000 ? '' : num < 1000000 ? 'k' : 'm';
    const divisor = num < 1000 ? 1 : num < 1000000 ? 1000 : 1000000;
    let result = (num / divisor).toFixed(1);

    if (result.endsWith('.0')) {
        result = result.slice(0, -2);
    }

    return result + suffix;
}

// takes a number and returns a color
export const getColor = (num: number) => {
    const color = ColorMap[Math.floor(num * 10)];
    return color || ColorMap[404];
}

// sorts string array of years in ascending order
export const sortYears = (years: string[]): string[] => {
    return years.sort((a, b) => parseInt(a) - parseInt(b));
}

//* generator
export function createDateValues(): heatmapDataType {
    const sample: heatmapDataType = {};
    let yearD = 2006;
    let date = new Date(yearD, 0, 1);
    for (let i = 0; i < 365 * 18; i++) {
        const year = date.getUTCFullYear().toString();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const colorValue = Math.random();
        const songCount = Math.floor(colorValue * 100);
        const msStreamed = Math.floor(Math.random() * 100);
        const topTrack = "Shut Up my mom's Calling";
        const topTrackCount = Math.floor(Math.random() * 100);

        let yearMap = sample[year];
        if (!yearMap) {
            yearMap = {};
            sample[year] = yearMap;
        }

        let monthMap = yearMap[month];
        if (!monthMap) {
            monthMap = {};
            yearMap[month] = monthMap;
        }

        const heatmapData: HeatmapData = { date: `${year}-${month}-${day}`, songCount, msStreamed, colorValue, topTrack, topTrackCount };
        monthMap[day] = heatmapData;

        date.setUTCDate(date.getUTCDate() + 1);
    }
    return sample;
}

//* generator
export const generateWeekdayData = (): WeekdayDataType => {
    const data: WeekdayDataType = {};

    for (let i = 0; i < 7; i++) {
        data[DAYS[i]] = {
            day: DAYS[i],
            percent: Math.floor(Math.random() * 100),
            mostActive: `${Math.floor(Math.random() * 12)}pm`,
        };
    }

    return data;
};

//* generator
// generates empty/dummy data for initial load
export const generateData = (): Data => {
    const data = { ...EMPTY_DATA };
    data.genres = GENRES;
    data.heatmapData = createDateValues();
    data.weekdayData = generateWeekdayData();
    data.hourlyData = hourlyDataDummy;
    data.yearlyData = yearlyDataDummy;
    data.topArtistsData = topArtistsDummy;
    data.years = ["2016", "2018", "2019", "2020", "2023"]
    return data
}

const emptyHeatmapData: HeatmapData = {
    date: '',
    songCount: -1,
    msStreamed: -1,
    colorValue: 404,
    topTrack: '',
    topTrackCount: -1,
};


// pad up the non - existent days
// lines up the months according to where 1st day of month lands
export const padHeatmapData = (year: number, month: number, data: Record<string, HeatmapData>): HeatmapData[] => {
    const paddedData: HeatmapData[] = [];

    // Find the day of the week that the month starts on (0 is Sunday, 6 is Saturday)
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

    // Pad the beginning of the month with empty data
    for (let i = 0; i < firstDayOfMonth; i++) {
        paddedData.push(emptyHeatmapData);
    }

    // Go through each day of the month and add the existing data or the empty data if not exist
    for (let day = 1; day <= 31; day++) {
        const key = day.toString().padStart(2, '0');
        paddedData.push(data[key] || emptyHeatmapData);
    }

    // Pad the remaining days to reach 35 records
    while (paddedData.length < 35) {
        paddedData.push(emptyHeatmapData);
    }

    return paddedData;
}



//* Conversions

export const msToHours = (ms: number) => {
    return ms / 1000 / 60 / 60;
}

export const msToMins = (ms: number) => {
    return ms / 1000 / 60;
}

export const uriToID = (uri: string): string => {
    return uri.split(':')[2];
}

// 01-01-2021 -> Jan. 2021
export const convertDate = (date: string): string => {
    const dateObj = new Date(date);
    return `${MONTHS[dateObj.getMonth()]}. ${dateObj.getFullYear()}`
}

// Record<string, Record<string, any>> -> WeekdayDataType
export const convertToWeekdayDataType = (daysData: Record<string, Record<string, any>>, totalMsStreamed: number): WeekdayDataType => {
    let weekdayData: WeekdayDataType = {};
    for (const [day, data] of Object.entries(daysData)) {
        // calculate the % of total ms streamed
        const msStreamed = data.msStreamed / totalMsStreamed;

        weekdayData[day] = {
            day: day,
            percent: msStreamed,
            mostActive: Object.entries(data.time as Record<string, number>).reduce(
                (a: [string, number], b: [string, number]) => (a[1] > b[1] ? a : b)
            )[0]
        }
    }
    return weekdayData;
}

//* Local storage
// fetch data from local storage
export const checkExistingData = (): Data => {
    return localStorage.getItem("data")
        ? JSON.parse(localStorage.getItem("data")!) as Data
        : generateData();
};

export const saveData = (data: Data) => {
    localStorage.setItem("data", JSON.stringify(data));
}


//* Data Parsing
export const calculateGenreBreakdown = (spotifyArtistData: Record<string, SpotifyArtistData>, userData: Data) => {
    // find the artist and add their msStreamed to the genres
    for (const artist of Object.values(spotifyArtistData)) {
        if (userData.topArtistsData[artist.name]) {
            const genreMsStreamed = userData.topArtistsData[artist.name].msStreamed;
            for (const genre of artist.genres) {
                if (userData.genres[genre]) {
                    userData.genres[genre] += genreMsStreamed;
                } else {
                    userData.genres[genre] = genreMsStreamed;
                }
            }
        }
    }

    // Keep top 50% of genres
    const sortedGenres = Object.entries(userData.genres).sort(([, a], [, b]) => b - a);
    const cutoffIndex = Math.floor(sortedGenres.length / 2);
    const topGenres = sortedGenres.slice(0, cutoffIndex);

    // Reset userData.genres and only populate it with top genres
    userData.genres = {};
    topGenres.forEach(([genre, msStreamed]) => {
        userData.genres[genre] = msStreamed;
    });

    // find the % breakdowns
    const scalar = 1.0
    const totalMsStreamed = Object.values(userData.genres).reduce((a, b) => a + b, 0);
    for (const [genre, msStreamed] of Object.entries(userData.genres)) {
        userData.genres[genre] = scalar * msStreamed / totalMsStreamed;
    }
}

export const getTopTracks = (tracks: Record<string, Track>): Record<string, Track> => {
    const trackEntries = Object.entries(tracks);
    const sortedTracks = trackEntries.sort((a, b) => b[1].msStreamed - a[1].msStreamed).slice(0, 25);
    return Object.fromEntries(sortedTracks);
}

export const getUsername = (usernames: Record<string, number>): string => {
    // find the most common username
    return Object.keys(usernames).reduce((a, b) => usernames[a] > usernames[b] ? a : b);
}

export const updateTopTrackForArtists = (userData: Data, artistTrackCount: Record<string, Record<string, number>>, artistCount: Record<string, Artist>) => {
    // Sort artists by msStreamed and take the top 15
    const artistNames = Object.keys(userData.topArtistsData).slice(0, 15);
    console.log(artistNames)
    for (const artist of artistNames) {
        // Sort tracks for each artist
        const sortedTracks = Object.keys(artistTrackCount[artist]).sort((a, b) => {
            return artistTrackCount[artist][b] - artistTrackCount[artist][a];
        });

        // Update topTrack for each artist
        userData.topArtistsData[artist].topTrack = sortedTracks[0];
    }

    // update recommendationSeeds with top 3 tracks and 2 artists
    const topTracks = Object.values(userData.topTracksData).slice(0, 3).map((track) => ({ track: track.id }));
    const topArtists = Object.values(userData.topArtistsData).slice(0, 2).map((artist) => ({ artist: artist.id }));

    userData.recommendationSeeds = [...topTracks, ...topArtists];
};


export const getEarliestDate = (heatmap: heatmapDataType, years: string[]): string => {
    // get earliest year
    const year = years.sort((a, b) => { return Number(a) - Number(b) })[0];
    // get earliest month
    const month = Object.keys(heatmap[year]).sort((a, b) => { return Number(a) - Number(b) })[0];
    // get earliest day
    const day = Object.keys(heatmap[year][month]).sort((a, b) => { return Number(a) - Number(b) })[0];
    return `${MONTHS[parseInt(month)]}. ${day}, ${year}`;
}

export const formCards = (data: Data) => {
    const trackCards = Object.values(data.topTracksData).map((track) => ({
        type: "track",
        selected: false,
        ...track,

    }));
    const artistCards = Object.values(data.topArtistsData).map((artist) => ({
        type: "artist",
        selected: false,
        ...artist,
    }));

    let cards: Card[] = [];
    let trackIndex = 0;
    let artistIndex = 0;

    while (trackIndex < trackCards.length || artistIndex < artistCards.length) {
        if (trackIndex < trackCards.length) {
            cards.push(trackCards[trackIndex++]);
        }
        if (trackIndex < trackCards.length) {
            cards.push(trackCards[trackIndex++]);
        }
        if (artistIndex < artistCards.length) {
            cards.push(artistCards[artistIndex++]);
        }
    }

    return cards;
};