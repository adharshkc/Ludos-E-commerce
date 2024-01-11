const Razorpay = require("razorpay");
const Order = require("../models/order");
const userHelper = require("./user");
const User = require('../models/user')

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

module.exports = {
  getOrder: function (userId) {
    console.log("checkout");
  },

  createOrder: async function (userId, cart, body, payStatus ) {
    const productsToAdd = cart.map((product) => ({
      product_id: product.product_id._id,
      quantity: product.quantity,
    }));
    const userCart = await userHelper.getCart(userId);
    const totalPrice = userCart.totalPrice;
    
    const order = await Order.create({
      userid: userId,
      shippingAddress: {
        houseName: body.houseName,
        street: body.street,
        city: body.city,
        pincode: body.pincode,
      },
      products: productsToAdd,
      phone: body.phone,
      status: "placed",
      totalPrice: totalPrice,
      payment: {
        paymentType: body.payment,
        paymentStatus: payStatus,
      },
    });
    console.log("order created")
    if (order) {
      try {
        console.log(userId)
        const updatedCart = await userHelper.deleteCartAfterOrder(userId)
        console.log("updated")
        console.log(updatedCart)
        return order;
        
      } catch (error) {
        console.log(error)
      }
      // console.log(updatedCart)
    }
  },

  // generateRazorpay: (orderId, totalPrice) => {
  //   return new Promise((resolve, reject) => {
  //     console.log(orderId);
  //     var options = {
  //       amount: totalPrice * 100, // amount in the smallest currency unit
  //       currency: "INR",
  //       receipt: orderId,
  //     };
  //     instance.orders.create(options, function (err, order) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         // console.log("your order",order);
  //         resolve(order);
  //       }
  //     });
  //   });
  // },

  generateRazorPay: async function(orderId, totalPrice){
    
  }

  // verifyPayment: function(details){
  //     return new Promise((resolve, reject)=>{
  //         const crypto = require('crypto')
  //         const hmac =
  //     })
  // }
};
