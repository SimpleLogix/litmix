import React from "react";
import "../styles/home.css";

type Props = {};

const Home = (props: Props) => {
  return (
    <div>
      <div className="center header">
        <div className="logo">Litmix</div>
        <div className="profile-container">
          <div className="profile-info">
            <div className="profile-username">SimpleLogix</div>
            <div className="profile-join-date">June 12, 2015</div>
          </div>
          <div className="profile-icon"></div>
        </div>
      </div>
      <div className="home-main-container center column">
        <p>You've Listened to</p>
        <div className="home-mins-listened">1,920,000</div>
        <p>Minutes of music</p>

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
    </div>
  );
};

export default Home;
