import React, { useContext, useEffect, useState } from 'react'
import "./TrainModel.css";
import { FaBars } from "react-icons/fa";
import { StoreContext } from '../../context/StoreContext';
const TrainModel = () => {
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
    showData,
  } = useContext(StoreContext);

  // const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 700);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobileView(window.innerWidth <= 640);
  //   };

  //   window.addEventListener('resize', handleResize);
  //   handleResize();
    
  //   console.log("mobile view is:",isMobileView);
  // }, []);

  return (
    <div className={`data-process ${showData ? 'disableFbars' : ''}`}>
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

          {/* <div className={`camera-access ${isMobileView ? "show-640px" : "show"}`}>
          <video ref={videoRef} autoPlay />
          </div> */}

          <button
            type="button"
            onClick={captureImage}
            className="train-btn"
          >
            Capture Image
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {capturedImage && <img className='capturedImage' src={capturedImage} alt="Captured" />}
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
  )
}

export default TrainModel;