const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  cart:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts"
  },
  shippingAddress: {
   houseName: {
    type: String,
    required: true
   },
   city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true
  }
  },
  
  phone: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  
}, {timestamps: true});

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;
