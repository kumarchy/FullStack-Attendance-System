const fs = require("fs");
const path = require("path");

const ImageCollect = async(req, res) => {
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
};

module.exports = {ImageCollect};
