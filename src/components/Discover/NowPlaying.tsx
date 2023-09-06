import React, { useEffect, useState } from "react";
import "../../styles/discover/now-playing.css";
import { Track } from "../../utils/globals";
import { MediaControls } from "../../utils/MediaControls";

type Props = {
  playlist: Track[];
  refreshCallback: () => void;
  mediaControls: MediaControls | null;
  isRefreshing: boolean;
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
}: Props) => {
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [trackTime, setTrackTime] = useState<number>(0);

  // update the track time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (mediaControls && isPlaying && playlist.length > 0) {
        setTrackTime(mediaControls.getTime());
      }
    }, 500); // Update every 1 second

    return () => clearInterval(intervalId);
  }, [mediaControls, isPlaying, playlist]);

  //? handlers
  const handlePlay = () => {
    if (playlist.length === 0) return;
    setIsPlaying(!isPlaying);
    if (isPlaying) mediaControls?.pause();
    else mediaControls?.play();
  };
  const handleNext = () => {
    if (playlist.length === 0) return;
    const nextIdx = currentTrack === playlist.length - 1 ? 0 : currentTrack + 1;
    setCurrentTrack(nextIdx);
    mediaControls?.setSource(playlist[nextIdx].previewUrl!);
    mediaControls?.play();
    setIsPlaying(true);
    setTrackTime(0);
  };
  const handlePrev = () => {
    if (playlist.length === 0) return;
    const prevIdx = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIdx);
    mediaControls?.setSource(playlist[prevIdx].previewUrl!);
    mediaControls?.play();
    setIsPlaying(true);
    setTrackTime(0);
  };
  const handleAdd = () => {};
  const handleLike = () => {
    setIsLiked(!isLiked);
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
            style={{ width: `${(trackTime / 30) * 100}%` }}
          ></div>
        </div>

        <div className="mp-controls center">
          <img
            className="mp-control add"
            src={`${process.env.PUBLIC_URL}/assets/mediaplayer/add.svg`}
            alt=""
            onClick={handleAdd}
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
            onClick={handlePlay}
          />
          <img
            className="mp-control next"
            src={`${process.env.PUBLIC_URL}/assets/mediaplayer/next.svg`}
            alt=""
            onClick={handleNext}
          />
          <img
            className={`mp-control like ${isLiked ? "liked" : ""}`}
            src={isLiked ? likedImg : likeImg}
            alt=""
            onClick={handleLike}
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
