const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
  saveImage:{type:String, required:true}
})

const saveModel =mongoose.models.saveImage || mongoose.model("saveImage",saveSchema);

module.exports = saveModel;
