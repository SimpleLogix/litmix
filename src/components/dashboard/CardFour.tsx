import React, { useState } from "react";
import "../../styles/cards/card-four.css";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type Props = {
  genresData: Record<string, number>;
};

const COLORS = [
  "#007D2A",
  "#039F38",
  "#1db954",
  "#3DC46B",
  "#66D58C",
  "#88E6AA",
];

const CardFour = ({ genresData }: Props) => {
  const genres = Object.keys(genresData).slice(0, 6);
  const [selectedGenre, setSelectedGenre] = useState<string>(genres[0]);

  const handleMouseEnterCell = (data: any, index: number) => {
    setSelectedGenre(data);
  };

  return (
    <div className="card center card-four">
      <h3>Genres</h3>
      <div className="pie-chart">
        <div className="genre-text-value center column">
          <div>
            {(genresData[selectedGenre]*100).toFixed(1)}
            <span>%</span>
          </div>
          <div>{selectedGenre}</div>
        </div>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={formatGenreData(genresData).slice(0,6)}
              innerRadius={"54%"}
              outerRadius={"72%"}
              paddingAngle={4}
              dataKey="value"
              stroke="#d8f9db"
            >
              <div className="genre-text-value">XXX</div>
              {genres.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  cursor={"pointer"}
                  strokeWidth={`${
                    entry === selectedGenre ? "0.72px" : "0.25px"
                  }`}
                  onMouseEnter={() => handleMouseEnterCell(entry, index)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="genres-container center column">
        {genres.map((genre, index) => (
          <div
            key={`genre-${index}`}
            className="center"
            onMouseEnter={() => handleMouseEnterCell(genre, index)}
          >
            <div
              className={`square ${
                selectedGenre === genre ? "selected-square" : ""
              }`}
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}
            ></div>
            <div
              className={`genre-text ${
                selectedGenre === genre ? "selected-genre-text" : ""
              }`}
            >
              {genre}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardFour;

const formatGenreData = (
  genresData: Record<string, number>
): { genre: string; value: number }[] => {
  const genres = Object.keys(genresData);
  const data = genres.map((genre) => ({
    genre,
    value: genresData[genre],
  }));
  return data;
};
