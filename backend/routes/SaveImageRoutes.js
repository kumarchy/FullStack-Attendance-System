const express = require("express");
const multer = require("multer");

const {saveImageDB, fetchImage} = require("../controllers/SaveImageController.js");

const saveImageRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Api to Save image collection
saveImageRouter.post("/addImage", upload.array("image", 20), saveImageDB);

// Api to fetch image collection
// saveImageRouter.get("/imageCollection", fetchImage)

module.exports = saveImageRouter;
