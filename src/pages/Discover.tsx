import React, { useState, useEffect } from "react";
import "../styles/discover/discover.css";
import NowPlaying from "../components/Discover/NowPlaying";
import Playlist from "../components/Discover/Playlist";
import TopArtists from "../components/Discover/TopArtistsTracks";
import { Card, Data } from "../utils/globals";
import { formCards, saveData } from "../utils/utils";
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // set selected cards to true
  for (const seed of recommendationSeeds) {
    const id = seed.track || seed.artist;
    cardsState.find((card) => card.id === id)!.selected = true;
  }

  const handleRefresh = async () => {
    if (isRefreshing) return;

    // request new recommendations and save to local storage
    // save seeds order to local storage
    setIsRefreshing(true);
    // request new recs
    userData.recommendationSeeds = recommendationSeeds;
    userData.recommendations = await requestRecommendations(userData);
    setCardsState(formCards(userData));
    saveData(userData);
    mediaControls?.setSource(userData.recommendations[0].previewUrl!);
    mediaControls?.play();
    setIsRefreshing(false);
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
          isRefreshing={isRefreshing}
        />
        <Playlist />
      </div>
    </div>
  );
};

export default Discover;
