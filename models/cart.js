const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true
    },
    items: [{
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required: true
      },
      quantity:{
        type:Number,
        default: 1
      }
    }]
});

module.exports = mongoose.mongoose.model("Carts",cartSchema )