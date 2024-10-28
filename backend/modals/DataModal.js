// import mongoose from 'mongoose';
const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Number, required: true },
  roll_number: { type: String, required: true },
  status: { type: String, required: true },
  time: { type: String, required: true },
});

const date = new Date();
const day = date.getDate();
const year = date.getFullYear();
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const month = monthNames[date.getMonth()];

const formattedDate = `attendance_${day}_${month}_${year}`;

console.log(formattedDate);

const dataModel =
  mongoose.models.formattedDate || mongoose.model(formattedDate, dataSchema);

// export default dataModel;
module.exports = dataModel;
