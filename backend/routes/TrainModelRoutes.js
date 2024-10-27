const express = require("express");
const {TrainModel} = require("../controllers/TrainModelController");

const TrainModelRouter = express.Router();

TrainModelRouter.post("/train_model", TrainModel);

module.exports = TrainModelRouter;