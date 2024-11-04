// Use CommonJS require instead of import
const mongoose = require("mongoose");
console.log("mongo url is", process.env.MONGODB_URI);
const ConnectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB Connected"));
};

module.exports = { ConnectDB };
