import React, { useState } from "react";
import "../styles/discover/discover.css";
import NowPlaying from "../components/Discover/NowPlaying";
import Playlist from "../components/Discover/Playlist";
import TopArtists from "../components/Discover/TopArtistsTracks";
import { Data } from "../utils/globals";

type Props = {
  userData: Data;
  cards: {
    id: string;
    name: string;
    artistName: string;
    image: string;
    playCount: number;
    msStreamed: number;
    discovered: string;
    genres: string[];
    topTrack?: string | undefined;
    previewUrl?: string | undefined;
    type: string;
  }[];
};

const Discover = ({ userData, cards }: Props) => {
  // convert top tracks / artists to cards to pass in

  // set the selected cards for seeding
  const [selectedCards, setSelectedCards] = useState<Record<string, boolean>>(
    cards.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  for (const seed of userData.seedsOrder) {
    // console.log(seed, userData.recommendationSeeds[seed]);
    selectedCards[seed] = true;
  }

  console.log(selectedCards);

  return (
    <div className="discover-root column">
      <TopArtists
        userData={userData}
        cards={cards}
        seedsOrder={userData.seedsOrder}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
      />
      <div className="discover-bottom-container">
        <NowPlaying playlist={[]} />
        <Playlist />
      </div>
    </div>
  );
};

export default Discover;
