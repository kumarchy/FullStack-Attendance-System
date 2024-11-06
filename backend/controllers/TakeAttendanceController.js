const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const saveModel = require("../modals/SaveImageModel");

const TakeAttendance = async (req, res) => {
  try {
    const ImageCollection = await saveModel.find({});
    if (!ImageCollection || ImageCollection.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No images found" });
    }

    // Collect all image paths from the ImageCollection
    const imagePathsArray = [];
    ImageCollection.forEach((record) => {
      record.saveImage.forEach((filename) => {
        const imagePath = path.join(__dirname, "..", "uploads", filename); // Adjust "uploads" to match your directory
        imagePathsArray.push(imagePath);
      });
    });

    if (imagePathsArray.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No valid image paths found" });
    }

    // Spawn a single Python process with multiple image paths
    const pythonProcess = spawn("python", [
      "take_attendance.py",
      ...imagePathsArray,
    ]);

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
        const processedImagePath = path.join(
          __dirname,
          "processed_images",
          "processed_image.jpg"
        );

        if (fs.existsSync(processedImagePath)) {
          const imageBuffer = fs.readFileSync(processedImagePath);
          const base64Image = imageBuffer.toString("base64");
          res.json({
            success: true,
            message: "Attendance taken successfully",
            processedImage: `data:image/jpeg;base64,${base64Image}`,
            attendanceData: JSON.parse(stdoutData),
          });
          fs.unlinkSync(processedImagePath); // Clean up the processed image
        } else {
          res
            .status(500)
            .json({ success: false, message: "Processed image not found" });
        }
      } else {
        res
          .status(500)
          .json({
            success: false,
            message: "Error taking attendance",
            error: stderrData,
          });
      }
    });
  } catch (error) {
    console.error("Failed to process images:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process images", error });
  }
};

module.exports = { TakeAttendance };
