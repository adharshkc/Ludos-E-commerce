const mongoose = require("mongoose")

const orderItems = mongoose.Schema({
    quantity: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Products"
    }
})

module.exports = mongoose.model("OrderItems", orderItems)