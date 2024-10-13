import React, { useContext, useState } from "react";
import "./Attendance.css";
import { FaBars } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

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
    handleTrain,
    handleTakeAttendance,
    imageCount,
    imageLimit,
    handleTrainClick,
    showSpinner,
    text
  } = useContext(StoreContext);

  

  return (
    <div className="attendance-page">
      <div className="spinner-position">
      <div className={`spinner ${showSpinner ? 'show' : ''}`}>
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

        <button className="attendance-btn" onClick={handleTakeAttendance}>
          Take Attendance
        </button>
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
              <p className="image-count">{imageCount} image{imageCount > 1 ? 's' : ''} collected</p>
            ) : (
              <p className="image-count">User already exist (limit reached)</p>
            )
          ) : null}

              <button type="button" className="train-btn" onClick={handleTrainClick}>
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
  );
};

export default Attendance;
