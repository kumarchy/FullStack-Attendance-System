// Server-side code
require('dotenv').config();
const express = require("express");
const { spawn } = require("child_process");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { ConnectDB } = require("./config/db");

const ImageCollectRouter = require("./routes/ImageCollectRoutes.js");
const TrainModelRouter = require("./routes/TrainModelRoutes.js");
const TakeAttendanceRouter = require("./routes/TakeAttendanceRoutes.js");
const dataRouter = require("./routes/DataRoutes.js");
const saveImageRouter = require("./routes/SaveImageRoutes.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "http://10.10.33.187:5173",
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

ConnectDB();

// Api endPoints
app.use("/api/attendanceList", dataRouter);
app.use("/api", ImageCollectRouter);
app.use("/api", TrainModelRouter);
app.use("/api", TakeAttendanceRouter);
app.use("/api", saveImageRouter);

app.get("/", (req, resp) => {
  console.log("Root route hit");
  resp.send("Api is working");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
