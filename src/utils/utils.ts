import { ColorMap, HeatmapData, MONTHS, WeekdayData, heatmapDataType, weekdays } from "./globals";

// takes a number and returns a human-readable string
// 18,123,456 => 18.1m
// 123,456 => 123k 
export const stringifyNum = (num: number) => {
    const suffix = num < 1000 ? '' : num < 1000000 ? 'k' : 'm';
    const divisor = num < 1000 ? 1 : num < 1000000 ? 100 : 1000000;
    let result = (num / divisor).toFixed(1);

    if (result.endsWith('.0')) {
        result = result.slice(0, -2);
    }

    return result + suffix;
}
//  takes start date and returns the next 3 months
export const getMonths = (startDate: Date) => {
    const months: string[] = [];
    for (let i = 0; i < 3; i++) {
        const newDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + i));
        const monthIdx = newDate.getUTCMonth();
        months.push(MONTHS[monthIdx]!);
    }
    return months;
};


// takes a number and returns a color
export const getColor = (num: number) => {
    const color = ColorMap[Math.floor(num * 10) / 10];
    return color || ColorMap[0];
}

//* generator
export function createDateValues(): heatmapDataType {
    const sample: heatmapDataType = new Map();
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

        let yearMap = sample.get(year);
        if (!yearMap) {
            yearMap = new Map();
            sample.set(year, yearMap);
        }

        let monthMap = yearMap.get(month);
        if (!monthMap) {
            monthMap = new Map();
            yearMap.set(month, monthMap);
        }

        const heatmapData: HeatmapData = { date: `${year}-${month}-${day}`, songCount, msStreamed, colorValue, topTrack, topTrackCount };
        monthMap.set(day, heatmapData);

        date.setUTCDate(date.getUTCDate() + 1);
    }
    return sample;
}

//* generator
export const generateWeekdayData = (): WeekdayData[] => {
    const data: WeekdayData[] = [];
    for (let i = 0; i < 7; i++) {
        data.push({
            day: weekdays[i],
            percent: Math.floor(Math.random() * 100),
            mostActive: `${Math.floor(Math.random() * 12)}pm`,
        });
    }
    return data;
};

// filter heatmap data based on month range
export const filterHeatmapData = (values: heatmapDataType, startDate: Date): HeatmapData[] => {
    return Array.from(values.keys())
        .filter((year) => year === startDate.getFullYear().toString())
        .flatMap((year) => {
            const endDate = startDate.getMonth() + 3;
            return Array.from(values.get(year)?.keys() || [])
                .filter((month) => parseInt(month) >= (startDate.getMonth() + 1) && parseInt(month) <= (endDate))
                .flatMap((month) => Array.from(values.get(year)?.get(month)?.values() || []));
        });
};


// pad up the non - existent days
export const padMonthData = (values: HeatmapData[], startDate: Date) => {
    const paddedValues: HeatmapData[] = [];
    const startingMonth = startDate.getMonth(); // Start with the provided month
    let dayIndex = 0;

    for (let monthIndex = 0; monthIndex < 3; monthIndex++) {
        const month = (startingMonth + monthIndex) % 12;
        const firstDayOfMonth = new Date(startDate.getFullYear(), month, 1);
        const lastDayOfMonth = new Date(startDate.getFullYear(), month + 1, 0);

        // Fill in empty days before the first day of the month
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            paddedValues.push({ date: "", colorValue: 404, msStreamed: -1, songCount: -1, topTrack: "", topTrackCount: -1 }); // empty dateData
        }

        // Fill in the actual data for the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            paddedValues.push(values[dayIndex] || { date: "", count: 404 });
            dayIndex++;
        }

        // Fill in empty days after the last day of the month to reach 35
        while (paddedValues.length < (monthIndex + 1) * 35) {
            paddedValues.push({ date: "", colorValue: 404, msStreamed: -1, songCount: -1, topTrack: "", topTrackCount: -1 }); // empty dateData
        }
    }

    return paddedValues;
};
