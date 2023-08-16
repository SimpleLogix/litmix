import React from "react";

// data for the selected day in the selected year
interface dateData {
  date: string;
  count: number;
}

type Props = {
  startDate: Date;
  endDate: Date;
  values: dateData[];
};

const CalendarHeatMap = (props: Props) => {
  return (
    <div className="heatmap-row">
      <div className="heatmap">
        {Array(35)
          .fill(0)
          .map((_, i) => (
            <div className="heatmap-day"></div>
          ))}
      </div>
      <div className="heatmap">
        {Array(35)
          .fill(0)
          .map((_, i) => (
            <div className="heatmap-day"></div>
          ))}
      </div>
      <div className="heatmap">
        {Array(35)
          .fill(0)
          .map((_, i) => (
            <div className="heatmap-day"></div>
          ))}
      </div>
    </div>
  );
};

export default CalendarHeatMap;
