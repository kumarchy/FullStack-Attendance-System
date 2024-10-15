// Server-side code
const express = require("express");
const { spawn } = require("child_process");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

//upload directory
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Endpoint to collect images
app.post("/collect_images", upload.single("image"), (req, res) => {
  try {
    const { name, rollNumber } = req.body;
    if (!name || !rollNumber) {
      throw new Error("Name and roll number are required");
    }
    if (!req.file) {
      throw new Error("No file uploaded");
    }
    const imagePath = req.file.path;

    const directoryName = `Dataset/${name} (${rollNumber})`;
    if (!fs.existsSync(directoryName)) {
      fs.mkdirSync(directoryName, { recursive: true });
    }

    const newPath = path.join(directoryName, path.basename(imagePath));
    fs.renameSync(imagePath, newPath);

    console.log(`Image collected successfully: ${newPath}`);

    const files = fs.readdirSync(directoryName);
    const count = files.length;
    console.log(count);

    if (count >= 30) {
      fs.unlinkSync(imagePath);
      return res.json({
        message: "User already exist(limit reached)",
        count: count,
      });
    }

    res.json({ count: `${count}` });
  } catch (error) {
    console.error("Error in /collect_images:", error);
    res
      .status(500)
      .json({ message: "Failed to collect image", error: error.message });
  }
});

// Endpoint to train the model
app.post("/train_model", (req, res) => {
  const pythonProcess = spawn("python", ["train_model.py"]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      res.json({ success: true, message: "Model trained successfully" });
    } else {
      res.status(500).json({ message: "Error training model" });
    }
  });
});

// Endpoint to take attendance
app.post("/take_attendance", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const imagePath = req.file.path;
  const pythonProcess = spawn("python", ["take_attendance.py", imagePath]);

  let stdoutData = "";
  let stderrData = "";

  pythonProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      // Assuming the Python script saves the processed image
      const processedImagePath = path.join(__dirname, "processed_image.jpg");
      if (fs.existsSync(processedImagePath)) {
        const imageBuffer = fs.readFileSync(processedImagePath);
        const base64Image = imageBuffer.toString("base64");
        res.json({ 
          message: "Attendance taken successfully",
          processedImage: `data:image/jpeg;base64,${base64Image}`,
          attendanceData: JSON.parse(stdoutData)
        });
        fs.unlinkSync(processedImagePath); // Clean up the processed image
      } else {
        res.status(500).json({ message: "Processed image not found" });
      }
    } else {
      res.status(500).json({ message: "Error taking attendance", error: stderrData });
    }
    fs.unlinkSync(imagePath); // Clean up the uploaded image
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
