export interface HeatmapData {
  date: string; // The date on which the music was played
  songCount: number; // The total number of songs played on that date
  msStreamed: number; // The total milliseconds streamed on that date
  colorValue: number; // A percentage used for determining the color (e.g., 0 to 100)
  topTrack: string;
  topTrackCount: number;
  tracks?: Record<string, number>;
}

export interface TopArtistsData {
  artistImg: string;
  name: string;
  msStreamed: number;
  playCount: number;
  topTrack: string;
  discovered: string;
}

export interface HourlyData {
  hour: string;
  percent: number;
  songCount: number;
  msStreamed: number;
}

export interface WeekdayData {
  day: string;
  percent: number;
  mostActive: string;
}

export type WeekdayDataType = Record<string, WeekdayData>

export type YearlyDataType = Record<string, YearlyData>

export interface YearlyData { year: string, streamTime: number, cumSum: number }

export interface Data {
  heatmapData: heatmapDataType;
  topArtistsData: TopArtistsData[];
  hourlyData: Record<string, HourlyData>;
  weekdayData: WeekdayDataType;
  yearlyData: YearlyDataType;
}

export interface UserFile {
  name: string;
  file: File;
  stats: Data;
}

const EMPTY_DATA: Data = {
  heatmapData: new Map(),
  topArtistsData: [],
  hourlyData: {},
  weekdayData: {},
  yearlyData: {},
}

export default EMPTY_DATA;

// raw data type of heat map
// {'2016' : {
//      '01' : {
//          '01' : 0.5
// }}
export type heatmapDataType = Map<string, Map<string, Map<string, HeatmapData>>>;

export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export const MONTHS: Record<number, string> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}

export const DAYS: Record<number, string> = { 
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
}

export const ColorMap: Record<number, string> = {

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
