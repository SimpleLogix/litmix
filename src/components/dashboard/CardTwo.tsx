import React, { useState } from "react";
import "../../styles/cards/card-two.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { HourlyData } from "../../utils/globals";
import { msToHours } from "../../utils/utils";

type Props = {
  hourlyData: Record<string, HourlyData>;
};

const CustomBarShape = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};

const CardTwo = ({ hourlyData }: Props) => {
  const dataAM: HourlyData[] = [];
  const dataPM: HourlyData[] = [];

  // sort entries and separate into AM and PM
  Object.entries(hourlyData)
    .sort(([a], [b]) => {
      const isPMA = a.toLowerCase().endsWith("pm");
      const isPMB = b.toLowerCase().endsWith("pm");
      const hourA = parseInt(a.substring(0, a.length - 2), 10);
      const hourB = parseInt(b.substring(0, b.length - 2), 10);

      if (isPMA && hourA === 12) return -1;
      if (isPMB && hourB === 12) return 1;

      return hourA + (isPMA ? 12 : 0) - (hourB + (isPMB ? 12 : 0));
    })
    .forEach(([hour, value]) => {
      const hourlyDataEntry: HourlyData = {
        hour,
        percent: value.percent,
        songCount: value.songCount,
        msStreamed: value.msStreamed,
      };

      if (hour.toLowerCase().endsWith("am")) {
        dataAM.push(hourlyDataEntry);
      } else if (hour.toLowerCase().endsWith("pm")) {
        dataPM.push(hourlyDataEntry);
      }
    });

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
          {msToHours(tooltip.msStreamed).toFixed(1)} <span>hrs</span>
        </div>
        <div>
          {tooltip.songCount.toLocaleString()} <span>Songs</span>
        </div>
      </div>

      <ResponsiveContainer width={"88%"} height="64%">
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
