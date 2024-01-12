const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    orderid:{
      type: String
    },
    shippingAddress: {
      houseName: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Products",
        },
        quantity: { type: Number, required: true },
      },
    ],

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
    payment: {
      paymentType: String,
      paymentId: String,
      paymentStatus: String,
    },
    orderedDate: { type: Date, default: Date.now() },
  }
  // { timestamps: true }
);

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;
