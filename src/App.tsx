import React, { useState } from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import { createDateValues } from "./utils/utils";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";

function App() {
  const [page, setPage] = useState("Dashboard");

  const heatmapData = createDateValues();

  return (
    <div className="app">
      <SideFrame page={page} setPage={setPage}></SideFrame>

      <div className="border"></div>

      <div className="main-frame center">
        {page === "Dashboard" ? (
          <Dashboard heatmapData={heatmapData} />
        ) : (
          <Discover />
        )}
      </div>
    </div>
  );
}

export default App;
