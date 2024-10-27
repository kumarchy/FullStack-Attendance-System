const { spawn } = require("child_process");

const TrainModel = (req, res) => {
  const pythonProcess = spawn("python", ["train_model.py"]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      res.json({ success: true, message: "Model trained successfully" });
    } else {
      res.status(500).json({ message: "Error training model" });
    }
  });
};

module.exports = {TrainModel};
