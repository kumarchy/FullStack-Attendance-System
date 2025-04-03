const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  TakeAttendance,
} = require("../controllers/TakeAttendanceController.js");

const TakeAttendanceRouter = express.Router();

TakeAttendanceRouter.get("/imageCollection", TakeAttendance)

module.exports = TakeAttendanceRouter;
