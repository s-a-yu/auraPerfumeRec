const mongoose = require("mongoose");

const fragranceSchema = new mongoose.Schema({
  Brand: { type: String },
  Name: { type: String, required: true, unique: true },
  Notes: { type: String },
  Images: [{ type: String }],
});

module.exports = mongoose.model("Fragrance", fragranceSchema);
