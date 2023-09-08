import React, { useEffect, useState } from "react";
import "../../styles/discover/playlist.css";
import { Track } from "../../utils/globals";
import { formatMS } from "../../utils/utils";
import { MediaControls } from "../../utils/MediaControls";

type Props = {
  savedTracks: Track[];
  setSavedTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  clearTracksCallback: () => void;
  playlistPlayCallback: (idx: number) => void;
  playlistPauseCallback: () => void;
  playingIdx: number;
  setPlayingIdx: React.Dispatch<React.SetStateAction<number>>;
  mediaControls: MediaControls | null;
};

const playImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/play-light.svg`;
const pauseImg = `${process.env.PUBLIC_URL}/assets/mediaplayer/pause-light.svg`;

const Playlist = ({
  savedTracks,
  setSavedTracks,
  clearTracksCallback,
  playlistPauseCallback,
  playlistPlayCallback,
  playingIdx,
  setPlayingIdx,
  mediaControls,
}: Props) => {
  //? states
  const [hoveringIdx, setHoveringIdx] = useState<number>(-1);
  const [fadingOutIndices, setFadingOutIndices] = useState<number[]>([]);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [trackTime, setTrackTime] = useState<number>(0); // in ms
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  //? sub component
  const CircularProgressBar = ({
    percentage,
    imgSrc,
    idx,
  }: {
    percentage: number;
    imgSrc: string;
    idx: number;
  }) => {
    const radius = 15.9;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // update the track time every second
    useEffect(() => {
      const intervalId = setInterval(() => {
        if (mediaControls) {
          setTrackTime(mediaControls.getTime());
        }
      }, 50); // Update every 1 second

      return () => clearInterval(intervalId);
    }, [mediaControls]);

    return (
      <div>
        <svg
          viewBox="0 0 36 36"
          className="circular-chart"
          onMouseDown={() => {
            if (!isPlaying && playingIdx !== idx) {
              setPlayingIdx(idx);
              setIsPlaying(true);
              playlistPlayCallback(idx);
            } else if (isPlaying && playingIdx === idx) {
              playlistPauseCallback();
              setIsPlaying(false);
            } else if (!isPlaying && playingIdx === idx) {
              playlistPlayCallback(idx);
              setIsPlaying(true);
            } else if (isPlaying && playingIdx !== idx) {
              playlistPauseCallback();
              playlistPlayCallback(idx);
              setIsPlaying(true);
              setPlayingIdx(idx);
            }
          }}
        >
          <circle className="circle-bg" cx="18" cy="18" r={radius}></circle>
          <circle
            className="circle"
            cx="18"
            cy="18"
            r={radius}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: offset.toString(),
            }}
          ></circle>
          <image
            className={playingIdx === idx && isPlaying ? "" : "playlist-play"}
            href={imgSrc}
            x={`${playingIdx === idx && isPlaying ? 8 : 9.2}`}
            y="8"
            height="20px"
            width="20px"
          />
        </svg>
      </div>
    );
  };

  //? handlers
  const handleMouseEnter = (idx: number) => {
    setHoveringIdx(idx);
  };
  const handleMouseLeave = () => {
    setHoveringIdx(-1);
  };

  const clearTracks = () => {
    setIsClearing(true);
    let tracksCopy = [...savedTracks];

    // remove the first track from the array
    const removeLastTrack = () => {
      tracksCopy.pop();
      setSavedTracks([...tracksCopy]);
    };

    for (let idx = savedTracks.length - 1; idx >= 0; idx--) {
      setTimeout(() => {
        setFadingOutIndices((prev) => [...prev, idx]);
        setTimeout(removeLastTrack, 250);
      }, (savedTracks.length - 1 - idx) * 32);
    }
    // Call the clearTracksCallback after all animations have completed
    const totalAnimationTime = savedTracks.length * 32 + 250;
    setTimeout(clearTracksCallback, totalAnimationTime);
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="playlist-root center column">
      <h3>Playlist</h3>

      <div className="playlist-container column">
        {savedTracks.map((track, idx) => (
          <div
            key={track.id}
            className={`playlist-item center ${
              fadingOutIndices.includes(idx) ? "fade-out" : ""
            }`}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={() => handleMouseLeave()}
          >
            <img className="playlist-item-image" src={track.image} alt="" />

            <div className="playlist-item-play center">
              <CircularProgressBar
                percentage={playingIdx === idx ? (trackTime / 30) * 100 : 0}
                imgSrc={playingIdx === idx && isPlaying ? pauseImg : playImg}
                idx={idx}
              />
            </div>

            <p className="playlist-item-track-name">{track.name}</p>
            <p className="playlist-item-artist-name">{track.artistName}</p>
            <p className="playlist-item-duration">
              {formatMS(track.duration!)}
            </p>

            <div className="playlist-item-export-wrapper center">
              {hoveringIdx === idx ? (
                <img
                  className="playlist-item-export"
                  src={`${process.env.PUBLIC_URL}/assets/export.svg`}
                  alt=""
                  onClick={() => openExternalLink(track.externalUrl!)}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
        <div
          className={`playlist-clear-button center ${
            savedTracks.length === 0 || isClearing ? "hidden" : ""
          }`}
          onClick={clearTracks}
        >
          Clear
        </div>
      </div>
    </div>
  );
};

export default Playlist;
