import React from "react";
import "../../styles/discover/now-playing.css";

type Props = {};

const NowPlaying = (props: Props) => {
  return <div className="now-playing center column">
    <h3>Now Playing</h3>

    <div className="media-player center column"></div>
  </div>;
};

export default NowPlaying;
