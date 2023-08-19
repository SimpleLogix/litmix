import React, { useState } from "react";
import "../../styles/card-five.css";

type Props = {};

interface displayedData {
  artistImg: string;
  name: string;
  minsStreamed: number;
  playCount: number;
  topTrack: string;
  discovered: string;
}

const data: displayedData[] = [
  {
    artistImg: "dae.jpg",
    name: "Dae Zhen",
    minsStreamed: 1337,
    playCount: 420,
    topTrack: "Lately (Drugs)",
    discovered: "Aug 19, 2023",
  },
  {
    artistImg: "zervas.jpg",
    name: "Arizona Zervas",
    minsStreamed: 2005,
    playCount: 999,
    topTrack: "Roxanne",
    discovered: "Aug 19, 2023",
  },
];

const CardFive = (props: Props) => {
  const [artistIdx, setArtistIdx] = useState<number>(0);
  const [selectedArtist, setSelectedArtist] = useState<displayedData>(
    data[artistIdx]
  );

  const handleBackClick = () => {
    const newIdx = artistIdx === 0 ? data.length - 1 : artistIdx - 1;
    setSelectedArtist(data[newIdx]);
    setArtistIdx(newIdx);
  };

  const handleForwardClick = () => {
    const newIdx = artistIdx === data.length - 1 ? 0 : artistIdx + 1;
    setSelectedArtist(data[newIdx]);
    setArtistIdx(newIdx);
  };

  return (
    <div className="card center card-five">
      <div
        className="card-background"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${selectedArtist.artistImg})`,
        }}
      ></div>

      <div className="content center">
        <div
          className="arrow-button-container center"
          onClick={handleBackClick}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/back.svg`} alt="" />
        </div>

        <div className="artist-data center column">
          <p className="bold-text outlined-text artist-name">
            {selectedArtist.name}
          </p>

          <p className="artist-mins-streamed">
            {selectedArtist.minsStreamed} <span>mins</span>
          </p>
          <p className="artist-play-count">
            {selectedArtist.playCount} <span>plays</span>
          </p>

          <div className="center">
            <p className="top-artist-track">{selectedArtist.topTrack}</p>
            <img
              className="star"
              src={`${process.env.PUBLIC_URL}/assets/star.svg`}
              alt=""
            />
          </div>

          <p className="artist-discovered">
            <span className="">Discovered</span> {selectedArtist.discovered}
          </p>
        </div>

        <div
          className="arrow-button-container-right center"
          onClick={handleForwardClick}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/forward.svg`} alt="" />
        </div>
      </div>
    </div>
  );
};

export default CardFive;
