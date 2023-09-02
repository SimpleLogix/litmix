import React, { useState } from "react";
import "../../styles/cards/card-six.css";
import { WeekdayData, WeekdayDataType, weekdays } from "../../utils/globals";

type Props = {
  weekdayData: WeekdayDataType;
};

//* Card
const DayOfWeek = ({
  day,
  isActive,
  handleDayClick,
}: {
  day: WeekdayData;
  isActive: boolean;
  handleDayClick: (day: WeekdayData) => void;
}) => (
  <div
    className={`center weekday-box ${isActive ? "active-weekday" : ""}`}
    onClick={() => handleDayClick(day)}
  >
    {day.day}
  </div>
);

const CardSix = ({ weekdayData }: Props) => {
  const [selectedDay, setSelectedDay] = useState<WeekdayData>(
    weekdayData["Wed"]
  );

  const handleDayClick = (day: WeekdayData) => {
    setSelectedDay(day);
  };

  return (
    <div className="card center column card-six">
      <div className="weekdays-row center">
        {Object.values(weekdays).map((day) => (
          <DayOfWeek
            key={`day ${day}`}
            day={weekdayData[day]}
            isActive={day === selectedDay.day}
            handleDayClick={handleDayClick}
          />
        ))}
      </div>
      <div className="weekdays-data-wrapper center">
        <div className="weekdays-percent bold-text">
          {(selectedDay.percent * 100).toFixed(1)}%
        </div>
        <div className="weekdays-data-border"></div>
        <div className="weekdays-data center column">
          <div className="thin-text weekdays-data-time">
            {selectedDay.mostActive}
          </div>
          <div className="mint">Most Active</div>
        </div>
      </div>
    </div>
  );
};

export default CardSix;
