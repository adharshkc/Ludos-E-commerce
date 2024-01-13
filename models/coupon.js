const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  totalPrice: {
    type: Number,
  },
  discount: {
    type: Number,
    required: true,
  },
  lastUpdatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
  usedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Users",
  },
  expire: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Coupons", couponSchema);
