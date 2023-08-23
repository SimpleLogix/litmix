import JSZip from 'jszip';
import { Stats, EMPTY_STATS } from './Stats';
import EMPTY_DATA, { Data, HeatmapData, HourlyData, MONTHS, YearlyData, YearlyDataType, heatmapDataType } from './globals';

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
    let yearlyData: YearlyDataType = {};

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
                        let json = JSON.parse(content) as StreamingHistory[];

                        let totalMsStreamed = 0;
                        let totalDays = 0;
                        let cumSum = 0;

                        for (let i = 0; i < 24; i++) {
                            const hourLabel = i < 12 ? `${i}am` : i === 12 ? `12pm` : `${i - 12}pm`;
                            hourlyData[hourLabel] = { hour: hourLabel, percent: 0, songCount: 0, msStreamed: 0 };
                        }

                        // Iterate through the streaming history
                        json.forEach((record, idx) => {
                            // Extract the date parts
                            const date = new Date(record.ts);
                            const year = date.getFullYear().toString();
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const day = date.getDate().toString().padStart(2, '0');

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

                            // Extract the hour part
                            const hour = date.getHours();
                            const hourLabel = hour < 12 ? `${hour}am` : hour === 12 ? `12pm` : `${hour - 12}pm`;

                            // Increment the stats for this hour
                            hourlyData[hourLabel].songCount++;
                            hourlyData[hourLabel].msStreamed += record.ms_played;

                            // Increment total ms streamed
                            totalMsStreamed += record.ms_played;
                            totalDays++;


                        });
                        // Calculate average ms streamed per day
                        let avgMsStreamedPerDay = totalMsStreamed / totalDays;

                        // Now, iterate through the heatmap to calculate top track and percentage difference
                        heatmap.forEach((yearMap, year) => {
                            // Calculate the total stream time for the year
                            let streamTimeForYear = 0;
                            yearMap.forEach(monthMap => {
                                monthMap.forEach((dayData, day) => {
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
                                    dayData.colorValue = ((dayData.msStreamed - avgMsStreamedPerDay) / avgMsStreamedPerDay);

                                    // Update the day data
                                    monthMap.set(day, dayData);

                                    // sum stream time for year
                                    streamTimeForYear += dayData.msStreamed;
                                });
                            });

                            // Update the cumulative sum
                            cumSum += streamTimeForYear;
                            console.log(cumSum, `|${year}|`)

                            yearlyData[year] = {
                                year: year,
                                streamTime: streamTimeForYear,
                                cumSum: cumSum
                            };

                            //! last left off somewhere here trying to figure out if the heatmap is working properly.

                            //! seems like everything is except how im calculating the values and cum sum

                        });

                        // iterate over hourly data to find % diff from avg
                        for (const hourLabel in hourlyData) {
                            hourlyData[hourLabel].percent = (hourlyData[hourLabel].msStreamed / totalMsStreamed) * 100;
                        }
                    }
                });

                // Wait for all data to be gathered
                await Promise.all(promises);

                // Call back the heatmap
                callBack({ heatmapData: heatmap, topArtistsData: [], hourlyData: hourlyData, weekdayData: [], yearlyData: yearlyData });
            }
        };
        reader.readAsArrayBuffer(file);
    }
    else {
        callBack(EMPTY_DATA);
    }
};




// fetch data from local storage
const checkExistingData = (): Stats => {
    return localStorage.getItem("data")
        ? JSON.parse(localStorage.getItem("data")!)
        : EMPTY_STATS;
};

export { handleUploadedFile, checkExistingData }