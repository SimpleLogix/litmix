export interface Stats {
    user: string;
    totalMinsPlayed: number
    topTracks: [string, number][]
    topArtists: [string, number][]
    topDays: [string, number][]
    tracksOnRepeat: [string, number][]
}

export const EMPTY_STATS: Stats = {
    user: '',
    totalMinsPlayed: 0,
    topTracks: [],
    topArtists: [],
    topDays: [],
    tracksOnRepeat: []
}

export interface RawData {
    displayName: string;
    streamingHistory: StreamingHistory[];
}



export interface StreamingHistory {
    endTime: string;
    artistName: string;
    trackName: string;
    msPlayed: number;
}



// takes in raw data and returns Stats
export const calculateStats = (data: RawData): Stats => {
    // call functions
    const topStats = getTopStats(data.streamingHistory)
    const trackOnRepeat = getOnRepeatTrack(data.streamingHistory);
    const totalMinsPlayed = calculateTotalMinsPlayed(data.streamingHistory);

    // parse results from each into Stats
    let stats: Stats = {
        user: data.displayName,
        totalMinsPlayed: totalMinsPlayed,
        topTracks: topStats.topTracks,
        topArtists: topStats.topArtists,
        topDays: topStats.topDays,
        tracksOnRepeat: trackOnRepeat,
    };
    return stats
};

// top tracks and artists in the data set
//? returning all 3 at once since we are iterating over all streaming history
const getTopStats = (stream: StreamingHistory[]) => {
    const artistCount: { [key: string]: number } = {}
    const trackCount: { [key: string]: number } = {}
    const tracksPerDayCount: { [key: string]: number } = {} // tracks listened to per day
    const hourOfDayCount: { [key: number]: number } = {}
    const dayOfWeekCount: { [key: number]: number } = {}
    const tracksPerMonthCount: { [key: number]: number } = {}

    // iterate over stream history and count tracks and artists, & date data
    for (const item of stream) {

        const date = new Date(item.endTime)

        const artist = item.artistName;
        const track = item.trackName;
        const day = item.endTime.split(" ")[0] // split date and time and take only date

        // get hour from second half
        const hour = date.getHours()
        const dayOfWeek = date.getDay()
        const month = date.getMonth() + 1

        // set map counters to add the respective item count
        artistCount[artist] = (artistCount[artist] || 0) + 1;
        trackCount[track] = (trackCount[track] || 0) + 1;
        tracksPerDayCount[day] = (tracksPerDayCount[day] || 0) + 1;
        hourOfDayCount[hour] = (hourOfDayCount[hour] || 0) + 1;
        dayOfWeekCount[dayOfWeek] = (dayOfWeekCount[dayOfWeek] || 0) + 1;
        tracksPerMonthCount[month] = (tracksPerMonthCount[month] || 0) + 1;
    }

    // sort all maps
    const sortedArtists = Object.entries(artistCount).sort((a, b) => b[1] - a[1]);
    const sortedTracks = Object.entries(trackCount).sort((a, b) => b[1] - a[1]);
    const sortedTracksPerDay = Object.entries(tracksPerDayCount).sort((a, b) => b[1] - a[1])
    let sortedHours = Object.entries(hourOfDayCount).sort((a, b) => b[1] - a[1])
    let sortedDaysOfWeek = Object.entries(dayOfWeekCount).sort((a, b) => b[1] - a[1])
    let sortedTracksPerMonth = Object.entries(tracksPerMonthCount).sort((a, b) => b[1] - a[1])

    // map day and months to strings
    let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    sortedDaysOfWeek = sortedDaysOfWeek.map(([dayIndex, hour]) => [dayNames[+dayIndex], hour]);
    sortedTracksPerMonth = sortedTracksPerMonth.map(([monthIdx, month]) => [monthNames[+monthIdx], month]);

    console.log(sortedHours)
    console.log(sortedDaysOfWeek)
    console.log(sortedTracksPerMonth)

    return {
        topTracks: sortedTracks.splice(0, 50),
        topArtists: sortedArtists.splice(0, 50),
        topDays: sortedTracksPerDay.splice(0, 3),
    }
}


// returns the top 10 tracks played in the last month
const getOnRepeatTrack = (stream: StreamingHistory[]) => {
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);  // date 30 days ago

    // filter out records older than 30 days
    const recentStream = stream.filter(item => new Date(item.endTime) >= lastMonth);

    // count how many times each track was played
    const trackCount: { [key: string]: number } = {};
    for (const item of recentStream) {
        const track = item.trackName;
        trackCount[track] = (trackCount[track] || 0) + 1;
    }

    // sort the tracks by play count in descending order
    const sortedTracks = Object.entries(trackCount)
        .sort((a, b) => b[1] - a[1])

    return sortedTracks.splice(0, 10);
}

// total minutes played
const calculateTotalMinsPlayed = (stream: StreamingHistory[]): number => {
    let msPlayed = 0
    for (const item of stream) {
        msPlayed += item.msPlayed
    }
    return Math.round(msPlayed / (1000 * 60));
}