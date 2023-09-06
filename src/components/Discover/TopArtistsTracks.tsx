import React from "react";
import "../../styles/discover/top-artists-tracks.css";
import { Card, Data } from "../../utils/globals";

type Props = {
  userData: Data;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  recommendationSeeds: Record<string, string>[];
  setRecommendationSeeds: React.Dispatch<
    React.SetStateAction<Record<string, string>[]>
  >;
};

const TopArtistsTracks = ({
  userData,
  cards,
  setCards,
  recommendationSeeds,
  setRecommendationSeeds,
}: Props) => {
  const handleCardClick = (selectedCard: Card) => {
    // if card is already selected, deselect and remove from seeds
    if (cards.find((card) => card.id === selectedCard.id)!.selected) {
      // deselect card
      const newCards = cards.map((card) => {
        if (card.id === selectedCard.id) card.selected = false;
        return card;
      });
      setCards([...newCards]);

      // remove from seeds
      const newSeeds = recommendationSeeds.filter((seed) => {
        return (
          seed.track !== selectedCard.id && seed.artist !== selectedCard.id
        );
      });
      setRecommendationSeeds([...newSeeds]);
      return;
    }

    // if card is not selected, select and add to seeds
    let removedSeed;
    if (recommendationSeeds.length >= 5) {
      removedSeed = recommendationSeeds.shift();
    }
    recommendationSeeds.push({ [selectedCard.type]: selectedCard.id });
    setRecommendationSeeds([...recommendationSeeds]);

    //update cards to selected
    const newCards = cards.map((card) => {
      if (card.id === selectedCard.id) card.selected = true;
      return card;
    });
    if (removedSeed) {
      const removedID = removedSeed.track || removedSeed.artist;
      newCards.find((card) => card.id === removedID)!.selected = false;
    }

    setCards([...newCards]);
  };

  return (
    <div className="top-artists-tracks column">
      <div className="center top-header">
        <h3>Top Tracks & Artists</h3>
      </div>
      <div className="artists-row">
        {cards.map((item, i) => (
          <div
            key={`item.id-${i}`}
            className={`${
              item.type === "track"
                ? "center column track-card-wrapper"
                : "artist-card-wrapper center column"
            } ${item.selected ? "selected-card" : ""}`}
            onClick={() => handleCardClick(item)}
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
