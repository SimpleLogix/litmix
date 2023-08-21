import React, { useState } from "react";

type Props = {
  closeUploadCallback: () => void;
};

const PreUpload = ({ uploadCallback }: { uploadCallback: () => void }) => (
  <div className="upload-button center" onClick={uploadCallback}>
    Choose File
  </div>
);

const UploadSelection = ({}) => (
  <div className="upload-selection-root center">
    <div className="file-name">
      <img src={`${process.env.PUBLIC_URL}/assets/import.svg`} alt="" />
      Data.JSON
      <img src={`${process.env.PUBLIC_URL}/assets/close.svg`} alt="" />
      <div>Upload</div>
    </div>
  </div>
);

const UploadBox = ({ closeUploadCallback }: Props) => {
  const [uploadState, setUploadState] = useState<
    "preupload" | "uploading" | "success" | "failure"
  >("preupload");

  return (
    <div
      className="upload-box card center"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="left center">
        <img src={`${process.env.PUBLIC_URL}/assets/import.svg`} alt="" />
      </div>

      <div className="upload-box-content column">
        <div>
          <h2>Upload a File</h2>
          <p>Select a file to upload from your computer</p>
        </div>
        {uploadState === "preupload" ? (
          <PreUpload
            uploadCallback={() => {
              setUploadState("uploading");
            }}
          />
        ) : uploadState === "uploading" ? (
          <UploadSelection />
        ) : null}
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
