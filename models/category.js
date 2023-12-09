const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: Array,
    required: true,
  },
  brand: {
    type: Array,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
