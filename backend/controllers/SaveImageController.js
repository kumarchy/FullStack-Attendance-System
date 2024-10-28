// import saveModel from "../modals/SaveImageModel";
const saveModel = require("../modals/SaveImageModel");

const saveImageDB = async (req, resp) => {
  const Image_fileName = `${req.file.filename}`;

  const saveImage = new saveModel({
    saveImg: Image_fileName,
  });

  try {
    await saveImage.save();
    resp.json({ success: true, message: "Image saved successfully to DB" });
  } catch (error) {
    resp.json({ success: false, message: "Error" });
  }
};

module.exports = saveImageDB;
