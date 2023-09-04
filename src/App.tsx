import React, { useState } from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import { Data } from "./utils/globals";
import "./styles/animations.css";
import { checkExistingData } from "./utils/utils";

function App() {
  const [page, setPage] = useState("Discover");

  //? fetch data from storage if it exists
  // localStorage.clear()
  const data: Data = checkExistingData();

  //? convert top tracks / artists to cards to pass in Discover
  const trackCards = Object.values(data.topTracksData).map((track) => ({
    type: "track",
    ...track,
  }));
  const artistCards = Object.values(data.topArtistsData).map((artist) => ({
    type: "artist",
    ...artist,
  }));

  let cards = [];
  let trackIndex = 0;
  let artistIndex = 0;

  while (trackIndex < trackCards.length || artistIndex < artistCards.length) {
    if (trackIndex < trackCards.length) {
      cards.push(trackCards[trackIndex++]);
    }
    if (trackIndex < trackCards.length) {
      cards.push(trackCards[trackIndex++]);
    }
    if (artistIndex < artistCards.length) {
      cards.push(artistCards[artistIndex++]);
    }
  }

  console.log("first render");

  return (
    <div className="app">
      <SideFrame
        page={page}
        setPage={setPage}
        displayName={data.displayName}
        joinDate={data.joinDate}
        imgUrl={data.profileImage}
      ></SideFrame>

      <div className="border"></div>

      <div className="main-frame center">
        {page === "Dashboard" ? (
          <Dashboard data={data} />
        ) : (
          <Discover userData={data} cards={cards} />
        )}
      </div>
    </div>
  );
}

export default App;
