import React from "react";
import "../styles/dashboard.css";
import Header from "../components/Header";
import CardOne from "../components/dashboard/CardOne";
import CardTwo from "../components/dashboard/CardTwo";
import CardThree from "../components/dashboard/CardThree";
import CardFour from "../components/dashboard/CardFour";
import CardFive from "../components/dashboard/CardFive";
import CardSix from "../components/dashboard/CardSix";
import { Data } from "../utils/globals";

type Props = {
  data: Data;
};

const Dashboard = ({ data }: Props) => {
  return (
    <div className="dashboard-root column">
      <Header title="" action="Upload"></Header>
      <div className="dashboard-body">
        <CardOne />
        <CardTwo hourlyData={data.hourlyData} />
        <CardThree heatmapData={data.heatmapData} />
        <CardFour />
        <CardFive topArtistsData={data.topArtistsData} />
        <CardSix weekdayData={data.weekdayData}/>
      </div>
    </div>
  );
};

export default Dashboard;
