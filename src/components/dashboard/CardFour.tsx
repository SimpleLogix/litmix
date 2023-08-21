import React, { useState } from "react";
import "../../styles/card-four.css";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type Props = {};

interface displayedData {
  genre: string;
  value: number;
}

const GENRES = [
  { genre: "Pop", value: 20 },
  { genre: "Hip Hop", value: 15 },
  { genre: "Rock", value: 10 },
  { genre: "Jazz", value: 5 },
  { genre: "Classical", value: 5 },
  { genre: "Electronic", value: 5 },
];

const COLORS = [
  "#007D2A",
  "#039F38",
  "#1db954",
  "#3DC46B",
  "#66D58C",
  "#88E6AA",
];

const CardFour = (props: Props) => {
  const [selectedGenre, setSelectedGenre] = useState<displayedData>(GENRES[0]);

  const handleMouseEnterCell = (data: any, index: number) => {
    setSelectedGenre(data);
  };

  return (
    <div className="card center card-four">
      <h3>Genres</h3>
      <div className="pie-chart">
        <div className="genre-text-value center column">
          <div>
            {selectedGenre.value}
            <span>%</span>
          </div>
          <div>{selectedGenre.genre}</div>
        </div>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={GENRES}
              innerRadius={"54%"}
              outerRadius={"72%"}
              paddingAngle={8}
              dataKey="value"
              stroke="#d8f9db"
            >
              <div className="genre-text-value">XXX</div>
              {GENRES.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  cursor={"pointer"}
                  strokeWidth={`${
                    entry.genre === selectedGenre.genre ? "0.72px" : "0.25px"
                  }`}
                  onMouseEnter={() => handleMouseEnterCell(entry, index)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="genres-container center column">
        {GENRES.map((genre, index) => (
          <div
            key={`genre-${index}`}
            className="center"
            onMouseEnter={() => handleMouseEnterCell(genre, index)}
          >
            <div
              className={`square ${
                selectedGenre.genre === genre.genre ? "selected-square" : ""
              }`}
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}
            ></div>
            <div
              className={`genre-text ${
                selectedGenre.genre === genre.genre ? "selected-genre-text" : ""
              }`}
            >
              {genre.genre}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardFour;
