import React from "react";
import "../styles/dashboard.css";
import Header from "../components/Header";
import CardOne from "../components/dashboard/CardOne";
import CardTwo from "../components/dashboard/CardTwo";
import CardThree from "../components/dashboard/CardThree";
import CardFour from "../components/dashboard/CardFour";
import CardFive from "../components/dashboard/CardFive";
import CardSix from "../components/dashboard/CardSix";
import { TopArtistsData, heatmapDataType } from "../utils/globals";

type Props = {
  heatmapData: heatmapDataType;
  topArtistsData: TopArtistsData[];
};

const Dashboard = ({ heatmapData, topArtistsData }: Props) => {
  return (
    <div className="dashboard-root column">
      <Header title="Statistics" action="Upload"></Header>
      <div className="dashboard-body">
        <CardOne />
        <CardTwo />
        <CardThree heatmapData={heatmapData} />
        <CardFour />
        <CardFive topArtistsData={topArtistsData} />
        <CardSix />
      </div>
    </div>
  );
};

export default Dashboard;
