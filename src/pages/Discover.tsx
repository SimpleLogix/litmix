import React, { useState } from "react";
import "../styles/discover/discover.css";
import NowPlaying from "../components/Discover/NowPlaying";
import Playlist from "../components/Discover/Playlist";
import TopArtists from "../components/Discover/TopArtistsTracks";
import { Card, Data } from "../utils/globals";
import { saveData } from "../utils/utils";
import { requestRecommendations } from "../utils/RESTCalls";
import { MediaControls } from "../utils/MediaControls";

type Props = {
  userData: Data;
  cards: Card[];
  mediaControls: MediaControls | null;
};

const Discover = ({ userData, cards, mediaControls }: Props) => {
  //? states
  const [recommendationSeeds, setRecommendationSeeds] = useState<
    Record<string, string>[]
  >(userData.recommendationSeeds);
  const [cardsState, setCardsState] = useState(cards);

  // set selected cards to true
  for (const seed of recommendationSeeds) {
    const id = seed.track || seed.artist;
    cardsState.find((card) => card.id === id)!.selected = true;
  }

  const handleRefresh = async () => {
    //TODO- change click input delay
    // save seeds order to local storage
    userData.recommendationSeeds = recommendationSeeds;
    userData.recommendations = await requestRecommendations(userData);
    saveData(userData);
  };

  return (
    <div className="discover-root column">
      <TopArtists
        userData={userData}
        cards={cardsState}
        setCards={setCardsState}
        recommendationSeeds={recommendationSeeds}
        setRecommendationSeeds={setRecommendationSeeds}
      />
      <div className="discover-bottom-container">
        <NowPlaying
          playlist={userData.recommendations}
          refreshCallback={handleRefresh}
          mediaControls={mediaControls}
        />
        <Playlist />
      </div>
    </div>
  );
};

export default Discover;
