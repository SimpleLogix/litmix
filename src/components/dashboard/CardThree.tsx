import React, { useState } from "react";
import "../../styles/cards/card-three.css";
import CalendarHeatMap from "../../components/CalendarHeatMap";
import { HeatmapData, MONTHS, heatmapDataType } from "../../utils/globals";

type Props = {
  heatmapData: heatmapDataType;
  years: string[];
};

const CardThree = ({ heatmapData, years }: Props) => {
  //? States
  const [yearIndex, setYearIndex] = useState<number>(years.length - 1); //last
  const lastYearData = heatmapData[years[yearIndex]];
  const sortedMonths = Object.keys(lastYearData).sort(
    (a, b) => Number(a) - Number(b)
  );
  const lastMonth = sortedMonths[sortedMonths.length - 1];

  const sortedDays = Object.keys(lastYearData[lastMonth]).sort(
    (a, b) => Number(a) - Number(b)
  );
  const lastDay = sortedDays[sortedDays.length - 1];

  const [selectedDate, setSelectedDate] = useState<HeatmapData>(
    lastYearData[lastMonth][lastDay]
  );

  //? Handlers
  const cellClickCallback = (
    date: string,
    colorValue: number,
    msStreamed: number,
    songCount: number,
    topTrack: string,
    topTrackCount: number
  ) => {
    if (colorValue === 404) return;
    setSelectedDate({
      date,
      colorValue,
      msStreamed,
      songCount,
      topTrack,
      topTrackCount,
    });
  };

  const handleBackClick = () => {
    const prevIndex = yearIndex - 1 < 0 ? years.length - 1 : yearIndex - 1;
    setYearIndex(prevIndex);
  };

  const handleForwardClick = () => {
    const nextIndex = yearIndex + 1 === years.length ? 0 : yearIndex + 1;
    setYearIndex(nextIndex);
  };

  const HeatDiff = () => (
    <div className="center mins-super">
      {selectedDate?.colorValue === 404 ? null : selectedDate?.colorValue >=
        0.5 ? (
        <img
          className="heatmap-diff-img"
          src={`${process.env.PUBLIC_URL}/assets/up.svg`}
          alt=""
        />
      ) : (
        <img
          className="heatmap-diff-img"
          src={`${process.env.PUBLIC_URL}/assets/down.svg`}
          alt=""
        />
      )}
      <p
        className="heatmap-data-color"
        style={{
          color: `${
            selectedDate?.colorValue === 404
              ? "transparent"
              : selectedDate?.colorValue >= 0.5
              ? "#27ae60"
              : "#c0392b"
          }`,
        }}
      >
        {calculateHeatDifference(selectedDate?.colorValue)}
      </p>
    </div>
  );

  return (
    <div className="card center card-three">
      <div className="heatmap-wrapper center">
        <div className="card-three-header center">
          <img
            src={`${process.env.PUBLIC_URL}/assets/left.png`}
            alt="<"
            onClick={handleBackClick}
          />
          <div>{years[yearIndex]}</div>
          <img
            src={`${process.env.PUBLIC_URL}/assets/right.png`}
            alt=">"
            onClick={handleForwardClick}
          />
        </div>
        <div className="heatmap-wrapper center">
          <CalendarHeatMap
            cellClickCallback={cellClickCallback}
            selectedDate={selectedDate}
            heatmap={heatmapData[years[yearIndex]]}
            year={years[yearIndex]}
          />
        </div>
      </div>

      <div className="heatmap-breakdown center column">
        <p className="heatmap-data-date"> {formatDate(selectedDate?.date)}</p>

        <div className="heatmap-data-wrapper center column">
          <div className="mins-super-wrapper">
            <p className="bold-text">{msToHours(selectedDate?.msStreamed)}</p>
            <p className="thin-text">mins</p>
            {/* <HeatDiff /> */}
          </div>

          <div className="center column">
            <p className="bold-text">{selectedDate?.songCount}</p>
            <p className="thin-text">plays</p>
          </div>

          <div className="center column">
            <p className="bold-text">{selectedDate?.songCount / 2}</p>
            {/* //TODO-  */}
            <p className="thin-text">unique</p>
          </div>

          <div className="heatmap-divider"></div>

          <p className="heatmap-data-top-song thin-text">
            {selectedDate.topTrack}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardThree;

const formatDate = (date: string): string => {
  const [, month, day] = date.split("-");
  return `${MONTHS[parseInt(month) - 1]}. ${parseInt(day)}`;
};

const calculateHeatDifference = (colorValue: number): string => {
  if (colorValue === 404) return "404";
  const diff = Math.abs(colorValue * 100 - 50).toFixed(1);
  return parseFloat(diff) >= 0 ? `${diff}%` : `${diff}%`;
};

const msToHours = (ms: number): number => Math.floor(ms / 60000);
