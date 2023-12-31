import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "../styles/upload.css";
import Header from "../components/Header";
import CardOne from "../components/dashboard/CardOne";
import CardTwo from "../components/dashboard/CardTwo";
import CardThree from "../components/dashboard/CardThree";
import CardFour from "../components/dashboard/CardFour";
import CardFive from "../components/dashboard/CardFive";
import CardSix from "../components/dashboard/CardSix";
import { Data, UserFile, hourlyDataDummy } from "../utils/globals";
import UploadBox from "../components/UploadBox";

type Props = {
  data: Data;
};

const Dashboard = ({ data }: Props) => {
  //? states
  // upload box
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  // uplaod state inside the box
  //* these states are outside in order to be reset when user clicks outside the upload box
  const [uploadState, setUploadState] = useState<
    "preupload" | "uploading" | "processing" | "success" | "failure"
  >("preupload");
  const [file, setFile] = useState<UserFile | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUploadOpen = () => {
    setIsUploadOpen(!isUploadOpen);
  };

  const handleRootClick = () => {
    if (isUploadOpen) {
      closeUploadCallback();
    }
  };

  const closeUploadCallback = () => {
    if (
      uploadState !== "success" &&
      uploadState !== "processing" &&
      data.hourlyData !== hourlyDataDummy
    ) {
      setIsUploadOpen(false);
      setFile(null);
      setUploadState("preupload");
      setProgress(0);
    }
  };

  //! turn this off
  useEffect(() => {
    if (data.hourlyData === hourlyDataDummy) {
      setIsUploadOpen(true);
    }
  }, [data.hourlyData]);

  return (
    <div className="dashboard-root column" onClick={handleRootClick}>
      <div className={`upload-root center ${isUploadOpen ? "" : "hidden"}`}>
        <UploadBox
          closeUploadCallback={closeUploadCallback}
          file={file}
          setFile={setFile}
          uploadState={uploadState}
          setUploadState={setUploadState}
          progress={progress}
          setProgress={setProgress}
        />
      </div>
      <Header
        title=""
        action="Upload"
        uploadOpenCallback={handleUploadOpen}
      ></Header>
      <div className="dashboard-body">
        <CardOne yearlyData={data.yearlyData} />
        <CardTwo hourlyData={data.hourlyData} />
        <CardThree heatmapData={data.heatmapData} years={data.years} />
        <CardFour genresData={data.genres} />
        <CardFive
          topArtistsData={Object.values(data.topArtistsData)
            .sort((a, b) => b.msStreamed - a.msStreamed)
            .splice(0, 10)}
        />
        <CardSix weekdayData={data.weekdayData} />
      </div>
    </div>
  );
};

export default Dashboard;
