export interface Data {
  heatmapData: heatmapDataType;
  topArtistsData: Record<string, Artist>;
  topTracksData: Record<string, Track>; // id -> track data
  hourlyData: Record<string, HourlyData>;
  weekdayData: WeekdayDataType;
  yearlyData: YearlyDataType;
  years: string[] // years that have data
  displayName: string;
  username: string;
  profileImage: string;
  genres: Record<string, number>;
  joinDate: string;
  recommendationSeeds: Record<string, string>[];
  recommendations: Track[];
}

export interface HeatmapData {
  date: string; // The date on which the music was played
  songCount: number; // The total number of songs played on that date
  msStreamed: number; // The total milliseconds streamed on that date
  colorValue: number; // A percentage used for determining the color (e.g., 0 to 100)
  topTrack: string;
  topTrackCount: number;
  tracks?: Record<string, number>;
}


export interface TopStat {
  id: string;
  name: string;
  artistName: string;
  image: string;
  playCount: number;
  msStreamed: number;
  discovered: string;
  genres: string[];
  topTrack?: string;
  previewUrl?: string;
}

export interface Track extends TopStat { }
export interface Artist extends TopStat { }

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



export interface UserFile {
  name: string;
  file: File;
  stats: Data;
}

export const EMPTY_DATA: Data = {
  heatmapData: {},
  topArtistsData: {},
  topTracksData: {},
  hourlyData: {},
  weekdayData: {},
  yearlyData: {},
  years: [],
  displayName: "Username",
  username: "",
  joinDate: "Aug. 12, 2022",
  profileImage: "",
  genres: {},
  recommendationSeeds: [],
  recommendations: []
}

export interface SpotifyArtistData {
  name: string;
  image: string;
  genres: string[];
  id: string;
}

export interface SpotifyTrackData {
  id: string;
  name: string;
  artistID: string;
  image: string;
}

export interface Card {
  type: string;
  id: string;
  name: string;
  artistName: string;
  image: string;
  playCount: number;
  msStreamed: number;
  discovered: string;
  genres: string[];
  topTrack?: string | undefined;
  selected: boolean;
}

export const TOP_ARTISTS_NUM = 15;
export const TOP_TRACKS_NUM = 25;

// raw data type of heat map
// {'2016' : {
//      '01' : {
//          '01' : 0.5
// }}
export type heatmapDataType = Record<string, Record<string, Record<string, HeatmapData>>>;

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

  0: "#c5f4d1",
  1: "#b2efc7",
  2: "#9eeabc",
  3: "#8be5b2",
  4: "#18ba77",
  5: "#64dba0",
  6: "#51d095",
  7: "#3ec58b",
  8: "#2bbf81",
  9: "#18ba77",
  10: "#05b46d",
  404: "transparent",
};

//* DUMMY DATA

export const GENRES: Record<string, number> = {
  "Pop": 20,
  "Hip Hop": 15,
  "Rock": 10,
  "Jazz": 5,
  "Classical": 5,
  "Electronic": 5
}
  ;

export const topArtistsDummy: Record<string, Artist> = {
  "Dae Zhen": {
    image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
    id: "dae",
    name: "Dae Zhen",
    artistName: "Dae Zhen",
    genres: [],
    msStreamed: 1337,
    playCount: 420,
    topTrack: "Lately (Drugs)",
    discovered: "Aug 19, 2023",
  },
  "Arizona Zervas": {
    image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
    id: "zervas",
    name: "Arizona Zervas",
    artistName: "Arizona Zervas",
    genres: [],
    msStreamed: 2005,
    playCount: 999,
    topTrack: "Roxanne",
    discovered: "Aug 19, 2023",
  },
  "Drake": {
    image: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
    id: "drake",
    name: "Drake",
    artistName: "Drake",
    genres: [],
    msStreamed: 2005,
    playCount: 999,
    topTrack: "Hotline Bling",
    discovered: "Aug 19, 2023",
  },
};

export const hourlyDataDummy: Record<string, HourlyData> = {
  "12am": {
    hour: "12am",
    percent: 0.1,
    songCount: 1,
    msStreamed: 10,
  },
  "1am": {
    hour: "1am",
    percent: 0.2,
    songCount: 2,
    msStreamed: 20,
  },
  "2am": {
    hour: "2am",
    percent: 0.3,
    songCount: 3,
    msStreamed: 30,
  },
  "3am": {
    hour: "3am",
    percent: 0.4,
    songCount: 4,
    msStreamed: 40,
  },
  "4am": { hour: "4am", percent: 0.5, songCount: 5, msStreamed: 50 },
  "5am": { hour: "5am", percent: 0.6, songCount: 6, msStreamed: 60 },
  "6am": { hour: "6am", percent: 0.7, songCount: 7, msStreamed: 70 },
  "7am": { hour: "7am", percent: 0.8, songCount: 8, msStreamed: 80 },
  "8am": { hour: "8am", percent: 0.9, songCount: 9, msStreamed: 90 },
  "9am": { hour: "9am", percent: 0.1, songCount: 1, msStreamed: 10 },
  "10am": { hour: "10am", percent: 0.2, songCount: 2, msStreamed: 20 },
  "11am": { hour: "11am", percent: 0.3, songCount: 3, msStreamed: 30 },
  "12pm": { hour: "12pm", percent: 0.4, songCount: 4, msStreamed: 40 },
  "1pm": { hour: "1pm", percent: 0.5, songCount: 5, msStreamed: 50 },
  "2pm": { hour: "2pm", percent: 0.6, songCount: 6, msStreamed: 60 },
  "3pm": { hour: "3pm", percent: 0.7, songCount: 7, msStreamed: 70 },
  "4pm": { hour: "4pm", percent: 0.8, songCount: 8, msStreamed: 80 },
  "5pm": { hour: "5pm", percent: 0.9, songCount: 9, msStreamed: 90 },
  "6pm": { hour: "6pm", percent: 0.1, songCount: 1, msStreamed: 10 },
  "7pm": { hour: "7pm", percent: 0.2, songCount: 2, msStreamed: 20 },
  "8pm": { hour: "8pm", percent: 0.3, songCount: 3, msStreamed: 70 },
  "9pm": { hour: "9pm", percent: 0.4, songCount: 4, msStreamed: 40 },
  "10pm": { hour: "10pm", percent: 0.5, songCount: 5, msStreamed: 50 },
  "11pm": { hour: "11pm", percent: 0.6, songCount: 6, msStreamed: 60 },
};

export const yearlyDataDummy: YearlyDataType = {
  "2017": { year: "2017", streamTime: 200, cumSum: 200 },
  "2018": { year: "2018", streamTime: 300, cumSum: 500 },
  "2019": { year: "2019", streamTime: 400, cumSum: 900 },
  "2020": { year: "2020", streamTime: 550, cumSum: 1450 },
  "2021": { year: "2021", streamTime: 700, cumSum: 2150 },
  "2022": { year: "2022", streamTime: 1800, cumSum: 2950 },
};

export const recsDummy: Track[] = [
  {
    id: '',
    name: 'Song 1',
    artistName: 'Artist 1',
    image: '',
    playCount: 0,
    msStreamed: 0,
    discovered: '',
    genres: [],
    topTrack: '',
    previewUrl: ''
  }
]