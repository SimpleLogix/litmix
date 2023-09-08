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
};

const Discover = ({ userData, cards, mediaControls }: Props) => {
  //? states
  // A lot of these are shared states between playlist & now playing components
  const [recommendationSeeds, setRecommendationSeeds] = useState<
    Record<string, string>[]
  >(userData.recommendationSeeds);
  const [cardsState, setCardsState] = useState(cards);
  const [savedTracks, setSavedTracks] = useState<Track[]>(userData.savedTracks);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState<number>(0);
  const [playingIdx, setPlayingIdx] = useState<number>(-1); // playlist Idx
  const [currentTrack, setCurrentTrack] = useState<number>(0); // now playing Idx

  // set selected cards to true
  for (const seed of recommendationSeeds) {
    const id = seed.track || seed.artist;
    cardsState.find((card) => card.id === id)!.selected = true;
  }

  //? Event listeners
  useEffect(() => {
    const handleSongEnd = () => {
      // Only run if user is listening in "playing now"
      if (isPlaying) {
        handleNext();
        setCurrentTrack((prev) => prev + 1);
      }
      setPlayingIdx(-1);
    };

    mediaControls?.on("ended", handleSongEnd);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      mediaControls?.element.removeEventListener("ended", handleSongEnd);
    };
  }, [mediaControls]);

  useEffect(() => {
    const handleSpaceBar = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isPlaying) {
          mediaControls?.pause();
          setIsPlaying(false);
        } else {
          if (playingIdx !== -1) {
            mediaControls?.pause();
            setPlayingIdx(-1);
            setIsPlaying(false);
          } else {
            mediaControls?.play();
            setIsPlaying(true);
          }
        }
      }
    };

    // Add the event listener for the spacebar
    window.addEventListener("keydown", handleSpaceBar);

    return () => {
      //clean up
      window.removeEventListener("keydown", handleSpaceBar);
    };
  }, [isPlaying, playingIdx, mediaControls]);

  //? handlers
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
    } else {
      // remove track from list
      const idx = updatedUserData.savedTracks.findIndex(
        (track) => track.id === updatedUserData.recommendations[trackIdx].id
      );
      updatedUserData.savedTracks.splice(idx, 1);
    }
    saveData(updatedUserData);
    setSavedTracks(updatedUserData.savedTracks);
    setCardsState(formCards(updatedUserData));
  };

  const clearTracksCallback = () => {
    const updatedUserData = { ...userData };
    updatedUserData.savedTracks = [];
    updatedUserData.recommendations.forEach((track) => (track.isLiked = false));
    saveData(updatedUserData);
    setSavedTracks([]);
    setCardsState(formCards(updatedUserData));
  };

  // playlist handlers
  const handlePlaylistPlay = (idx: number) => {
    mediaControls?.setSource(savedTracks[idx].previewUrl!);
    mediaControls?.play();
    setIsPlaying(false);
    setTrackTime(0);
  };
  const handlePlaylistPause = () => {
    mediaControls?.pause();
    setIsPlaying(false);
    setTrackTime(0);
  };

  const resetPlayingIdx = () => {
    setPlayingIdx(-1);
  };

  const handleNext = () => {
    if (userData.recommendations.length === 0) return;
    const nextIdx =
      currentTrack === userData.recommendations.length - 1
        ? 0
        : currentTrack + 1;
    mediaControls?.setSource(userData.recommendations[nextIdx].previewUrl!);
    mediaControls?.play();
    setIsPlaying(true);
    setTrackTime(0);
    resetPlayingIdx();
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
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          trackTime={trackTime}
          setTrackTime={setTrackTime}
          resetPlayingIdx={resetPlayingIdx}
          handleNext={handleNext}
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
        />
        <Playlist
          mediaControls={mediaControls}
          savedTracks={savedTracks}
          setSavedTracks={setSavedTracks}
          clearTracksCallback={clearTracksCallback}
          playlistPlayCallback={handlePlaylistPlay}
          playlistPauseCallback={handlePlaylistPause}
          playingIdx={playingIdx}
          setPlayingIdx={setPlayingIdx}
        />
      </div>
    </div>
  );
};

export default Discover;
