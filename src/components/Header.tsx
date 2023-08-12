import React from "react";

type Props = {
  title: string;
  action: string;
};

const Header = ({ title, action }: Props) => {
  return (
    <div className="dashboard-header center">
      <div className="dashboard-title">{title}</div>
      <div className="dashboard-buttons">
        <button className="dashboard-header-action-button">{action}</button>
        <button className="dashboard-header-delete-button">
          <img src={`${process.env.PUBLIC_URL}/assets/trash.svg`} alt="del" />
        </button>
      </div>
    </div>
  );
};

export default Header;
