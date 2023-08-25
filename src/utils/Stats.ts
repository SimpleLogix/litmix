import { Data } from "./globals";

/// Takes a Data object and analyzes the data to add additional fields
export const analyzeUserData = (data: Data) => {

    // average ms streamed per day
    let totalMsStreamed = 0;
    let totalDays = 0;
    let minMsStreamed = Number.MAX_SAFE_INTEGER;
    let maxMsStreamed = Number.MIN_SAFE_INTEGER;

    for (const year in data.heatmapData) {
        const yearMap = data.heatmapData[year];
        for (const month in yearMap) {
            const monthMap = yearMap[month];
            for (const day in monthMap) {
                const dayData = monthMap[day];
                totalMsStreamed += dayData.msStreamed;
                totalDays++;
                minMsStreamed = Math.min(minMsStreamed, dayData.msStreamed);
                maxMsStreamed = Math.max(maxMsStreamed, dayData.msStreamed);
            }
        }
    }

    const avgMsStreamedPerDay = totalMsStreamed / totalDays;



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

//