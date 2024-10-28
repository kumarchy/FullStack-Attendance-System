
const dataModel = require("../modals/DataModal.js");
const dataList = async (req, resp) => {
  try {
    const data = await dataModel.find({});
    resp.json({ success: true, data: data});
  } catch (error) {
    resp.json({ success: false, message: "Error" });
  }
};

module.exports = dataList;