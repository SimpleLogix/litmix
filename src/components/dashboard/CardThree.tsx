import React, { useState } from "react";
import "../../styles/card-three.css";
import CalendarHeatMap from "../../components/CalendarHeatMap";
import { filterHeatmapData } from "../../utils/utils";
import { HeatmapData, MONTHS, heatmapDataType } from "../../utils/globals";

type Props = {
  heatmapData: heatmapDataType;
};

const rangeMin = 2006;
const rangeMax = new Date().getFullYear();

const CardThree = ({ heatmapData }: Props) => {
  const [year, setYear] = useState<number>(2016);
  const [selectedDate, setSelectedDate] = useState<HeatmapData>(
    heatmapData.get("2016")?.get("01")?.get("01")!
  );

  //? Heatmap is just a sigle row of 3 months
  //? so we need to build 4 rows of 3 months each
  const dateRanges = [
    { start: `${year}-01-02`, end: `${year}-04-01` },
    { start: `${year}-04-02`, end: `${year}-07-01` },
    { start: `${year}-08-02`, end: `${year}-10-01` },
    { start: `${year}-10-02`, end: `${year + 1}-01-01` },
  ];

  //? Handlers
  const cellClickCallback = (
    date: string,
    colorValue: number,
    minsStreamed: number,
    songCount: number
  ) => {
    if (colorValue === 404) return;
    setSelectedDate({ date, colorValue, minsStreamed, songCount });
  };

  const handleBackClick = () => {
    if (year === rangeMin) return;
    setYear(year - 1);
  };

  const handleForwardClick = () => {
    if (year === rangeMax) return;
    setYear(year + 1);
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
          <div>{year}</div>
          <img
            src={`${process.env.PUBLIC_URL}/assets/right.png`}
            alt=">"
            onClick={handleForwardClick}
          />
        </div>
        <div className="heatmap-grid center">
          {dateRanges.map((range) => {
            const filteredValues = filterHeatmapData(
              heatmapData,
              new Date(range.start)
            );
            return (
              <CalendarHeatMap
                key={"heatmap-" + range.start}
                startDate={new Date(range.start)}
                values={filteredValues}
                cellClickCallback={cellClickCallback}
                selectedDate={selectedDate}
              />
            );
          })}
        </div>
      </div>

      <div className="heatmap-breakdown center column">
        <p className="heatmap-data-date">{formatDate(selectedDate?.date)}</p>

        <div className="heatmap-data-wrapper center column">
          <div className="mins-super-wrapper">
            <p className="bold-text">
              {selectedDate?.minsStreamed.toLocaleString()}
            </p>
            <p className="thin-text">mins</p>
            <HeatDiff />
          </div>

          <div className="center column">
            <p className="bold-text">{selectedDate?.songCount}</p>
            <p className="thin-text">plays</p>
          </div>

          <div className="center column">
            <p className="bold-text">{selectedDate?.songCount / 2}</p>
            <p className="thin-text">unique</p>
          </div>

          <div className="heatmap-divider"></div>

          <p className="heatmap-data-top-song thin-text">Shut up my mom's calling</p>
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
