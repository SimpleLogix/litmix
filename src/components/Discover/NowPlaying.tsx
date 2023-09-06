import React, { useEffect, useState } from "react";
import "../../styles/discover/now-playing.css";
import { Track } from "../../utils/globals";
import { MediaControls } from "../../utils/MediaControls";

type Props = {
  playlist: Track[];
  refreshCallback: () => void;
  mediaControls: MediaControls | null;
};

const refreshImg = `${process.env.PUBLIC_URL}/assets/refresh.svg`;
const noAlbumImg = `${process.env.PUBLIC_URL}/assets/no-album.png`;
const playImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/play.svg`;
const pauseImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/pause.svg`;
const likeImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/like.svg`;
const likedImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/liked.svg`;

const NowPlaying = ({ playlist, refreshCallback, mediaControls }: Props) => {
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  //? change source when current track changes
  //? can set next/prev indx as well and set Source when clicked
  // useEffect(() => {
  //   if (mediaControls) {
  //     mediaControls.setSource(playlist[currentTrack].previewUrl!);
  //   }
  // }, [currentTrack]);

  //? handlers
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) mediaControls?.pause();
    else mediaControls?.play();
  };
  const handleNext = () => {
    if (currentTrack === playlist.length - 1) setCurrentTrack(0);
    else setCurrentTrack(currentTrack + 1);
  };
  const handlePrev = () => {
    if (currentTrack === 0) setCurrentTrack(playlist.length - 1);
    else setCurrentTrack(currentTrack - 1);
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
          onClick={refreshCallback}
        />

        <img
          className="mp-icon"
          src={
            playlist[currentTrack].image
              ? playlist[currentTrack].image
              : noAlbumImg
          }
          alt=""
        />
        <div className="mp-track-name">{playlist[currentTrack].name}</div>
        <div className="mp-artist-name">
          {playlist[currentTrack].artistName}
        </div>

        <div className="scrub-bar">
          <div className="scrub-bar-played"></div>
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
