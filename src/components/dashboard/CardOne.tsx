import React, { useState } from "react";
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

type Props = {};

interface DisplayedData {
  year: string;
  value: string;
  cumulativeValue: number;
}

const data = [
  { name: "2017", uv: 200, cv: 200 },
  { name: "2018", uv: 300, cv: 500 },
  { name: "2019", uv: 400, cv: 900 },
  { name: "2020", uv: 550, cv: 1450 },
  { name: "2021", uv: 700, cv: 2150 },
  { name: "2022", uv: 1800, cv: 2950 },
];

const CardOne = (props: Props) => {
  const [displayedData, setDisplayedData] = useState(data[data.length - 1].cv);

  // Tooltip on Hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      setDisplayedData(payload[0].value);
      console.log(`UV Value: ${payload[0].value}`);
    }
    return null;
  };

  return (
    <div className="card stream-time-card column">
      <h3>Total Stream Time</h3>
      <p>{displayedData}</p>
      <div className="stream-time-line-container center">
        <ResponsiveContainer width="90%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="cv" stroke="#82ca9d" />
            <CartesianGrid stroke="#ccc" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CardOne;
