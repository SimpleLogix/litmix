import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="center header">
      <div className="header-links">
        <div className="logo">Litmix</div>
        <div className="selected-link">Home</div>
        <div>Discover</div>
      </div>
      <div className="profile-container">
        <div className="profile-info">
          <div className="profile-username">SimpleLogix</div>
          <div className="profile-join-date">June 12, 2015</div>
        </div>
        <div
          className="profile-icon"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/user.png)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Header;
