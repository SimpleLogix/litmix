import React from "react";
import { dateData, getColor, getMonths, padMonthData } from "../utils/utils";

// data for the selected day in the selected year

type Props = {
  startDate: Date;
  values: dateData[];
  cellClickCallback: (date: string, count: number) => void;
};

const CalendarHeatMap = ({ startDate, values, cellClickCallback }: Props) => {
  const months = getMonths(startDate);
  const paddedValues = padMonthData(values, startDate);
  const month1Values = paddedValues.slice(0, 35);
  const month2Values = paddedValues.slice(35, 70);
  const month3Values = paddedValues.slice(70, 105);
  return (
    <div className="heatmap-row-wrapper">
      <div className="heatmap-row-header">
        <span>{months[0]}</span>
        <span>{months[1]}</span>
        <span>{months[2]}</span>
      </div>
      <div className="heatmap-row">
        <div className="heatmap">
          {month1Values.map((data, i) => (
            <div
              className="heatmap-day"
              style={{ backgroundColor: getColor(data.count) }}
              key={`${months[0]}-${i}`}
              onClick={() => cellClickCallback(data.date, data.count)}
            ></div>
          ))}
        </div>
        <div className="heatmap">
          {month2Values.map((data, i) => (
            <div
              className="heatmap-day"
              style={{ backgroundColor: getColor(data.count) }}
              key={`${months[1]}-${i}`}
              onClick={() => cellClickCallback(data.date, data.count)}
            ></div>
          ))}
        </div>
        <div className="heatmap">
          {month3Values.map((data, i) => (
            <div
              className="heatmap-day"
              style={{ backgroundColor: getColor(data.count) }}
              key={`${months[2]}-${i}`}
              onClick={() => cellClickCallback(data.date, data.count)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatMap;
