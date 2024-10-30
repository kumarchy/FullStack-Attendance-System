const express = require("express");
const multer = require("multer");

const saveImageDB = require("../controllers/SaveImageController.js");

const saveImageRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

saveImageRouter.post("/addImage", upload.array("image", 20), saveImageDB);

module.exports = saveImageRouter;
