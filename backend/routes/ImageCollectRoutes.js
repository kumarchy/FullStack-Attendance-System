const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {ImageCollect} = require("../controllers/ImageCollectController");

const ImageCollectRouter = express.Router();

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

ImageCollectRouter.post("/collect_images", upload.single("image"), ImageCollect);


module.exports = ImageCollectRouter;