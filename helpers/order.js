const Razorpay = require("razorpay");
const Order = require("../models/order");
const userHelper = require("./user");
const User = require("../models/user");
const Product = require("../models/product");

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

module.exports = {
  getOrder: async function (userId) {
    const order = await Order.find({userid: userId}).lean()
    
    return order
  },

  getAllOrder: async function(){
    const orders = await Order.find().populate('userid').lean()
    orders.forEach(order => {
      if (order.userid && order.userid.name) {
        console.log(order.userid.name);
      }
    });
    return orders
  },

  getSingleOrder : async function(orderId){
    const order = await Order.findOne({_id: orderId}).populate('products.product_id').lean()
    const names = order.products.map((product) =>{ 
      
      product.product_id})
    
    const proName = await Product.findOne({_id: names})
    console.log(proName)
    console.log(names)
    return order

  },

  createOrder: async function (userId, cart, body, statuses) {
    try {
      const productsToAdd = cart.map((product) => ({
        product_id: product.product_id._id,
        quantity: product.quantity,
      }));
      const userCart = await userHelper.getCart(userId);
      const totalPrice = userCart.totalPrice;
      const orderId = Math.floor((Math.random()* 1000000000)+1)

      const order = await Order.create({
        userid: userId,
        orderid: orderId,
        shippingAddress: {
          houseName: body.houseName,
          street: body.street,
          city: body.city,
          pincode: body.pincode,
        },
        products: productsToAdd,
        phone: body.phone,
        status: statuses.orderStatus,
        totalPrice: totalPrice,
        payment: {
          paymentType: body.payment,
          paymentStatus: statuses.payStatus,
        },
      });
      if (order.payment.paymentType == "COD") {
        try {
          console.log(userId);
          const updatedCart = await userHelper.deleteCartAfterOrder(userId);
          console.log("updated");
          console.log(updatedCart);
          return order;
        } catch (error) {
          console.log(error);
        }

        // console.log(updatedCart)
      } else {
        return order;
      }
    } catch (error) {
      console.log(error);
    }
  },

  generateRazorPay: async function (orderId, totalPrice) {
    return new Promise((resolve, reject) => {
      try {
        let options = {
          amount: totalPrice * 100,
          currency: "INR",
          receipt: orderId,
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            console.log(err);
          } else {
            console.log(order);
            resolve(order);
          }
        });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  updateOrder: async function (Id, statuses, userId, orderId) {
    console.log(statuses.orderStatus);
    const updatedOrder = await Order.findByIdAndUpdate(
      Id,
      {
        $set: {
          orderid: orderId,
          status: statuses.orderStatus,
          payment: {
            paymentType: "razorPay",
            paymentStatus: statuses.payStatus,
          },
        },
      },
      { new: true }
    );
    const updatedCart = await userHelper.deleteCartAfterOrder(userId);
    return updatedOrder;
  },
};
