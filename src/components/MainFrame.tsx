import React from "react";
import Dashboard from "../pages/Dashboard";
import Discover from "../pages/Discover";

type Props = {
  page: string;
};

const MainFrame = ({ page }: Props) => {
  return (
    <div className="main-frame center">
      {page === "Dashboard" ? <Dashboard /> : <Discover />}
    </div>
  );
};

export default MainFrame;
