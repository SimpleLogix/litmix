import { DAYS, Data, heatmapDataType } from "./globals";

export const analyzeUserData = (data: Data) => {



    // average ms streamed per day
    let totalMsStreamed = 0;
    let totalDays = 0;

    data.heatmapData.forEach((yearMap, year) => {
        yearMap.forEach((monthMap, month) => {
            monthMap.forEach((dayData, day) => {
                totalMsStreamed += dayData.msStreamed;
                totalDays++;
            });
        });
    });

    const avgMsStreamedPerDay = totalMsStreamed / totalDays;



    // iterate through heatmap to calculate top track and percentage difference
    data.heatmapData.forEach((yearMap, year) => {
        let yearMsStreamed = 0;
        yearMap.forEach((monthMap, month) => {
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

                //update values for yearly data
                yearMsStreamed += dayData.msStreamed;
            });
        });
        // Update the cumulative sum
        data.yearlyData[year] = { year: year, streamTime: yearMsStreamed, cumSum: 0 };
    });

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