const cart = require("../helpers/cart");
const Order = require("../models/order");
const crypto = require("crypto");
const { logger } = require("../utils/logger");
const orderHelper = require("../helpers/order");
const userHelper = require("../helpers/user");

// const deleteCart = require("../helpers/cart")

/*************************************************CART*************************************************************/

const adminOrders = async function (req, res) {
  const orders = await orderHelper.getAllOrder()
  // console.log(orders.user.name)
  res.render("admin/orders", { orders: orders });
};

///////////////////////////////////////////////////////////////CHECKOUT/////////////////////////////////////////////////////

const getCheckout = async function (req, res) {
  const userId = req.session.userid;
  let isUser = true;
  const user = await userHelper.getCart(userId);
  let coupon = await orderHelper.getCoupon(user.totalPrice) 
  if (user.cart.cart) {
    const totalPrice = user.totalPrice;
    const address = user.cart.address[0];
    if(coupon.length<1){
      if(totalPrice<500)res.render("user/checkout", {isUser, user: user, totalPrice, message: "cannot order below ₹500"})
      res.render("user/checkout", {isUser, user: user, totalPrice, address})
    }else{
      //  coupon = coupon[0]
      // const discount = coupon[0].discount
      res.render("user/checkout", { isUser, user: user, totalPrice, address, coupon });

    }
  } else {
    res.redirect("/cart");
  }
};

const deleteProductCheckout = async function (req, res) {
  cart.deleteCartProduct(req.session.userid, req.params.id).then(() => {
    res.redirect("/checkout");
  });
};

const postCheckout = async function (req, res) {
  try {
    
    const userId = req.session.userid;
    const user = await userHelper.getCart(userId);
    const cart = user.cart.cart;
    if (user) {
      await userHelper.addAddress(req.body, userId)
      if (req.body.payment == "COD") {
        const statuses = {
          orderStatus: "placed",
          payStatus: "pending",
        };
        const newOrder = await orderHelper.createOrder(
          userId,
          cart,
          req.body,
          statuses
        );
        const updateCoupon = await orderHelper.updateCoupon(req.body.couponId,userId)
        res.json(newOrder);
      } else if (req.body.payment == "razorPay") {
        const statuses = {
          orderStatus: "pending",
          payStatus: "pending",
        };
        const order = await orderHelper.createOrder(
          userId,
          cart,
          req.body,
          statuses
        );
        if (order) {
          try {
            const orderInstance = await orderHelper.generateRazorPay(
              order._id,
              order.totalPrice
            );
            console.log(orderInstance);
            res.json(orderInstance);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    // logger.error({ message: "error post checkout", error });
  }
};

const verifyPayment = async function (req, res) {
  console.log(req.body);
  const userId = req.session.userid;
  const paymentId = req.body["payment[razorpay_payment_id]"];
  const orderId = req.body["payment[razorpay_order_id]"];
  const signature = req.body["payment[razorpay_signature]"];

  let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature == signature) {
    try {
      const orderIdToUpdate = req.body["order[receipt]"];
      // const updatedOrder = await Order.findByIdAndUpdate(
      //   orderIdToUpdate,
      //   { status: "placed" },
      //   { new: true }
      // );
      const statuses = {
        orderStatus: "placed",
        payStatus: "success",
      };
      const updatedOrder = await orderHelper.updateOrder(
        orderIdToUpdate,
        statuses,
        userId,
        orderId
      );
      console.log("Payment successful");
      // console.log(updatedOrder);
      return res.json({ status: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "Payment failed" });
    }
  } else {
    console.log("Payment failed: Signatures don't match");
    return res
      .status(403)
      .json({ status: "Payment failed: Signatures do not match" });
  }
};

const success = async function (req, res) {
  res.render("user/success");
};

const failed = async function (req, res) {
  res.render("user/failed");
};

const postCoupon = async function(req, res){
  const userId = req.session.userid
  console.log(userId)
  const couponCode = req.body.couponId
  const coupon = await orderHelper.showCoupon(couponCode)
  console.log("COUPON",coupon)
  if(coupon){
    const discount = coupon.discount
    const price = await userHelper.getCart(userId)
    const totalPrice = price.totalPrice - discount
    console.log(totalPrice)
    res.json({totalPrice, discount})
  }else{
    res.json({message: "error"})
  }  
}

const orders = async function (req, res) {
  const userId = req.session.userid;
  let isUser = true;
  let orders = await orderHelper.getOrder(userId); 
  orders = orders.reverse()
  console.log(orders[0].products)
  res.render("user/orders", { orders: orders, isUser });
};

const singleOrder = async function (req, res) {
  const orderId = req.params.id;

  const user = await userHelper.findUserById(req.session.userid)
  const order = await orderHelper.getSingleOrder(orderId);
  // console.log(order.products.product_id.name)
  res.render("user/single-order", {order:order, user: user, isUser: true});
};

const deleteOrder = async function(req, res){
  const deletedOrder = await orderHelper.deleteOrder(req.params.id)
  res.redirect("/admin/orders")
}

module.exports = {
  // addToCart,

  getCheckout,
  deleteProductCheckout,
  postCheckout,
  verifyPayment,
  adminOrders,
  success,
  failed,
  postCoupon,
  orders,
  singleOrder,
  deleteOrder
};
