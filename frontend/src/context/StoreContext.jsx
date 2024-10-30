import axios from "axios";
import { createContext, useState, useRef, useEffect } from "react";

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
  // const [imageLimit, setImageLimit] = useState("");
  const [text, setText] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [processedImage, setProcessedImage] = useState(null);
  const [data, setData] = useState([]);

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
        "http://localhost:5000/api/collect_images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImageCount(response.data.count);
    } catch (error) {
      console.error("Error collecting images:", error);
      // setImageLimit(response.data.message);
      alert("Failed to collect images");
    }
  };

  const handleTrain = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/train_model"
      );
      return response.data.success;
    } catch (error) {
      console.error("Error training model:", error);
      alert("Failed to train model");
    }
  };

  const handleTrainClick = async () => {
    setShowSpinner(true);
    setText("");
    try {
      await handleTrain();
      setShowSpinner(false);
      setText("Training Successful...");
    } catch (error) {
      setShowSpinner(false);
      setText("Training Failed");
      console.error("Error during training:", error);
    }
  };

  setTimeout(() => {
    setText("");
  }, 3000);

  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypeString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const fileInputRef = useRef();

  const handleFileBtn = () => {
    fileInputRef.current.click();
  };

  const processFiles = (event) => {
    const newFiles = Array.from(event.target.files);
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");

    newFiles.forEach((file) => {
      if (!fileTypeRegex.test(file.name.split(".").pop())) {
        hasError = true;
        setError(`Only ${acceptedFileExtensions.join(", ")} files are allowed`);
      } else {
        const fileUrl = {
          file,
          url: URL.createObjectURL(file),
        };
        setSelectedFiles((prevFiles) => [...prevFiles, fileUrl]);
      }
    });

    if (!hasError) {
      setError("");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFiles[0].file);
    try {
      const response = await fetch(
        "http://localhost:5000/api/take_attendance",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to take attendance");
      }

      const data = await response.json();
      setProcessedImage(data.processedImage);
    } catch (error) {
      console.error("Error taking attendance:", error);
      setError("Failed to take attendance. Please try again.");
    }
  };

  const deleteProcessedImg = () => {
    setProcessedImage(null);
  };

  // fetching the attendance data from the database

  const fetchAttendance = async () => {
    try {
      let response = await axios.get(
        "http://localhost:5000/api/attendanceList/list"
      );

      console.log("API Response:", response.data);
      if (response.data.success && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        console.log("No data or incorrect response format");
        setData([]);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  console.log("fetched data:", data);

  useEffect(() => {
    fetchAttendance();
  }, []);

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
    data,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
