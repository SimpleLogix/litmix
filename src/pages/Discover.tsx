import React from "react";
import "../styles/discover.css";
import NowPlaying from "../components/Discover/NowPlaying";
import Playlist from "../components/Discover/Playlist";
import TopArtists from "../components/Discover/TopArtistsTracks";

type Props = {};

const Discover = (props: Props) => {
  return (
    <div className="discover-root column">
      <div className="discover-top-border"></div>
      <TopArtists />
      <div className="discover-bottom-container">
        <NowPlaying />
        <Playlist />
      </div>
    </div>
  );
};

export default Discover;
