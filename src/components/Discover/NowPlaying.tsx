import React, { useEffect, useState } from "react";
import "../../styles/discover/now-playing.css";
import { Track } from "../../utils/globals";
import { MediaControls } from "../../utils/MediaControls";

type Props = {
  playlist: Track[];
  refreshCallback: () => void;
  mediaControls: MediaControls | null;
  isRefreshing: boolean;
  likeCallback: (trackIdx: number) => void;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  trackTime: number;
  setTrackTime: React.Dispatch<React.SetStateAction<number>>;
  resetPlayingIdx: () => void;
  handleNext: () => void;
  currentTrack: number;
  setCurrentTrack: React.Dispatch<React.SetStateAction<number>>;
};

const refreshImg = `${process.env.PUBLIC_URL}/assets/refresh.svg`;
const noAlbumImg = `${process.env.PUBLIC_URL}/assets/no-album.png`;
const playImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/play.svg`;
const pauseImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/pause.svg`;
const likeImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/like.svg`;
const likedImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/liked.svg`;
const loadingGif = `${process.env.PUBLIC_URL}/assets/loading.gif`;

const NowPlaying = ({
  playlist,
  refreshCallback,
  mediaControls,
  isRefreshing,
  likeCallback,
  isPlaying,
  setIsPlaying,
  trackTime,
  setTrackTime,
  resetPlayingIdx,
  handleNext,
  currentTrack,
  setCurrentTrack,
}: Props) => {
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // update the track time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (mediaControls && isPlaying && playlist.length > 0) {
        setTrackTime(mediaControls.getTime());
      }
    }, 50); // Update every 1 second

    return () => clearInterval(intervalId);
  }, [mediaControls, isPlaying, playlist]);

  //? handlers
  // now playing handlers
  const handleNowPlayingPlay = (trackIdx: number) => {
    if (playlist.length === 0) return;
    setIsPlaying(!isPlaying);
    if (mediaControls?.element.src !== playlist[trackIdx].previewUrl) {
      mediaControls?.setSource(playlist[trackIdx].previewUrl!);
    }
    if (isPlaying) mediaControls?.pause();
    else mediaControls?.play();
    resetPlayingIdx();
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const prevIdx = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIdx);
    mediaControls?.setSource(playlist[prevIdx].previewUrl!);
    mediaControls?.play();
    setIsPlaying(true);
    setTrackTime(0);
    resetPlayingIdx();
  };

  return (
    <div className="now-playing center column">
      <h3>Now Playing</h3>

      <div className="media-player center column">
        <img
          className="mp-refresh"
          src={refreshImg}
          alt=""
          onClick={() => {
            if (isRefreshing) return;
            mediaControls?.pause();
            refreshCallback();
            setIsPlaying(true);
          }}
        />

        <img
          className="mp-icon"
          src={
            playlist.length > 0 && playlist[currentTrack].image && !isRefreshing
              ? playlist[currentTrack].image
              : noAlbumImg
          }
          alt=""
        />
        <div className="mp-track-name">
          {isRefreshing || playlist.length === 0 ? (
            <img src={loadingGif} alt="" />
          ) : (
            playlist[currentTrack].name
          )}
        </div>
        <div className="mp-artist-name">
          {isRefreshing || playlist.length === 0
            ? ""
            : playlist[currentTrack].artistName}
        </div>

        <div className="scrub-bar">
          <div
            className="scrub-bar-played"
            style={{ width: `${Math.round((trackTime / 30) * 100) + 1}%` }}
          ></div>
        </div>

        <div className="mp-controls center">
          <img
            className={`mp-control add ${isShuffle ? "shuffle" : ""}`}
            src={`${process.env.PUBLIC_URL}/assets/mediaplayer/shuffle.svg`}
            alt=""
            onClick={() => setIsShuffle(!isShuffle)}
          />
          <img
            className="mp-control prev"
            src={`${process.env.PUBLIC_URL}/assets/mediaplayer/prev.svg`}
            alt=""
            onClick={handlePrev}
          />
          <img
            className={`mp-control center ${isPlaying ? "pause" : "play"}`}
            src={isPlaying ? pauseImg : playImg}
            alt=""
            onClick={() => handleNowPlayingPlay(currentTrack)}
          />
          <img
            className="mp-control next"
            src={`${process.env.PUBLIC_URL}/assets/mediaplayer/next.svg`}
            alt=""
            onClick={() => {
              const nextIdx =
                currentTrack === playlist.length - 1 ? 0 : currentTrack + 1;
              handleNext();
              setCurrentTrack(nextIdx);
            }}
          />
          <img
            className={`mp-control like ${
              playlist.length > 0 && playlist[currentTrack].isLiked
                ? "liked"
                : ""
            }`}
            src={
              playlist.length > 0 && playlist[currentTrack].isLiked
                ? likedImg
                : likeImg
            }
            alt=""
            onClick={() => likeCallback(currentTrack)}
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
