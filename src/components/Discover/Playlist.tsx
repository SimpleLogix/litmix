import React from "react";
import "../../styles/discover/playlist.css";
import { Track } from "../../utils/globals";
import { MediaControls } from "../../utils/MediaControls";

type Props = {
  savedTracks: Track[];
  setSavedTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  mediaControls: MediaControls | null;
};

const playImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/play-light.svg`;
const pauseImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/pause.svg`;

const Playlist = ({ savedTracks, setSavedTracks, mediaControls }: Props) => {
  return (
    <div className="playlist-root center column">
      <h3>Playlist</h3>

      <div className="playlist-container column">
        {savedTracks.map((track, idx) => (
          <div key={track.id} className="playlist-item center">
            <img className="playlist-item-image" src={track.image} alt="" />
            <div className="playlist-item-play center">
              <img src={playImg} alt="" />
            </div>
            <p className="playlist-item-track-name">{track.name}</p>
            <p className="playlist-item-artist-name">{track.artistName}</p>
            <p className="playlist-item-duration">1:00</p>
          </div>
        ))}
        <div
          className={`playlist-clear-button center ${
            savedTracks.length === 0 ? "hidden" : ""
          }`}
        >
          Clear
        </div>
      </div>
    </div>
  );
};

export default Playlist;
