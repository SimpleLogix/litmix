import JSZip from 'jszip';
import EMPTY_DATA, { DAYS, Data, HeatmapData, HourlyData, MONTHS, WeekdayData, WeekdayDataType, heatmapDataType } from './globals';

type StreamingHistory = {
    // Define the fields based on the example JSON provided
    ts: string;
    ms_played: number;
    master_metadata_track_name: string;
};

const handleUploadedFile = (file: File, callBack: (heatmap: Data) => void) => {
    // Initial structure for our heatmap
    let heatmap: heatmapDataType = new Map();
    let hourlyData: Record<string, HourlyData> = {};

    let totalMsStreamed = 0;
    const daysData: Record<string, Record<string, any>> = {
        'Mon': {
            'msStreamed': 0,
            'time': {
                '0am': 0,
            }
        }

    }

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
                            const yearMap = heatmap.get(year) || new Map();
                            const monthMap = yearMap.get(month) || new Map();
                            const dayData: HeatmapData = monthMap.get(day) || { date: `${month}/${day}`, songCount: 0, msStreamed: 0, topTrack: '', tracks: {} };

                            // track info
                            dayData.tracks![record.master_metadata_track_name] = (dayData.tracks![record.master_metadata_track_name] || 0) + 1;

                            // Increment the stats
                            dayData.date = `${MONTHS[parseInt(month)]}. ${day}`;
                            dayData.songCount++;
                            dayData.msStreamed += record.ms_played;
                            //TODO- find true % diff from avg ms per day

                            // Update the maps
                            monthMap.set(day, dayData);
                            yearMap.set(month, monthMap);
                            heatmap.set(year, yearMap);

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
                            totalMsStreamed+=record.ms_played;
                        });
                    }
                });
                // Wait for all data to be gathered
                await Promise.all(promises);

                // Call back the heatmap
                callBack({ heatmapData: heatmap, topArtistsData: [], hourlyData: hourlyData, weekdayData: convertToWeekdayDataType(daysData, totalMsStreamed), yearlyData: {} });
            }
        };
        reader.readAsArrayBuffer(file);
    }
    else {
        callBack(EMPTY_DATA);
    }
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
const checkExistingData = (): Data => {
    return localStorage.getItem("data")
        ? JSON.parse(localStorage.getItem("data")!)
        : EMPTY_DATA;
};

export { handleUploadedFile, checkExistingData }