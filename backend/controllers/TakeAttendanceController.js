const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const TakeAttendance = (req, res) => {
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
};

module.exports = {TakeAttendance};