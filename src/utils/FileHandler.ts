import JSZip from 'jszip';
import EMPTY_DATA, { DAYS, Data, HeatmapData, HourlyData, MONTHS, TopArtistsData, TopStatData, WeekdayData, WeekdayDataType, heatmapDataType } from './globals';
import { generateData } from './utils';

type StreamingHistory = {
    // Define the fields based on the example JSON provided
    ts: string;
    ms_played: number;
    master_metadata_track_name: string;
    master_metadata_album_artist_name: string;
    master_metadata_album_album_name: string;
};

export const handleUploadedFile = (file: File, callBack: (heatmap: Data) => void) => {
    // Initial structure for our heatmap
    let heatmap: heatmapDataType = {};
    let hourlyData: Record<string, HourlyData> = {};
    let years: string[] = [];

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
    const artistCount: Record<string, Record<string, any>> = {}
    const trackCount: Record<string, Record<string, any>> = {}
    const albumCount: Record<string, Record<string, any>> = {}

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
                            //TODO- find true % diff from avg ms per day

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
                                    'playCount': 0,
                                    'trackCount': 0,
                                }
                            }
                            if (!trackCount[record.master_metadata_track_name]) {
                                trackCount[record.master_metadata_track_name] = {
                                    'playCount': 0,
                                    'msStreamed': 0,
                                };
                            }
                            if (!albumCount[record.master_metadata_album_album_name]) {
                                albumCount[record.master_metadata_album_album_name] = {
                                    'playCount': 0,
                                    'msStreamed': 0,
                                };
                            }

                            // update the top artists, tracks, and albums
                            artistCount[record.master_metadata_album_artist_name]['playCount'] = (artistCount[record.master_metadata_album_artist_name]['playCount'] || 0) + 1;

                            // TODO - track first time played
                            // TODO - track msStreamed
                            trackCount[record.master_metadata_track_name]['playCount'] = (trackCount[record.master_metadata_track_name]['playCount'] || 0) + 1;

                            albumCount[record.master_metadata_album_album_name]['playCount'] = (albumCount[record.master_metadata_album_album_name]['playCount'] || 0) + 1;

                            // check if year exists
                            if (!years.includes(year)) {
                                years.push(year);
                            }
                        });

                    }
                });
                // Wait for all data to be gathered
                await Promise.all(promises);

                // Call back the data
                callBack({
                    heatmapData: heatmap,
                    topArtistsData: convertToTopStatData(artistCount),
                    topTracksData: convertToTopStatData(trackCount),
                    topAlbumsData: convertToTopStatData(albumCount),
                    hourlyData: hourlyData,
                    weekdayData: convertToWeekdayDataType(daysData, totalMsStreamed),
                    years: sortYears(years),
                    yearlyData: {}, // calculated later in Stats after all data is made availble
                });
            }
        };
        reader.readAsArrayBuffer(file);
    }
    else {
        callBack(EMPTY_DATA);
    }
};

const sortYears = (years: string[]): string[] => {
    return years.sort((a, b) => parseInt(a) - parseInt(b));
}

const convertToTopStatData = (count: Record<string, Record<string, any>>): TopStatData[] => {
    return Object.entries(count)
        .sort((a, b) => b[1].playCount - a[1].playCount)
        .slice(0, 20)
        .map(([name, data]) => ({
            img: '',
            name: name,
            msStreamed: 0,
            playCount: data.playCount,
            topTrack: '',
            discovered: '',
        }));
};

//* note that this is not the full stats. some other analysis is requried to derive top and avg
//* later in the stats.ts file
const convertToWeekdayDataType = (daysData: Record<string, Record<string, any>>, totalMsStreamed: number): WeekdayDataType => {
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

// fetch data from local storage
export const checkExistingData = (): Data => {
    return localStorage.getItem("data")
        ? JSON.parse(localStorage.getItem("data")!) as Data
        : generateData();
};


export const saveData = (data: Data) => {
    localStorage.setItem("data", JSON.stringify(data));
}