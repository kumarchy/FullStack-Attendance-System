const express = require("express");
const dataList = require("../controllers/DataController.js");
const dataRouter = express.Router();

// Fetch Attendance List API
// dataRouter.get("/list", getData);
// achievementRouter.get("/list",achievementList);
// dataRouter.get("/", (req, resp) => {
//     resp.send("Api is working");
// });

dataRouter.get("/list",dataList);


module.exports = dataRouter;
