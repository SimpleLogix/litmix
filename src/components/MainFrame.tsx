import React from "react";

type Props = {
  page: string;
};

const MainFrame = ({ page }: Props) => {
  return (
    <div className="main-frame center">
      {page === "Dashboard" ? <div>Dashboard</div> : <div>Discover</div>}
    </div>
  );
};

export default MainFrame;
