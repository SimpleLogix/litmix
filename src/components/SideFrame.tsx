import React from "react";
import "../styles/side.css";

type Props = {
  page: string;
  setPage: (page: string) => void;
};

// Creates an icon div with the given icon name
const IconDiv = ({ iconName }: { iconName: string }) => (
  <div
    className={`menu-icon ${iconName === "user" ? "icon" : ""}`}
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${iconName}.png)`,
    }}
  />
);

const SideFrame = ({ page, setPage }: Props) => {
  // Creates a menu item with the given name
  const MenuItem = ({ name }: { name: string }) => (
    <div
      className={`menu-item-container ${
        page === name ? "menu-selected" : ""
      } center`}
      onClick={() => setPage(name)}
    >
      <IconDiv iconName={name.toLowerCase()} />
      <div>{name}</div>
    </div>
  );

  return (
    <div className="side-frame center column">
      <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="Litmix" />
      <IconDiv iconName="user" />
      <div className="username">SimpleLogic</div>
      <div className="join-date">Aug. 11, 2023</div>
      <MenuItem name="Dashboard" />
      <MenuItem name="Discover" />
      <div className="center column info">
        <div>Litmix v0.2.0</div>
        <div>
          by <span>@SimpleLogix</span>
        </div>
      </div>
    </div>
  );
};

export default SideFrame;
