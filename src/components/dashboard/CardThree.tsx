import React, { useState } from "react";
import "../../styles/card-three.css";
import CalendarHeatMap from "../../components/CalendarHeatMap";
import { createDateValues, filterHeatmapData } from "../../utils/utils";

type Props = {};

const values = createDateValues();

const YEAR = "2016";

interface selectedData {
  date: string;
  count: number;
}

const CardThree = (props: Props) => {
  const dateRanges = [
    { start: `${YEAR}-01-02`, end: `${YEAR}-04-01` },
    { start: `${YEAR}-04-02`, end: `${YEAR}-07-01` },
    { start: `${YEAR}-08-02`, end: `${YEAR}-10-01` },
    { start: `${YEAR}-10-02`, end: `${YEAR + 1}-01-01` },
  ];
  const [year, setYear] = useState<string>(YEAR);
  const [selectedDate, setSelectedDate] = useState<selectedData>({
    date: "2016-01-02",
    count: Math.floor(values.get("2016")!.get("01")!.get("02")! * 10),
  });

  const cellClickCallback = (date: string, count: number) => {
    count = Math.floor(count * 100);
    setSelectedDate({ date, count });
  };

  return (
    <div className="card center column card-three">
      <div className="card-three-header">
        {"<"}
        <div>{year}</div>
        {">"}
      </div>
      <div className="card-three-body center">
        <div className="heatmap-grid center">
          {dateRanges.map((range) => {
            const filteredValues = filterHeatmapData(
              values,
              new Date(range.start)
            );
            return (
              <CalendarHeatMap
                key={"heatmap-" + range.start}
                startDate={new Date(range.start)}
                values={filteredValues}
                cellClickCallback={cellClickCallback}
              />
            );
          })}
        </div>
        <div className="heatmap-breakdown center column">
          <p>{selectedDate?.date}</p>
          <p>{selectedDate?.count}</p>
        </div>
      </div>
    </div>
  );
};

export default CardThree;
