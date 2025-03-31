# Full-Stack Face Recognition Attendance System

## 📋 Table of Contents

- Overview
- Features
- Tech Stack
- Architecture
- Setup and Installation
- Usage
- API Endpoints
- Future Enhancements
- Contributing

## 🌟 Overview

This project is a state-of-the-art, full-stack face recognition attendance system that integrates cutting-edge AI technology with modern web development practices. It provides a seamless, automated solution for tracking attendance in educational institutions or corporate environments.

## 🚀 Features

- Real-time face recognition using OpenCV and dlib's ResNet model
- User-friendly React.js frontend with live video feed
- Intuitive interface for student registration and data management
- Node.js backend with Python integration for AI processing
- MongoDB database for efficient data storage and retrieval
- Automated daily attendance tracking 
- Scalable architecture to handle multiple simultaneous users

## 💻 Tech Stack

- Frontend: React.js, Axios
- Backend: Node.js, Express.js, Python
- AI/ML: OpenCV, dlib ResNet, NumPy, scikit-image
- Database: MongoDB

## 🏗 Architecture

1. Frontend: React.js application with components for video capture, user registration, and attendance management.
2. Backend:
  - Node.js/Express.js server handling API requests and serving the React app.
  - Python scripts for face recognition and model training, integrated with Node.js.
3. Database: MongoDB for storing student information and attendance records.
4. AI Processing: OpenCV and dlib for face detection and recognition.

## Workflow
1. Data Collection
- Users can input student names and roll numbers
- The system captures images using the device's camera
- Images are stored in a structured directory
2. Model Training
- Collected images are processed to extract face encodings
- A face recognition model is trained on these encodings
3. Attendance Taking
- The system activates the camera and detects faces in real-time
- Detected faces are compared against the trained model
- Recognized students are marked as present in the database
  
## Components
## Frontend (React.js)
The frontend provides a user interface for:
- Inputting student details
- Capturing images for training
- Initiating the training process
- Taking attendance
  
Key components:

- Attendance.js: Main component for the attendance system UI
- StoreContext.js: Context provider for managing state and functions

## Backend (Node.js with Express)

The backend server handles:
- Image uploads
- Initiating Python scripts for model training and attendance taking
- Serving API endpoints for the frontend

Key endpoints:

- /collect_images: Handles image upload and storage
- /train_model: Initiates the model training process
- /take_attendance: Starts the attendance taking process

## Machine Learning Module (Python)

This module contains scripts for:

- Processing collected images
- Training the face recognition model
- Performing real-time face recognition for attendance

Key scripts:

- capture_images.py: Captures images for training
- train_model.py: Processes images and trains the face recognition model
- take_attendance.py: Performs real-time face recognition and marks attendance

## 🛠 Setup and Installation

- Clone the repository:
  ``` bash
  git clone https://github.com/kumarchy/FullStack-Attendance-System.git

- Install dependencies:
  ``` bash
  cd face-recognition-attendance
  npm install
  pip install -r requirements.txt

- Set up MongoDB and update the connection string in server.js.
- Start the server:
  ``` bash
  npm start
- In a new terminal, start the React app:
  ``` bash
  cd client
  npm start

## 📘 Usage

1. Use the "Training" section to register new students:
  - Enter name and roll number
  - Capture images using the webcam
2. Train the model using the "Train" button.
3. Use the "Take Attendance" button to start the attendance process.

## 🌐 API Endpoints

- POST /collect_images: Upload student images for training
- POST /train_model: Train the face recognition model
- POST /take_attendance: Initiate the attendance taking process

## 🔮 Future Enhancements

- Develop a mobile app for on-the-go attendance marking
- Optimize for large-scale deployments with load balancing
- Integrate with existing school/corporate management systems
- Implement data analytics for attendance trend analysis

## 🤝 Contributing
- Contributions are welcome! Please feel free to submit a Pull Request.

## Screenshots

![image](https://github.com/kumarchy/FullStack-Attendance-System/blob/c9b36b92cf646ad52528e429b1d194074581dd94/Screenshot%202024-10-12%20005711.png)
![image](https://github.com/kumarchy/FullStack-Attendance-System/blob/main/Screenshot%20From%202025-03-31%2018-50-58.png?raw=true
)

