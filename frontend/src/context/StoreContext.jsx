import axios from "axios";
import { createContext, useState, useRef } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [showTraining, setShowTraining] = useState(false);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState(false);
  const [imageCount, setImageCount] = useState(0);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCamera(true);
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCamera(false);
  };

  const toggleCamera = () => {
    if (camera) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageDataUrl);
  };

  const handleCollect = async () => {
    if (!capturedImage) {
      alert("Please capture an image first");
      return;
    }

    const blob = await fetch(capturedImage).then((r) => r.blob());
    const formData = new FormData();
    formData.append("image", blob, "captured_image.jpg");
    formData.append("name", name);
    formData.append("rollNumber", rollNumber);

    try {
      const response = await axios.post(
        "http://localhost:5000/collect_images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImageCount(response.data.message);
    } catch (error) {
      console.error("Error collecting images:", error);
      alert("Failed to collect images");
    }
  };

  const handleTrain = async () => {
    try {
      const response = await axios.post("http://localhost:5000/train_model");
      alert(response.data.message);
    } catch (error) {
      console.error("Error training model:", error);
      alert("Failed to train model");
    }
  };

  const handleTakeAttendance = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/take_attendance"
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error taking attendance:", error);
      alert("Failed to take attendance");
    }
  };

  const contextValue = {
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
    imageCount
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
