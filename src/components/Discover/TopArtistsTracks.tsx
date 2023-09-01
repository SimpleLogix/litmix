import React from "react";

type Props = {
  cards: {
    type: string;
    id: string;
    name: string;
    artistName: string;
    image: string;
    playCount: number;
    msStreamed: number;
    discovered: string;
    genres: string[];
    topTrack?: string | undefined;
  }[];
};

const TopArtistsTracks = ({ cards }: Props) => {
  const [selectedCards, setSelectedCards] = React.useState<
    Record<string, boolean>
  >(cards.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}));

  const handleCardClick = (id: string) => {
    setSelectedCards((prevSelected) => ({
      ...prevSelected,
      [id]: !prevSelected[id],
    }));
  };

  return (
    <div className="top-artists-tracks column">
      <div className="center top-header">
        <h2>Top Tracks & Artists</h2>
        {/* <span> Top 50</span>
        <img src={`${process.env.PUBLIC_URL}/assets/info.svg`} alt="" /> */}
      </div>
      <div className="artists-row">
        {cards.map((item, i) => (
          <div
            key={`item.id-${i}`}
            className={`${
              item.type === "track"
                ? "center column track-card-wrapper"
                : "artist-card-wrapper center column"
            } ${selectedCards[item.id] ? "selected-card" : ""}`}
            onClick={() => handleCardClick(item.id)}
          >
            <img
              src={
                item.image
                  ? item.image
                  : `${process.env.PUBLIC_URL}/assets/no-album.png`
              }
              alt=""
            />

            <p>{item.name}</p>
            {item.type === "track" && <p>{item.artistName}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtistsTracks;
