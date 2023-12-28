const mongoose = require("mongoose");
const Product = require("./product");

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

cartSchema.methods.calculateTotalPrice = async function () {
  const cart = this;
  const items = cart.items;
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  cart.totalPrice = total;
  await cart.save();
};

module.exports = mongoose.mongoose.model("Carts", cartSchema);
