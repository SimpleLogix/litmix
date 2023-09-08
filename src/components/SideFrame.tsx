import React, { useState } from "react";
import "../styles/side.css";

type Props = {
  displayName: string;
  joinDate: string;
  imgUrl: string;
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

const UserIcon = ({ imgUrl }: { imgUrl: string }) => (
  <div
    className={`menu-icon icon`}
    style={{
      backgroundImage: `url(${
        imgUrl ? imgUrl : `${process.env.PUBLIC_URL}/assets/user.png`
      })`,
    }}
  />
);

const SideFrame = ({ page, setPage, displayName, joinDate, imgUrl }: Props) => {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // Creates a menu item with the given name
  const MenuItem = ({ name }: { name: string }) => (
    <div
      key={name === "Discover" ? shakeKey : undefined}
      className={`menu-item-container ${
        isShaking && name === "Discover" ? "shake" : ""
      } ${page === name ? "menu-selected" : ""} center`}
      onClick={() => {
        if (displayName !== "Username") {
          setPage(name);
        } else if (name === "Discover") {
          setIsShaking(true);
          setShakeKey((prevKey) => prevKey + 1); // force rerender
        }
      }}
    >
      <IconDiv iconName={name.toLowerCase()} />
      <div>{name}</div>
    </div>
  );

  return (
    <div className="side-frame center column">
      <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="Litmix" />
      <UserIcon imgUrl={imgUrl} />
      <div className="username">{displayName}</div>
      <div className="join-date">{joinDate}</div>
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
