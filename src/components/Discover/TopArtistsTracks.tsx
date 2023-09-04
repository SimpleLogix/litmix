import React from "react";
import "../../styles/discover/top-artists-tracks.css";
import { Data } from "../../utils/globals";

type Props = {
  userData: Data;
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
  seedsOrder: string[];
  selectedCards: Record<string, boolean>;
  setSelectedCards: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

const TopArtistsTracks = ({
  userData,
  cards,
  selectedCards,
  seedsOrder,
  setSelectedCards,
}: Props) => {
  const [selectedOrder, setSelectedOrder] = React.useState<string[]>(
    userData.seedsOrder
  );

  const handleCardClick = (id: string) => {
    setSelectedCards((prevSelected) => {
      const newSelected = { ...prevSelected };
      let newOrder = [...selectedOrder];

      if (newSelected[id]) {
        // Deselect
        newSelected[id] = false;
        newOrder = newOrder.filter((itemId) => itemId !== id);
      } else {
        // Select
        newSelected[id] = true;
        newOrder.push(id);

        if (newOrder.length > 5) {
          // Deselect the first selected item
          const firstSelected = newOrder[0];
          newSelected[firstSelected] = false;
          newOrder = newOrder.slice(1);
        }
      }

      setSelectedOrder(newOrder);
      return newSelected;
    });
  };

  return (
    <div className="top-artists-tracks column">
      <div className="center top-header">
        <h3>Top Tracks & Artists</h3>
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

            <p className="top-item-name">{item.name}</p>
            {item.type === "track" && (
              <p className="top-item-artist">{item.artistName}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtistsTracks;
