const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
  saveImage: [{ type: String, required: true }],
});

const saveModel =
  mongoose.models.saveImages || mongoose.model("saveImages", saveSchema);

module.exports = saveModel;
