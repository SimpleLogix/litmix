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
import { stringifyNum } from "../../utils/utils";

type Props = {};

interface displayedData {
  year: string;
  value: number;
  cumValue: number;
}

const SP_DATA: displayedData[] = [
  { year: "2017", value: 200, cumValue: 200 },
  { year: "2018", value: 300, cumValue: 500 },
  { year: "2019", value: 400, cumValue: 900 },
  { year: "2020", value: 550, cumValue: 1450 },
  { year: "2021", value: 700, cumValue: 2150 },
  { year: "2022", value: 1800, cumValue: 2950 },
];

const CardOne = (props: Props) => {
  const [displayedData, setDisplayedData] = useState<displayedData>(
    SP_DATA[SP_DATA.length - 1]
  );

  // rechartrs tooltip is not a react component,
  // so I made this janky workaround
  const CustomTooltip = ({ active, payload }: any) => {
    useEffect(() => {
      if (active && payload && payload.length) {
        setDisplayedData(payload[0].payload);
      } else {
        setDisplayedData(SP_DATA[SP_DATA.length - 1]);
      }
    }, [active, payload]);

    return null;
  };

  return (
    <div className="card stream-time-card column">
      <h3>Total Stream Time</h3>
      <div className="card-one-displayed-data ">
        <p className="stream-year-total">
          {stringifyNum(displayedData.value)}
          <span>
            {" "}
            mins <span>({displayedData.year})</span>
          </span>
        </p>
        <p className="stream-cum-total">
          {stringifyNum(displayedData.cumValue)}
          <span> mins</span>
        </p>
      </div>
      <div className="stream-time-line-container center">
        <ResponsiveContainer width="90%" height="100%">
          <LineChart data={SP_DATA}>
            <CartesianGrid stroke="#ccc" vertical={false} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3c4a3e"
              strokeWidth={2.5}
              strokeOpacity={0.8}
              dot={{ fill: "#3c4a3e", strokeWidth: 2, stroke: "#3c4a3e" }}
            />
            <Line
              type="monotone"
              dataKey="cumValue"
              stroke="#d8f9db"
              strokeWidth={2.5}
              strokeOpacity={0.8}
              dot={{ fill: "#d8f9db", strokeWidth: 2, stroke: "#d8f9db" }}
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
