import React, { useContext, useRef, useState } from "react";
import "./Attendance.css";
import { FaBars } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import AttendanceData from "./AttendanceData/AttendanceData";
import axios from "axios";

const Attendance = () => {
  const {
    setShowTraining,
    showTraining,
    canvasRef,
    videoRef,
    setName,
    name,
    setRollNumber,
    rollNumber,
    camera,
    toggleCamera,
    captureImage,
    capturedImage,
    handleCollect,
    imageCount,
    handleTrainClick,
    showSpinner,
    text,
    selectedFiles,
    setSelectedFiles,
    error,
    processedImage,
    acceptedFileTypeString,
    fileInputRef,
    handleFileBtn,
    processFiles,
    handleUpload,
    deleteProcessedImg,
    // background,
    // setbackground
  } = useContext(StoreContext);

  console.log("selected images:", selectedFiles);

  console.log("length:", selectedFiles.length);

  const SaveImageDB = async () => {
    try {
      const formData = new FormData();

      selectedFiles.forEach((fileObj) => {
        formData.append("image", fileObj.file); 
      });

      const response = await axios.post(
        "http://localhost:5000/api/addImage", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSelectedFiles([]); 
        alert("Images saved successfully!");
      } else {
        console.log(response.data.message);
        alert("Failed to save images");
      }
    } catch (error) {
      console.error("Error saving images:", error);
      alert("Error saving images");
    }
  };

  return (
    <>
      <div className={`attendance-page`}>
        <div className="spinner-position">
          <div className={`spinner ${showSpinner ? "show" : ""}`}>
            <img className="spinner_img" src="/public/spinner.gif" alt="" />
            <br />
          </div>
          <p>{text}</p>
        </div>

        <div className="attendance-content">
          <div className="attendance-heading">
            <h1 className="header">Attendance System</h1>
            <div className="attendance-image">
              <img
                src="/public/face recognization.webp"
                alt="Face Recognition"
                id="recognized-face"
              />
              <img src="/public/tick1.png" alt="" className="tick-icon" />
            </div>
          </div>

          {processedImage && (
            <div className="processed-Img">
              <div className="processed-heading">
                <h2>Processed Image</h2>
                <p onClick={deleteProcessedImg}>x</p>
              </div>

              <img
                src={processedImage}
                alt="Processed"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}

          <div className="card">
            <div
              className="drag-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => processFiles(e)}
            >
              <span className="select">Drag and Drop the files</span>
              <p>or</p>
              <div className="db-btn">
                <button className="upload-btn" onClick={handleFileBtn}>
                  Upload Files
                </button>
                <button
                  className="upload-btn"
                  // name="image"
                  onClick={SaveImageDB}
                >
                  Save
                </button>
              </div>
              <input
                type="file"
                name="image"
                accept={acceptedFileTypeString}
                id="file"
                ref={fileInputRef}
                onChange={processFiles}
                multiple
                hidden
              />
            </div>
            <div className="container">
              {selectedFiles.length > 0 ? (
                selectedFiles.map((image, index) => (
                  <div key={index} className="upload-img">
                    <img src={image.url} alt={image.name} />
                  </div>
                ))
              ) : (
                <p>No Files Uploaded Yet</p>
              )}
              <span className="delete" onClick={() => setSelectedFiles([])}>
                &times;
              </span>
            </div>

            {error && <p className="upload-error">{error}</p>}
            {/* ${background ? 'show-bg' : ''} */}
            <button className="attendance-btn" onClick={handleUpload}>
              Take Attendance
            </button>
          </div>
        </div>

        <div className="data-process">
          <FaBars
            className="training-icon"
            onClick={() => setShowTraining(!showTraining)}
          />
          <div className={`training-section ${showTraining ? "show" : ""}`}>
            <form className="data-gen">
              <div className="student-input">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter RollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>
              <div className="training-btns">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="train-btn"
                >
                  {camera ? "Stop Camera" : "Start Camera"}
                </button>
                <button
                  type="button"
                  onClick={captureImage}
                  className="train-btn"
                >
                  Capture Image
                </button>
                <canvas ref={canvasRef} style={{ display: "none" }} />
                {capturedImage && <img src={capturedImage} alt="Captured" />}
                <button
                  type="button"
                  className="train-btn"
                  onClick={handleCollect}
                >
                  Collect
                </button>
                {imageCount > 0 ? (
                  imageCount < 30 ? (
                    <p className="image-count">
                      {imageCount} image{imageCount > 1 ? "s" : ""} collected
                    </p>
                  ) : (
                    <p className="image-count">
                      User already exist (limit reached)
                    </p>
                  )
                ) : null}
                <button
                  type="button"
                  className="train-btn"
                  onClick={handleTrainClick}
                >
                  Train
                </button>
              </div>
            </form>
            <div className={`camera-access ${camera ? "show" : ""}`}>
              <video ref={videoRef} autoPlay />
            </div>
          </div>
        </div>
      </div>
      {/* <AttendanceData /> */}
    </>
  );
};

export default Attendance;
