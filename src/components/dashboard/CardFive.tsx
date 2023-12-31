import React, { useState } from "react";
import "../../styles/cards/card-five.css";
import { Artist } from "../../utils/globals";
import { convertDate, msToHours } from "../../utils/utils";

type Props = {
  topArtistsData: Artist[];
};

const CardFive = ({ topArtistsData }: Props) => {
  const [artistIdx, setArtistIdx] = useState<number>(0);
  const [selectedArtist, setSelectedArtist] = useState<Artist>(
    topArtistsData[artistIdx]
  );

  const handleBackClick = () => {
    const newIdx = artistIdx === 0 ? topArtistsData.length - 1 : artistIdx - 1;
    setSelectedArtist(topArtistsData[newIdx]);
    setArtistIdx(newIdx);
  };

  const handleForwardClick = () => {
    const newIdx = artistIdx === topArtistsData.length - 1 ? 0 : artistIdx + 1;
    setSelectedArtist(topArtistsData[newIdx]);
    setArtistIdx(newIdx);
  };

  const handleDotClick = (e: number) => {
    setSelectedArtist(topArtistsData[e]);
    setArtistIdx(e);
  };

  return (
    <div
      className={`card center card-five ${
        selectedArtist.image === "" ? "green-bg" : ""
      }`}
    >
      <div
        className={`card-background `}
        style={{
          backgroundImage: `url(${selectedArtist.image})`,
        }}
      ></div>

      <div className="content center">
        <div
          className="arrow-button-container center"
          onClick={handleBackClick}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/back.svg`} alt="" />
        </div>

        <div className="artist-data center column outlined-text">
          <p className="bold-text artist-name">
            {topArtistsData.indexOf(selectedArtist) + 1}
            {". "}
            {selectedArtist.name}
          </p>

          <p className="artist-mins-streamed">
            {msToHours(selectedArtist.msStreamed).toFixed(0)} <span>hrs</span>
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
            <span className="">Discovered</span>{" "}
            {convertDate(selectedArtist.discovered)}
          </p>
        </div>

        <div
          className="arrow-button-container-right center"
          onClick={handleForwardClick}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/forward.svg`} alt="" />
        </div>
      </div>

      <div className="page-dots center">
        {topArtistsData.map((_, i) => (
          <div
            className={`page-dot ${i === artistIdx ? "selected-dot" : ""}`}
            key={`dot ${i}`}
            onClick={() => handleDotClick(i)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CardFive;
