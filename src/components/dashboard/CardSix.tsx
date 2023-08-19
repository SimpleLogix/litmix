import React, { useState } from "react";
import "../../styles/card-six.css";

type Props = {};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DayOfWeek = ({
  day,
  isActive,
  handleDayClick,
}: {
  day: weekdayData;
  isActive: boolean;
  handleDayClick: (day: weekdayData) => void;
}) => (
  <div
    className={`center weekday-box ${isActive ? "active-weekday" : ""}`}
    onClick={() => handleDayClick(day)}
  >
    {day.day}
  </div>
);

interface weekdayData {
  day: string;
  percent: number;
  mostActive: string;
}

const generateWeekdayData = (): weekdayData[] => {
  const data: weekdayData[] = [];
  for (let i = 0; i < 7; i++) {
    data.push({
      day: weekdays[i],
      percent: Math.floor(Math.random() * 100),
      mostActive: `${Math.floor(Math.random() * 12)}pm`,
    });
  }
  return data;
};

const weekdayData = generateWeekdayData();

const CardSix = (props: Props) => {
  const [selectedDay, setSelectedDay] = useState<weekdayData>(weekdayData[3]);

  const handleDayClick = (day: weekdayData) => {
    setSelectedDay(day);
  };

  return (
    <div className="card center column card-six">
      <div className="weekdays-row center">
        {weekdayData.map((day) => (
          <DayOfWeek
            day={day}
            isActive={day === selectedDay}
            handleDayClick={handleDayClick}
          />
        ))}
      </div>
      <div className="weekdays-data-wrapper center">
        <div className="weekdays-percent bold-text">{selectedDay.percent}%</div>
        <div className="weekdays-data-border"></div>
        <div className="weekdays-data center column">
          <div className="thin-text weekdays-data-time">
            {selectedDay.mostActive}
          </div>
          <div>Most Active</div>
        </div>
      </div>
    </div>
  );
};

export default CardSix;
