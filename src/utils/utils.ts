import EMPTY_DATA, { ColorMap, DAYS, Data, HeatmapData, MONTHS, WeekdayDataType, heatmapDataType, hourlyDataDummy, topArtistsDummy, yearlyDataDummy } from "./globals";

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
    const color = ColorMap[Math.floor(num*10)];
    return color || ColorMap[404];
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
export const generateData = (): Data => {
    const data = { ...EMPTY_DATA };
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