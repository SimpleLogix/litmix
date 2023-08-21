import React, { useState } from "react";
import "../styles/dashboard.css";
import "../styles/upload.css";
import Header from "../components/Header";
import CardOne from "../components/dashboard/CardOne";
import CardTwo from "../components/dashboard/CardTwo";
import CardThree from "../components/dashboard/CardThree";
import CardFour from "../components/dashboard/CardFour";
import CardFive from "../components/dashboard/CardFive";
import CardSix from "../components/dashboard/CardSix";
import { Data } from "../utils/globals";
import UploadBox from "../components/UploadBox";

type Props = {
  data: Data;
};

const Dashboard = ({ data }: Props) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleUploadOpen = () => {
    setIsUploadOpen(!isUploadOpen);
  };

  const handleRootClick = () => {
    if (isUploadOpen) {
      setIsUploadOpen(false);
    }
  };

  const closeUploadCallback = () => {
    setIsUploadOpen(false);
  };

  return (
    <div className="dashboard-root column" onClick={handleRootClick}>
      <div className={`upload-root center ${isUploadOpen ? "" : "hidden"}`}>
        <UploadBox closeUploadCallback={closeUploadCallback} />
      </div>
      <Header
        title=""
        action="Upload"
        uploadOpenCallback={handleUploadOpen}
      ></Header>
      <div className="dashboard-body">
        <CardOne />
        <CardTwo hourlyData={data.hourlyData} />
        <CardThree heatmapData={data.heatmapData} />
        <CardFour />
        <CardFive topArtistsData={data.topArtistsData} />
        <CardSix weekdayData={data.weekdayData} />
      </div>
    </div>
  );
};

export default Dashboard;
