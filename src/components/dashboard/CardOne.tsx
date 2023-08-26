import React, { useEffect, useState } from "react";
import "../../styles/card-one.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { msToMins, stringifyNum } from "../../utils/utils";
import { YearlyData, YearlyDataType } from "../../utils/globals";

type Props = {
  yearlyData: YearlyDataType;
};

const CardOne = ({ yearlyData }: Props) => {
  // Extract the keys and sort them (assuming they are in a format that can be sorted as strings)
  const sortedYears = Object.keys(yearlyData).sort();
  // Get the last key
  const lastYear = sortedYears[sortedYears.length - 1];
  // Get the corresponding data object
  const lastYearData = yearlyData[lastYear];
  //? states
  const [displayedData, setDisplayedData] = useState<YearlyData>(lastYearData);

  // rechartrs tooltip is not a react component,
  // so I made this janky workaround
  const CustomTooltip = ({ active, payload }: any) => {
    useEffect(() => {
      if (active && payload && payload.length) {
        const newPayload = payload[0].payload as YearlyData;
        if (newPayload.year !== displayedData.year) {
          setDisplayedData(newPayload);
        }
      } else {
        if (displayedData.year !== lastYearData.year) {
          setDisplayedData(lastYearData);
        }
      }
    }, [active, payload]);

    return null;
  };

  // Convert the record to an array for use with the LineChart
  const chartData = Object.entries(yearlyData).map(([year, data]) => ({
    year,
    streamTime: data.streamTime,
    cumSum: data.cumSum,
  }));

  return (
    <div className="card stream-time-card column">
      <h3>Total Stream Time</h3>
      <div className="card-one-displayed-data ">
        <p className="stream-cum-total">
          {stringifyNum(msToMins(displayedData.cumSum))}
          <span> mins</span>
        </p>
        <p className="stream-year-total">
          {stringifyNum(msToMins(displayedData.streamTime))}
          <span>
            {" "}
            mins <span>({displayedData.year})</span>
          </span>
        </p>
      </div>
      <div className="stream-time-line-container center">
        <ResponsiveContainer width="90%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" vertical={false} />
            <Line
              type="monotone"
              dataKey="cumSum"
              stroke="#d8f9db"
              strokeWidth={2.5}
              strokeOpacity={0.8}
              dot={{ fill: "#d8f9db", strokeWidth: 2, stroke: "#d8f9db" }}
            />
            <Line
              type="monotone"
              dataKey="streamTime"
              stroke="#3c4a3e"
              strokeWidth={2.5}
              strokeOpacity={0.8}
              dot={{ fill: "#3c4a3e", strokeWidth: 2, stroke: "#3c4a3e" }}
            />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#DCDCDD" }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CardOne;
