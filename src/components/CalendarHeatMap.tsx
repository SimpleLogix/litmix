import React from "react";
import { getColor, getMonths, padHeatmapData } from "../utils/utils";
import { HeatmapData, MONTHS, heatmapDataType } from "../utils/globals";

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
  // builds a row of 3 months based on the given monthValues
  // const MonthHeatMap = ({
  //   monthValues,
  // }: {
  //   monthValues: Record<string, Record<string, HeatmapData>>;
  // }) => (
  //   <div className="heatmap">
  //     {monthValues.map((data, i) => (
  //       <div
  //         className={`heatmap-day ${
  //           selectedDate.date === data.date && data.colorValue !== 404
  //             ? "selected-day"
  //             : ""
  //         }`}
  //         style={{ backgroundColor: getColor(data.colorValue) }}
  //         key={`${months[0]}-${i}-${data.date}`}
  //         onClick={() =>
  //           cellClickCallback(
  //             data.date,
  //             data.colorValue,
  //             data.msStreamed,
  //             data.songCount,
  //             data.topTrack,
  //             data.topTrackCount
  //           )
  //         }
  //       ></div>
  //     ))}
  //   </div>
  // );

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
