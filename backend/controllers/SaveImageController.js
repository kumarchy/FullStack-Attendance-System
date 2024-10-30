const saveModel = require("../modals/SaveImageModel.js");

const saveImageDB = async (req, resp) => {
  if (!req.files || req.files.length === 0) {
    return resp.json({ success: false, message: "No image files uploaded" });
  }

  const imageList = req.files.map((file) => file.filename);
  console.log("Image List:", imageList); 

  const saveImage = new saveModel({
    saveImage: imageList, 
  });

  try {
    await saveImage.save();
    resp.json({ success: true, message: "Image saved successfully to DB" });
  } catch (error) {
    console.error("Error saving image to database:", error);
    resp.json({ success: false, message: "Error saving image to database" });
  }
};

module.exports = saveImageDB;
