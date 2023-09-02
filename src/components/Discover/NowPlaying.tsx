import React, { useState } from "react";
import "../../styles/discover/now-playing.css";
import { Track } from "../../utils/globals";

type Props = {
  playlist: Track[];
};

const refreshImg = `${process.env.PUBLIC_URL}/assets/refresh.svg`;

const NowPlaying = (props: Props) => {

  // TODO - add mdedia player functionality

  //? handlers
  const handlePlay = () => {};
  const handleNext = () => {};
  const handlePrev = () => {};
  const handleAdd = () => {};
  const handleLike = () => {};

  return (
    <div className="now-playing center column">
      <h3>Now Playing</h3>

      <div className="media-player center column">
        <img className="mp-refresh" src={refreshImg} alt="" />

        <img
          className="mp-icon"
          src={`${process.env.PUBLIC_URL}/assets/no-album.png`}
          alt=""
        />
        <div className="mp-track-name">Track Name</div>
        <div className="mp-artist-name">Artist Name</div>

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
            className="mp-control play center"
            src={`${process.env.PUBLIC_URL}/assets/mediaplayer/play.svg`}
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
            className="mp-control like"
            src={`${process.env.PUBLIC_URL}/assets/mediaplayer/like.svg`}
            alt=""
            onClick={handleLike}
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
