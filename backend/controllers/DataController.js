const mongoose = require("mongoose");
const dataModel = require("../modals/DataModal.js");

const dataList = async (req, resp) => {
  try {
    // Debug logs
    console.log("Collection name:", dataModel.collection.name);
    console.log(
      "Collection exists:",
      await mongoose.connection.db
        .listCollections({ name: dataModel.collection.name })
        .hasNext()
    );

    // Fetch all documents
    const data = await dataModel.find({});
    console.log("Query result:", data); // Debug log

    resp.json({ success: true, data: data });
  } catch (error) {
    console.error("Error details:", error); // Detailed error log
    resp.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
};

module.exports = dataList;
