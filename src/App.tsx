import React, { useState } from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import { createDateValues, generateWeekdayData } from "./utils/utils";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import { Data, HourlyData, TopArtistsData } from "./utils/globals";

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
      minsStreamed: 1337,
      playCount: 420,
      topTrack: "Lately (Drugs)",
      discovered: "Aug 19, 2023",
    },
    {
      artistImg: "zervas.jpg",
      name: "Arizona Zervas",
      minsStreamed: 2005,
      playCount: 999,
      topTrack: "Roxanne",
      discovered: "Aug 19, 2023",
    },
    {
      artistImg: "drake.jpg",
      name: "Drake",
      minsStreamed: 2005,
      playCount: 999,
      topTrack: "Hotline Bling",
      discovered: "Aug 19, 2023",
    },
  ];
  const hourlyData: HourlyData[] = [
    {
      hour: "12am",
      percent: 0.1,
      songCount: 1,
      minsStreamed: 10,
      idx: 0,
    },
    {
      hour: "1am",
      percent: 0.2,
      songCount: 2,
      minsStreamed: 20,
      idx: 1,
    },
    {
      hour: "2am",
      percent: 0.3,
      songCount: 3,
      minsStreamed: 30,
      idx: 2,
    },
    {
      hour: "3am",
      percent: 0.4,
      songCount: 4,
      minsStreamed: 40,
      idx: 3,
    },
    { hour: "4am", percent: 0.5, songCount: 5, minsStreamed: 50, idx: 4 },
    { hour: "5am", percent: 0.6, songCount: 6, minsStreamed: 60, idx: 5 },
    { hour: "6am", percent: 0.7, songCount: 7, minsStreamed: 70, idx: 6 },
    { hour: "7am", percent: 0.8, songCount: 8, minsStreamed: 80, idx: 7 },
    { hour: "8am", percent: 0.9, songCount: 9, minsStreamed: 90, idx: 8 },
    { hour: "9am", percent: 0.1, songCount: 1, minsStreamed: 10, idx: 9 },
    { hour: "10am", percent: 0.2, songCount: 2, minsStreamed: 20, idx: 10 },
    { hour: "11am", percent: 0.3, songCount: 3, minsStreamed: 30, idx: 11 },
    { hour: "12pm", percent: 0.4, songCount: 4, minsStreamed: 40, idx: 0 },
    { hour: "1pm", percent: 0.5, songCount: 5, minsStreamed: 50, idx: 1 },
    { hour: "2pm", percent: 0.6, songCount: 6, minsStreamed: 60, idx: 2 },
    { hour: "3pm", percent: 0.7, songCount: 7, minsStreamed: 70, idx: 3 },
    { hour: "4pm", percent: 0.8, songCount: 8, minsStreamed: 80, idx: 4 },
    { hour: "5pm", percent: 0.9, songCount: 9, minsStreamed: 90, idx: 5 },
    { hour: "6pm", percent: 0.1, songCount: 1, minsStreamed: 10, idx: 6 },
    { hour: "7pm", percent: 0.2, songCount: 2, minsStreamed: 20, idx: 7 },
    { hour: "8pm", percent: 0.3, songCount: 3, minsStreamed: 70, idx: 8 },
    { hour: "9pm", percent: 0.4, songCount: 4, minsStreamed: 40, idx: 9 },
    { hour: "10pm", percent: 0.5, songCount: 5, minsStreamed: 50, idx: 10 },
    { hour: "11pm", percent: 0.6, songCount: 6, minsStreamed: 60, idx: 11 },
  ];

  const data: Data = {
    heatmapData,
    topArtistsData,
    hourlyData,
    weekdayData,
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
