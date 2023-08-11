import React, {useState} from "react";
import "./styles/app.css";
import SideFrame from "./components/SideFrame";
import MainFrame from "./components/MainFrame";

function App() {

  const [page, setPage] = useState("Dashboard");

  return (
    <div className="app">
      <SideFrame page={page} setPage={setPage}></SideFrame>
      <div className="border"></div>
      <MainFrame page={page}></MainFrame>
    </div>
  );
}

export default App;
