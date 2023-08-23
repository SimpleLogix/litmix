import React, { useState } from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import { createDateValues, generateWeekdayData } from "./utils/utils";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import {
  Data,
  HourlyData,
  TopArtistsData,
  YearlyDataType,
} from "./utils/globals";
import "./styles/animations.css";

function App() {
  const [page, setPage] = useState("Dashboard");

  //? Fetch data
  // ? USing dummy data for now
  const heatmapData = createDateValues();
  const weekdayData = generateWeekdayData();

  const topArtistsData: TopArtistsData[] = [
    {
      artistImg: "dae.jpg",
      name: "Dae Zhen",
      msStreamed: 1337,
      playCount: 420,
      topTrack: "Lately (Drugs)",
      discovered: "Aug 19, 2023",
    },
    {
      artistImg: "zervas.jpg",
      name: "Arizona Zervas",
      msStreamed: 2005,
      playCount: 999,
      topTrack: "Roxanne",
      discovered: "Aug 19, 2023",
    },
    {
      artistImg: "drake.jpg",
      name: "Drake",
      msStreamed: 2005,
      playCount: 999,
      topTrack: "Hotline Bling",
      discovered: "Aug 19, 2023",
    },
  ];
  const hourlyData: Record<string, HourlyData> = {
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

  const SP_DATA: YearlyDataType = {
    "2017": { year: "2017", streamTime: 200, cumSum: 200 },
    "2018": { year: "2018", streamTime: 300, cumSum: 500 },
    "2019": { year: "2019", streamTime: 400, cumSum: 900 },
    "2020": { year: "2020", streamTime: 550, cumSum: 1450 },
    "2021": { year: "2021", streamTime: 700, cumSum: 2150 },
    "2022": { year: "2022", streamTime: 1800, cumSum: 2950 },
  };

  const data: Data = {
    heatmapData,
    topArtistsData,
    hourlyData,
    weekdayData,
    yearlyData: SP_DATA,
  };

  return (
    <div className="app">
      <SideFrame page={page} setPage={setPage}></SideFrame>

      <div className="border"></div>

      <div className="main-frame center">
        {page === "Dashboard" ? <Dashboard data={data} /> : <Discover />}
      </div>
    </div>
  );
}

export default App;
