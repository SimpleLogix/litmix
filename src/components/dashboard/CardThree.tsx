import React from "react";
import "../../styles/card-three.css";
import CalendarHeatmap from "../../components/CalendarHeatMap";

type Props = {};

const ColorMap = {
  0: "#d8f9db",
  0.1: "#c5f4d1",
  0.2: "#b2efc7",
  0.3: "#9eeabc",
  0.4: "#8be5b2",
  0.5: "#78e0a8",
  0.6: "#64dba0",
  0.7: "#51d095",
  0.8: "#3ec58b",
  0.9: "#2bbf81",
  1: "#18ba77",
};

// data for the selected day in the selected year
interface dateData {
  date: string;
  count: number;
}

// data for the selected year
interface displayedData {
  year: string;
  values: dateData[];
}

// example of data for the selected year
const values: dateData[] = [
  { date: "2016-01-01", count: 120 },
  { date: "2016-01-22", count: 42 },
  { date: "2016-01-30", count: 38 },
  { date: "2016-02-01", count: 120 },
  { date: "2016-02-2", count: 42 },
];

// example of data for the selected day in the selected year
const dateData: displayedData = {
  year: "2016",
  values: values,
};

const dateRanges = [
  { start: "2016-01-01", end: "2016-03-31" },
  { start: "2016-04-01", end: "2016-06-31" },
  { start: "2016-07-01", end: "2016-9-31" },
  { start: "2016-10-01", end: "2016-12-31" },
];

// renders a Heatmap row with the given start and end dates
const renderHeatmapRow = (startDate: string, endDate: string) => (
  <div className="heatmap-row-wrapper">
    <div className="heatmap-row-header">
    <span>Jan</span>
    <span>Feb</span>
    <span>Mar</span>
    </div>
    <CalendarHeatmap
      startDate={new Date(startDate)}
      endDate={new Date(endDate)}
      values={dateData.values}
    />
  </div>
);

const CardThree = (props: Props) => {
  return (
    <div className="card center column card-three">
      <div className="card-three-header center">
        {"<"}
        <div>{dateData.year}</div>
        {">"}
      </div>
      <div className="card-three-body center">
        <div className="heatmap-grid center">
          {dateRanges.map((range) => renderHeatmapRow(range.start, range.end))}
        </div>
        <div className="heatmap-breakdown"></div>
      </div>
    </div>
  );
};

export default CardThree;
