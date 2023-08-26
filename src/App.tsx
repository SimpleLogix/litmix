import React, { useState } from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import { Data } from "./utils/globals";
import "./styles/animations.css";
import { checkExistingData } from "./utils/utils";

function App() {
  const [page, setPage] = useState("Dashboard");

  //? fetch data from storage if it exists
  // localStorage.clear()
  const data: Data = checkExistingData();

  return (
    <div className="app">
      <SideFrame page={page} setPage={setPage}></SideFrame>

      <div className="border"></div>

      <div className="main-frame center">
        {page === "Dashboard" ? <Dashboard data={data} /> : <Discover />}
      </div>
    </div>
  );
}

export default App;
