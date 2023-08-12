import React from "react";
import "../styles/dashboard.css";
import Header from "../components/Header";
import CardOne from "../components/dashboard/CardOne";
import CardTwo from "../components/dashboard/CardTwo";
import CardThree from "../components/dashboard/CardThree";
import CardFour from "../components/dashboard/CardFour";
import CardFive from "../components/dashboard/CardFive";
import CardSix from "../components/dashboard/CardSix";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <div className="dashboard-root column">
      <Header title="Statistics" action="Upload"></Header>
      <div className="dashboard-body">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
        <CardFive />
        <CardSix />
      </div>
    </div>
  );
};

export default Dashboard;
