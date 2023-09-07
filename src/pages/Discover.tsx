import React, { useState, useEffect } from "react";
import "../styles/discover/discover.css";
import NowPlaying from "../components/Discover/NowPlaying";
import Playlist from "../components/Discover/Playlist";
import TopArtists from "../components/Discover/TopArtistsTracks";
import { Card, Data, Track } from "../utils/globals";
import { formCards, saveData } from "../utils/utils";
import { requestRecommendations } from "../utils/RESTCalls";
import { MediaControls } from "../utils/MediaControls";

type Props = {
  userData: Data;
  cards: Card[];
  mediaControls: MediaControls | null;
  setMediaControls: React.Dispatch<React.SetStateAction<MediaControls | null>>;
};

const Discover = ({
  userData,
  cards,
  mediaControls,
  setMediaControls,
}: Props) => {
  //? states
  const [recommendationSeeds, setRecommendationSeeds] = useState<
    Record<string, string>[]
  >(userData.recommendationSeeds);
  const [cardsState, setCardsState] = useState(cards);
  const [savedTracks, setSavedTracks] = useState<Track[]>(userData.savedTracks);
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

  const handleLike = (trackIdx: number) => {
    if (userData.recommendations.length === 0) return;

    const updatedUserData = { ...userData };
    updatedUserData.recommendations = [...userData.recommendations];
    updatedUserData.savedTracks = savedTracks;

    // set liked tag to opposite
    updatedUserData.recommendations[trackIdx].isLiked =
      !updatedUserData.recommendations[trackIdx].isLiked;

    // add to saved tracks if liked
    if (updatedUserData.recommendations[trackIdx].isLiked) {
      updatedUserData.savedTracks.push(
        updatedUserData.recommendations[trackIdx]
      );
    } else { // remove track from list
      const idx = updatedUserData.savedTracks.findIndex(
        (track) => track.id === updatedUserData.recommendations[trackIdx].id
      );
      updatedUserData.savedTracks.splice(idx, 1);
    }
    saveData(updatedUserData);
    setSavedTracks(updatedUserData.savedTracks);
    setCardsState(formCards(updatedUserData));
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
          likeCallback={handleLike}
          mediaControls={mediaControls}
          isRefreshing={isRefreshing}
        />
        <Playlist
          mediaControls={mediaControls}
          savedTracks={savedTracks}
          setSavedTracks={setSavedTracks}
        />
      </div>
    </div>
  );
};

export default Discover;
