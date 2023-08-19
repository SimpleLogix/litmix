import React, { useState } from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import { createDateValues } from "./utils/utils";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import { TopArtistsData } from "./utils/globals";

function App() {
  const [page, setPage] = useState("Dashboard");

  //? Fetch data
  const heatmapData = createDateValues();

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

  return (
    <div className="app">
      <SideFrame page={page} setPage={setPage}></SideFrame>

      <div className="border"></div>

      <div className="main-frame center">
        {page === "Dashboard" ? (
          <Dashboard
            heatmapData={heatmapData}
            topArtistsData={topArtistsData}
          />
        ) : (
          <Discover />
        )}
      </div>
    </div>
  );
}

export default App;
