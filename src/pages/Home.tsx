import React from "react";
import "../styles/stats-1.css";
import Header from "../components/Header";
import StatsPgOne from "../components/StatsPgOne";
import StatsPgTwo from "../components/StatsPgTwo";

type Props = {};

const Home = (props: Props) => {
  return (
    <div>
      <Header></Header>
      <StatsPgOne></StatsPgOne>
      <StatsPgTwo></StatsPgTwo>
    </div>
  );
};

export default Home;
