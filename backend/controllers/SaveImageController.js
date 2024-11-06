const saveModel = require("../modals/SaveImageModel.js");

//save image collection to DB
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

// Get image collection from DB
// const fetchImage = async (req, resp) => {
//   try {
//     const ImageCollection = await saveModel.find({});
//     resp.json({ success: true, data: ImageCollection });
//   } catch (error) {
//     resp.json({ success: false, message: "Failed to fetch image collection" });
//   }
// };

// module.exports = {saveImageDB, fetchImage};
module.exports = {saveImageDB};