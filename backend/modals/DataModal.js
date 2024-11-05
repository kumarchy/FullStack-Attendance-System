const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  roll_number: { type: String, required: true },
  status: { type: String, required: true },
  time: { type: String, required: true },
});

const getCollectionName = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const month = monthNames[date.getMonth()].toLowerCase();
  const year = date.getFullYear();
  return `attendance_${day}_${month}_${year}`;
};

const collectionName = getCollectionName();
console.log("Using collection name:", collectionName); 

const dataModel =
  mongoose.models[collectionName] ||
  mongoose.model(collectionName, dataSchema, collectionName); 

module.exports = dataModel;
