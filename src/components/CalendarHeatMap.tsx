import React from "react";
import { getColor, padHeatmapData } from "../utils/utils";
import { HeatmapData, MONTHS } from "../utils/globals";

// data for the selected day in the selected year
type Props = {
  heatmap: Record<string, Record<string, HeatmapData>>;
  cellClickCallback: (
    date: string,
    colorValue: number,
    msStreamed: number,
    songCount: number,
    topTrack: string,
    topTrackCount: number
  ) => void;
  selectedDate: HeatmapData;
  year: string;
};

const CalendarHeatMap = ({
  heatmap,
  cellClickCallback,
  selectedDate,
  year,
}: Props) => {
  return (
    <div className="heatmap-row-wrapper heatmap-grid">
      {Object.entries(heatmap)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([month, monthData]) => (
          <div key={month}>
            <div className="heatmap-row-header">
              <span>{MONTHS[parseInt(month) - 1]}</span>
            </div>
            <div className="heatmap">
              {padHeatmapData(parseInt(year), parseInt(month), monthData).map(
                (dayData: HeatmapData, index: number) => (
                  <div
                    className={`heatmap-day ${
                      selectedDate.date === dayData.date &&
                      dayData.colorValue !== 404
                        ? "selected-day"
                        : ""
                    }`}
                    style={{ backgroundColor: getColor(dayData.colorValue) }}
                    key={index}
                    onClick={() =>
                      cellClickCallback(
                        dayData.date,
                        dayData.colorValue,
                        dayData.msStreamed,
                        dayData.songCount,
                        dayData.topTrack,
                        dayData.topTrackCount
                      )
                    }
                  ></div>
                )
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CalendarHeatMap;
