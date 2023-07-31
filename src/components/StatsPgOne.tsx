import React from "react";

type Props = {};

const StatsPgOne = (props: Props) => {
  return (
    <div className="home-main-container center column">
      <p>You've been listening for</p>
      <div className="home-mins-listened">1,920,000</div>
      <p>Minutes</p>

      <div className="home-stat-1 center column">
        <p>4.8K</p>
        <p>Hours</p>
      </div>
      <div className="home-stat-2 center column">
        <p>524</p>
        <p>Days</p>
      </div>
      <div className="home-stat-3 center column">
        <p>12</p>
        <p>Months</p>
      </div>
      <div className="home-stat-4 center column">
        <p>1.2</p>
        <p>Years</p>
      </div>
    </div>
  );
};

export default StatsPgOne;
