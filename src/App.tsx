import React, { useState, useRef, useEffect } from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import { Data } from "./utils/globals";
import "./styles/animations.css";
import { checkExistingData, formCards } from "./utils/utils";
import { MediaControls } from "./utils/MediaControls";

function App() {
  const [page, setPage] = useState("Discover");

  //? fetch data from storage if it exists
  // localStorage.clear()
  const data: Data = checkExistingData();
  const cards = formCards(data);

  //TODO - add media player functionality
  //TODO - add cached tracks functionality
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaControls, setMediaControls] = useState<MediaControls | null>(
    null
  );

  //? Last thing added... need to figure out how to connect audio html element to media controls
  useEffect(() => {
    if (audioRef.current) {
      const controls = new MediaControls(audioRef.current);
      setMediaControls(controls);
    }
  }, []);

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
          <Discover
            userData={data}
            cards={cards}
            mediaControls={mediaControls}
          />
        )}
      </div>

      <audio ref={audioRef}></audio>
    </div>
  );
}

export default App;
