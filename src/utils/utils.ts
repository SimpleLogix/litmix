const MONTHS: Record<number, string> = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'Aug',
    8: 'Sept',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
}

const ColorMap: Record<number, string> = {

    0: "#fff",
    0.1: "#c5f4d1",
    0.2: "#b2efc7",
    0.3: "#9eeabc",
    0.4: "#8be5b2",
    0.5: "#78e0a8",
    0.6: "#64dba0",
    0.7: "#51d095",
    0.8: "#3ec58b",
    0.9: "#2bbf81",
    1: "#18ba77",
    404: "transparent",
};

export interface dateData {
    date: string;
    count: number;
}

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

// raw data type of heat map
export type heatmapDataType = Map<string, Map<string, Map<string, number>>>;

export function createDateValues(): heatmapDataType {
    const sample: heatmapDataType = new Map();

    const date = new Date(2016, 0, 1);
    for (let i = 0; i < 365; i++) {
        const year = date.getUTCFullYear().toString();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const count = Math.random();

        let yearMap = sample.get(year);
        if (!yearMap) {
            yearMap = new Map();
            sample.set(year, yearMap);
        }

        let monthRecord = yearMap.get(month);
        if (!monthRecord) {
            monthRecord = new Map();
            yearMap.set(month, monthRecord);
        }

        monthRecord.set(day, count);

        date.setUTCDate(date.getUTCDate() + 1);
    }

    console.log(sample.get("2016"));

    return sample;

}


// filter heatmap data based on month range
export const filterHeatmapData = (values: heatmapDataType, startDate: Date): dateData[] => {
    return Array.from(values.keys())
        .filter((year) => year === startDate.getFullYear().toString())
        .flatMap((year) => {
            const endDate = startDate.getMonth() + 3;
            return Array.from(values.get(year)?.keys() || [])
                .filter((month) => parseInt(month) >= (startDate.getMonth() + 1) && parseInt(month) <= (endDate))
                .flatMap((month) => {
                    // Use Array.from and .entries() to iterate through Map
                    return Array.from(values.get(year)?.get(month)?.entries() || []).map(
                        ([day, count]) => ({
                            date: `${year}-${month}-${day}`,
                            count,
                        })
                    );
                });
        });
};

// pad up the non - existent days
export const padMonthData = (values: dateData[], startDate: Date) => {
    const paddedValues: dateData[] = [];
    const startingMonth = startDate.getMonth(); // Start with the provided month
    let dayIndex = 0;

    for (let monthIndex = 0; monthIndex < 3; monthIndex++) {
        const month = (startingMonth + monthIndex) % 12;
        const firstDayOfMonth = new Date(startDate.getFullYear(), month, 1);
        const lastDayOfMonth = new Date(startDate.getFullYear(), month + 1, 0);

        // Fill in empty days before the first day of the month
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            paddedValues.push({ date: "", count: 404 }); // empty dateData
        }

        // Fill in the actual data for the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            paddedValues.push(values[dayIndex] || { date: "", count: 404 });
            dayIndex++;
        }

        // Fill in empty days after the last day of the month to reach 35
        while (paddedValues.length < (monthIndex + 1) * 35) {
            paddedValues.push({ date: "", count: 404 }); // empty dateData
        }
    }

    return paddedValues;
};
