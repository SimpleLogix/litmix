import React, { useState } from "react";
import "../../styles/card-two.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { HourlyData } from "../../utils/globals";

type Props = {
  hourlyData: Record<string, HourlyData>;
};

const CustomBarShape = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};

const CardTwo = ({ hourlyData }: Props) => {
  const hourlyDataArray = Object.values(hourlyData);
  const dataAM = hourlyDataArray.slice(0, 12);
  const dataPM = hourlyDataArray.slice(12, 24);

  const [isPM, setIsPM] = useState<boolean>(true);
  const [tooltip, setTooltip] = useState<HourlyData>(dataPM[0]);

  const handleArrowClick = () => {
    setIsPM(!isPM);
    setTooltip(isPM ? dataAM[0] : dataPM[0]);
  };

  return (
    <div className="card center column card-two">
      <div className="card-two-footer center">
        <div
          className="arrow-button-container  center"
          onClick={handleArrowClick}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/back.svg`} alt="" />
        </div>
        <div
          className="arrow-button-container-right center"
          onClick={handleArrowClick}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/forward.svg`} alt="" />
        </div>
      </div>

      <div className="hourly-data-wrapper center">
        <div>
          {tooltip.msStreamed} <span>hrs</span>
        </div>
        <div>
          {tooltip.songCount} <span>Songs</span>
        </div>
      </div>

      <ResponsiveContainer width={"88%"} height="84%">
        <BarChart data={isPM ? dataPM : dataAM}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" />
          <Bar
            dataKey="msStreamed"
            fill="var(--empty)"
            shape={(props) => (
              <CustomBarShape
                {...props}
                fill={
                  props.hour === tooltip.hour ? "var(--green)" : "var(--empty)"
                }
              />
            )}
            onMouseEnter={(e: any) => {
              setTooltip(e);
            }}
            onMouseLeave={() => {}}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CardTwo;
