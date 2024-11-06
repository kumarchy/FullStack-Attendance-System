const express = require("express");
const dataList = require("../controllers/DataController.js");
const dataRouter = express.Router();

dataRouter.get("/list",dataList);

module.exports = dataRouter;
