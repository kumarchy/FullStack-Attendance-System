// Use CommonJS require instead of import
const mongoose = require("mongoose");

const ConnectDB = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/Attendance_system")
    .then(() => console.log("DB Connected"));
};

module.exports = { ConnectDB };
