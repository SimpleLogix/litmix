import React, { ChangeEvent, SetStateAction, useEffect, useRef } from "react";
import EMPTY_DATA, { UserFile } from "../utils/globals";
import { handleUploadedFile, saveData } from "../utils/FileHandler";
import { analyzeUserData } from "../utils/Stats";

type Props = {
  closeUploadCallback: () => void;
  file: UserFile | null;
  setFile: React.Dispatch<React.SetStateAction<UserFile | null>>;
  uploadState: "preupload" | "uploading" | "processing" | "success" | "failure";
  setUploadState: React.Dispatch<
    SetStateAction<
      "preupload" | "uploading" | "processing" | "success" | "failure"
    >
  >;
  progress: number;
  setProgress: React.Dispatch<SetStateAction<number>>;
};

const UploadBox = ({
  closeUploadCallback,
  file,
  setFile,
  uploadState,
  setUploadState,
  progress,
  setProgress,
}: Props) => {
  // workaround for custom input styling
  const fileInputRef = useRef<HTMLInputElement>(null);

  //? components
  const PreUpload = () => (
    <div
      className="pre-upload-button center"
      onClick={() => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} />
      Choose File
    </div>
  );

  const UploadSelection = () => (
    <div className="upload-selection-root center">
      <img src={`${process.env.PUBLIC_URL}/assets/file.svg`} alt="" />

      <div className="file-name-wrapper center">
        <div className="file-name">{file?.name}</div>
        <img
          src={`${process.env.PUBLIC_URL}/assets/close.svg`}
          alt=""
          onClick={removeFile}
        />
      </div>
      <div
        className="upload-button center"
        onClick={() => {
          uploadFile(file!);
        }}
      >
        Upload
      </div>
    </div>
  );

  const ProgressBar = () => (
    <div className="progress-bar-wrapper column">
      <div className="upload-progress">{`${progress}%`}</div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );

  const UploadSuccess = () => (
    <div
      className="refresh-button"
      onClick={() => {
        window.location.reload();
      }}
    >
      Refresh
    </div>
  );

  //? use Effect
  useEffect(() => {
    ///! Add file processing here... this is ran when uploadState changes to processing
    if (uploadState === "processing") {
      const interval = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 100 : prevProgress + 2
        );
      }, 24); // Adjust the interval for smoother/faster animation
      if (progress === 100) {
      }
      return () => clearInterval(interval);
    }
  }, [setProgress, uploadState, progress, setUploadState]);

  // reset upload state when progress reaches 100
  useEffect(() => {
    if (progress === 100) {
      if (file?.stats === EMPTY_DATA) {
        setUploadState("failure");
      } else {
        setUploadState("success");
      }
      setProgress(0);
    }
  }, [file?.stats, progress, setProgress, setUploadState, uploadState]);

  //? handlers
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    // grab the file uploaded from input element
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file) {
        setUploadState("uploading");
        setFile({
          name: file.name,
          stats: EMPTY_DATA,
          file: file,
        });
      }
    }
  };

  const removeFile = () => {
    setUploadState("preupload");
    setFile(null);
  };

  const uploadFile = (file: UserFile) => {
    setUploadState("processing");
    // get data from file handler
    handleUploadedFile(file?.file!, (data) => {
      if (data) {
        analyzeUserData(data); // update yearlyData stats
        setFile({ name: file.name, stats: data, file: file.file });
        saveData(data);
        console.log(data);
      } else {
        setUploadState("failure");
      }
    });
  };

  return (
    <div
      className="upload-box card center"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="left center">
        <img
          src={`${process.env.PUBLIC_URL}/assets/${
            uploadState === "success"
              ? "check"
              : uploadState === "failure"
              ? "retry"
              : "import"
          }.svg`}
          alt=""
          className={`${uploadState === "processing" ? "breathing" : ""}`}
        />
      </div>

      <div className="upload-box-content column">
        <div>
          {(uploadState === "preupload" || uploadState === "uploading") && (
            <h2 className="fade-in-top">Upload a File</h2>
          )}
          {uploadState === "processing" && (
            <h2 className="fade-in-top">Processing...</h2>
          )}
          {uploadState === "success" && (
            <h2 className="fade-in-top">Upload Successful!</h2>
          )}
          {uploadState === "failure" && (
            <h2 className="fade-in-top">Upload Failed!</h2>
          )}

          {(uploadState === "preupload" || uploadState === "uploading") && (
            <p className="fade-in">
              Select a file to upload from your computer
            </p>
          )}
          {uploadState === "processing" && (
            <p className="fade-in">
              Give us a moment while we process your file and analyze your data
            </p>
          )}
          {uploadState === "success" && (
            <p className="fade-in">
              Your file has been processed successfully. Refresh the page to see
              your data.
            </p>
          )}
          {uploadState === "failure" && (
            <p className="fade-in">
              Your file was not processed successfully. Please try again.
            </p>
          )}
        </div>
        {uploadState === "preupload" && <PreUpload />}
        {uploadState === "uploading" && <UploadSelection />}
        {uploadState === "processing" && <ProgressBar />}
        {uploadState === "success" && <UploadSuccess />}
        {uploadState === "failure" && <UploadSelection />}
      </div>

      <div className="upload-box-close-wrapper">
        <img
          src={`${process.env.PUBLIC_URL}/assets/close.svg`}
          alt=""
          onClick={closeUploadCallback}
        />
      </div>
    </div>
  );
};

export default UploadBox;
