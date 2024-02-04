const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h",
  },
});

const token = mongoose.model("Tokens", tokenSchema);
module.exports = token;
