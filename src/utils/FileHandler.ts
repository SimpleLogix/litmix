import JSZip from 'jszip';
import { EMPTY_DATA, DAYS, Data, HeatmapData, HourlyData, heatmapDataType, Track, Artist } from './globals';
import { convertToWeekdayDataType, getEarliestDate, getTopTracks, getUsername, sortYears, updateTopTrackForArtists, uriToID } from './utils';
import { requestSpotifyData } from './RESTCalls';

type StreamingHistory = {
    // Define the fields based on Spotfy Data 
    username: string;
    ts: string;
    ms_played: number;
    master_metadata_track_name: string;
    master_metadata_album_artist_name: string;
    master_metadata_album_album_name: string;
    spotify_track_uri: string;
};

export const handleUploadedFile = (file: File, callBack: (heatmap: Data) => void) => {
    // Initial structure for our heatmap
    let heatmap: heatmapDataType = {};
    let hourlyData: Record<string, HourlyData> = {};
    let years: string[] = [];
    const userNameCount: Record<string, number> = {}
    const trackCount: Record<string, Track> = {};
    const artistCount: Record<string, Artist> = {}

    // raw data taken from file before being proccessed
    let totalMsStreamed = 0;
    const daysData: Record<string, Record<string, any>> = {
        'Mon': {
            'msStreamed': 0,
            'time': {
                '0am': 0,
            }
        }
    }
    // count for each track for each artist
    const artistTrackCount: Record<string, Record<string, number>> = {}

    // Check file format
    if (file.name === "my_spotify_data.zip") {
        let reader = new FileReader();
        reader.onload = async function (e) {
            if (e.target!.result) {
                let data = e.target!.result;
                // Open zip file
                let zip = await JSZip.loadAsync(data);
                let promises = Object.entries(zip.files).map(async ([relativePath, zipEntry]) => {
                    if (relativePath.includes("Streaming_History_Audio")) {
                        let content = await zip.file(relativePath)!.async('string');
                        let streamHistory = JSON.parse(content) as StreamingHistory[];

                        // Iterate through the streaming history
                        streamHistory.forEach((record, idx) => {
                            if (record.spotify_track_uri) {
                                const trackID = uriToID(record.spotify_track_uri);
                                // Extract the date parts
                                const date = new Date(record.ts);
                                const year = date.getFullYear().toString();
                                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                const day = date.getDate().toString().padStart(2, '0');
                                const hour = date.getHours();
                                const hourLabel = hour < 12 ? `${hour}am` : hour === 12 ? `12pm` : `${hour - 12}pm`;
                                const dayOfWeek = DAYS[date.getDay()];

                                // Get or initialize structure
                                const yearObj = heatmap[year] || (heatmap[year] = {});
                                const monthObj = yearObj[month] || (yearObj[month] = {});
                                const dayData: HeatmapData = monthObj[day] || { date: `${year}-${month}-${day}`, songCount: 0, msStreamed: 0, topTrack: '', tracks: {} };


                                // track info
                                dayData.tracks![record.master_metadata_track_name] = (dayData.tracks![record.master_metadata_track_name] || 0) + 1;

                                // Increment the stats
                                dayData.date = `${year}-${month}-${day}`;
                                dayData.songCount++;
                                dayData.msStreamed += record.ms_played;

                                // Update the objects
                                monthObj[day] = dayData;
                                yearObj[month] = monthObj;
                                heatmap[year] = yearObj;

                                if (!hourlyData[hourLabel]) {
                                    hourlyData[hourLabel] = { hour: hourLabel, songCount: 0, msStreamed: 0, percent: 0 };
                                }

                                // Increment the stats for this hour
                                hourlyData[hourLabel].songCount++;
                                hourlyData[hourLabel].msStreamed += record.ms_played;

                                // Update the day of the week data
                                if (!daysData[dayOfWeek]) {
                                    daysData[dayOfWeek] = {
                                        'msStreamed': 0,
                                        'time': {
                                            '0am': 0,
                                        }
                                    }
                                }
                                if (!daysData[dayOfWeek].time[hourLabel]) {
                                    daysData[dayOfWeek].time[hourLabel] = 0;
                                }
                                daysData[dayOfWeek].msStreamed += record.ms_played;
                                daysData[dayOfWeek].time[hourLabel] = (daysData[dayOfWeek].time[hourLabel] || 0) + record.ms_played;
                                totalMsStreamed += record.ms_played;

                                // check if track, artist, album exists
                                if (!artistCount[record.master_metadata_album_artist_name]) {
                                    artistCount[record.master_metadata_album_artist_name] = {
                                        id: "",
                                        name: record.master_metadata_album_artist_name,
                                        artistName: record.master_metadata_album_artist_name,
                                        image: "",
                                        genres: [],
                                        'playCount': 0,
                                        'msStreamed': 0,
                                        'discovered': record.ts,
                                    }
                                }
                                if (!trackCount[trackID]) {
                                    trackCount[trackID] = {
                                        id: trackID,
                                        name: record.master_metadata_track_name,
                                        artistName: record.master_metadata_album_artist_name,
                                        image: "",
                                        genres: [],
                                        'playCount': 0,
                                        'msStreamed': 0,
                                        'discovered': record.ts,
                                    };
                                }

                                // update the top artists, tracks, and albums
                                artistCount[record.master_metadata_album_artist_name]['playCount'] = (artistCount[record.master_metadata_album_artist_name]['playCount'] || 0) + 1;
                                artistCount[record.master_metadata_album_artist_name]['msStreamed'] += record.ms_played;
                                trackCount[trackID]['playCount'] += 1;
                                trackCount[trackID]['msStreamed'] += record.ms_played;

                                // check if discovered date is earlier than current
                                if (record.ts < artistCount[record.master_metadata_album_artist_name]['discovered']) {
                                    artistCount[record.master_metadata_album_artist_name]['discovered'] = record.ts;
                                }
                                if (record.ts < trackCount[trackID]['discovered']) {
                                    trackCount[trackID]['discovered'] = record.ts;
                                }

                                // check if track exists for artist
                                if (!artistTrackCount[record.master_metadata_album_artist_name]) {
                                    artistTrackCount[record.master_metadata_album_artist_name] = {};
                                }
                                artistTrackCount[record.master_metadata_album_artist_name][record.master_metadata_track_name] = (artistTrackCount[record.master_metadata_album_artist_name][record.master_metadata_track_name] || 0) + 1;

                                // check if year exists
                                if (!years.includes(year)) {
                                    years.push(year);
                                }

                                // check if username exists
                                userNameCount[record.username] = (userNameCount[record.username] || 0) + 1;
                            }
                        });

                    }
                });
                // Wait for all data to be gathered
                await Promise.all(promises);


                const userData: Data = {
                    heatmapData: heatmap,
                    topArtistsData: artistCount,
                    topTracksData: getTopTracks(trackCount), // will be updated in analyzeUserData
                    hourlyData: hourlyData,
                    weekdayData: convertToWeekdayDataType(daysData, totalMsStreamed),
                    years: sortYears(years),
                    yearlyData: {}, // will be updated in analyzeUserData
                    displayName: "",
                    joinDate: getEarliestDate(heatmap, years),
                    username: getUsername(userNameCount),
                    profileImage: "",
                    genres: {},
                };
                // update the data
                analyzeUserData(userData); // update the yearly data
                await requestSpotifyData(userData)
                updateTopTrackForArtists(userData, artistTrackCount, artistCount)

                // Call back the data
                callBack(userData);
            }
        };
        reader.readAsArrayBuffer(file);
    }
    else {
        callBack(EMPTY_DATA);
    }
};

/// Takes a Data object and analyzes the data to add additional fields
// specificallt the yearlyData and colorValue fields in the heatmap
const analyzeUserData = (data: Data) => {

    // average ms streamed per day
    // let totalMsStreamed = 0;
    // let totalDays = 0;
    let minMsStreamed = Number.MAX_SAFE_INTEGER;
    let maxMsStreamed = Number.MIN_SAFE_INTEGER;

    for (const year in data.heatmapData) {
        const yearMap = data.heatmapData[year];
        for (const month in yearMap) {
            const monthMap = yearMap[month];
            for (const day in monthMap) {
                const dayData = monthMap[day];
                // totalMsStreamed += dayData.msStreamed;
                // totalDays++;
                minMsStreamed = Math.min(minMsStreamed, dayData.msStreamed);
                maxMsStreamed = Math.max(maxMsStreamed, dayData.msStreamed);
            }
        }
    }

    // const avgMsStreamedPerDay = totalMsStreamed / totalDays;


    for (const year in data.heatmapData) {
        let yearMsStreamed = 0;
        const yearMap = data.heatmapData[year];
        for (const month in yearMap) {
            const monthMap = yearMap[month];
            for (const day in monthMap) {
                const dayData = monthMap[day];

                // Find the top track for the day
                let topTrackName = '';
                let topTrackCount = 0;
                for (const [trackName, count] of Object.entries(dayData.tracks!)) {
                    if (count > topTrackCount) {
                        topTrackCount = count;
                        topTrackName = trackName;
                    }
                }

                // Set the top track
                dayData.topTrack = topTrackName;
                dayData.topTrackCount = topTrackCount;

                // Calculate the percentage difference
                dayData.colorValue = ((dayData.msStreamed - minMsStreamed) / (maxMsStreamed - minMsStreamed));

                // Update the day data
                monthMap[day] = dayData;

                // Update values for yearly data
                yearMsStreamed += dayData.msStreamed;
            }
        }
        // Update the cumulative sum
        data.yearlyData[year] = { year: year, streamTime: yearMsStreamed, cumSum: 0 };
    }


    // calculate cumulative sum
    let yearlyArray = Object.values(data.yearlyData);
    yearlyArray.sort((a, b) => parseInt(a.year) - parseInt(b.year)); // sort by year
    let cumSum = 0;
    yearlyArray.forEach(yearData => {
        cumSum += yearData.streamTime;
        yearData.cumSum = cumSum;
    });

    yearlyArray.forEach(yearData => {
        data.yearlyData[yearData.year] = yearData;
    });
}

