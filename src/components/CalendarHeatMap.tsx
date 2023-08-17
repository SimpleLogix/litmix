import React from "react";
import { getColor, getMonths, padMonthData } from "../utils/utils";
import { HeatmapData } from "../utils/globals";

// data for the selected day in the selected year
type Props = {
  startDate: Date;
  values: HeatmapData[];
  cellClickCallback: (
    date: string,
    colorValue: number,
    msStreamed: number,
    songCount: number
  ) => void;
  selectedDate: HeatmapData;
};

const CalendarHeatMap = ({
  startDate,
  values,
  cellClickCallback,
  selectedDate,
}: Props) => {
  const months = getMonths(startDate);
  const paddedValues = padMonthData(values, startDate);

  // builds a row of 3 months based on the given monthValues
  const MonthHeatMap = ({ monthValues }: { monthValues: HeatmapData[] }) => (
    <div className="heatmap">
      {monthValues.map((data, i) => (
        <div
          className={`heatmap-day ${
            selectedDate.date === data.date && data.colorValue !== 404
              ? "selected-day"
              : ""
          }`}
          style={{ backgroundColor: getColor(data.colorValue) }}
          key={`${months[0]}-${i}`}
          onClick={() =>
            cellClickCallback(
              data.date,
              data.colorValue,
              data.minsStreamed,
              data.songCount
            )
          }
        ></div>
      ))}
    </div>
  );

  return (
    <div className="heatmap-row-wrapper">
      <div className="heatmap-row-header">
        <span>{months[0]}</span>
        <span>{months[1]}</span>
        <span>{months[2]}</span>
      </div>
      <div className="heatmap-row">
        <MonthHeatMap monthValues={paddedValues.slice(0, 35)} />
        <MonthHeatMap monthValues={paddedValues.slice(35, 70)} />
        <MonthHeatMap monthValues={paddedValues.slice(70, 105)} />
      </div>
    </div>
  );
};

export default CalendarHeatMap;
