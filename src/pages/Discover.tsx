import React from "react";
import "../styles/discover.css";
import NowPlaying from "../components/Discover/NowPlaying";
import Playlist from "../components/Discover/Playlist";
import TopArtists from "../components/Discover/TopArtistsTracks";
import { Data } from "../utils/globals";

type Props = {
  userData: Data;
};

const Discover = ({ userData }: Props) => {
  // TODO- change to track track arist pattern
  const cards = [
    ...Object.values(userData.topTracksData).map((track) => ({
      ...track,
      type: "track",
    })),
    ...Object.values(userData.topArtistsData).map((artist) => ({
      ...artist,
      type: "artist",
    })),
  ];
  cards.sort(() => Math.random() - 0.5);



  return (
    <div className="discover-root column">
      <TopArtists
        cards={cards}
      />
      <div className="discover-bottom-container">
        <Playlist />
        <NowPlaying />
      </div>
    </div>
  );
};

export default Discover;
