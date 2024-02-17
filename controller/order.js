const cart = require("../helpers/cart");
const Order = require("../models/order");
const crypto = require("crypto");
const { logger } = require("../utils/logger");
const orderHelper = require("../helpers/order");
const userHelper = require("../helpers/user");

// const deleteCart = require("../helpers/cart")

/*************************************************CART*************************************************************/

const adminOrders = async function (req, res) {
  const orders = await orderHelper.getAllOrder();
  res.render("admin/orders", { orders: orders });
};

///////////////////////////////////////////////////////////////CHECKOUT/////////////////////////////////////////////////////

const getCheckout = async function (req, res) {
  const userId = req.session.userid;
  let isUser = true;
  const user = await userHelper.getCart(userId);
  // console.log(user.cart.coupon.code)
  let coupon = await orderHelper.getCoupon(user.totalPrice);
  console.log(coupon.length)
  if (user.cart.cart) {
    let totalPrice;
    
    const address = user.cart.address[0];
    
    if (coupon.length < 1) {
      console.log(coupon)
      totalPrice = user.totalPrice;
      const subTotal = totalPrice;
      const discount = 0;
      if (totalPrice < 500){
        res.render("user/checkout", {isUser, user: user, totalPrice, message: "cannot order below ₹500"});
      }else{
        res.render("user/checkout", {isUser, user: user, totalPrice, subTotal, address, discount})
        
      }
      
    } else {
      //  coupon = coupon[0]
      if(user.cart.coupon){

        console.log("coupon is ther")
        totalPrice = user.totalPrice-user.cart.coupon.discount;
        const subTotal = user.totalPrice
        const code= user.cart.coupon.code
        const discount = user.cart.coupon.discount
        // const discount = coupon[0].discount
        console.log("bjf")
        res.render("user/checkout", { isUser, user: user, totalPrice,subTotal, address, coupon, couponCode: code, discount });
      }else{
        console.log('no coupon')
        totalPrice = user.totalPrice;
        const subTotal = totalPrice;
        discount = 0;
        res.render("user/checkout", { isUser, user: user, totalPrice,subTotal, address, coupon, discount });

      }

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
    console.log('cart', cart)
    if (user) {
      // await userHelper.addAddress(req.body, userId);
      if (req.body.payment == "COD") {
        const statuses = {
          orderStatus: "placed",
          payStatus: "pending",
        };
        console.log(req.body.name)
        const newOrder = await orderHelper.createOrder(
          userId,
          req.body.couponId,
          cart,
          req.body,
          statuses
        );
        const updateCoupon = await orderHelper.updateCoupon(
          req.body.couponId,
          userId
        );
        res.json(newOrder);
      } else if (req.body.payment == "razorPay") {
        const statuses = {
          orderStatus: "pending",
          payStatus: "pending",
        };
        console.log("user")

        const order = await orderHelper.createOrder(
          userId,
          req.body.couponId,
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
      return res.json({ status: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "Payment failed" });
    }
  } else {
    logger.log("payment failed: signatures does not match");
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

const couponGet = async function(req, res){
  const userId = req.session.userid;
  const user = await userHelper.findUserById(userId)
  console.log("coupn",user.coupon)
  if(user.coupon){
    const code = user.coupon.code;
    res.json({code})

  }else{
    const code = null;
    res.json({code})
  }
}

const postCoupon = async function (req, res) {
  const userId = req.session.userid;
  const couponCode = req.body.couponId;
  const coupon = await orderHelper.showCoupon(couponCode);
  if (coupon) {
    const updatedCoupon = await userHelper.updateCoupon(userId, couponCode, coupon.discount)
    const discount = coupon.discount;
    const code = coupon.code;
    const price = await userHelper.getCart(userId);
    const totalPrice = price.totalPrice - discount;
    res.json({ totalPrice, discount, code });
  } else {
    res.json({ message: "error" });
  }
};

const removeCoupon = async function(req, res){
  const userId = req.session.userid;
  const couponCode = req.body.couponCode;
  console.log(couponCode)
  const coupon = await orderHelper.showCoupon(couponCode)
  if(coupon){
    const removedCoupon = await userHelper.couponRemove(userId, couponCode, coupon.discount)
    const price = await userHelper.getCart(userId)
    const totalPrice = price.totalPrice
    const discount = 0;
    res.json({ totalPrice, discount, couponCode })
  }
}

const orders = async function (req, res) {
  const userId = req.session.userid;
  let isUser = true;
  let orders = await orderHelper.getOrder(userId);
  orders = orders.reverse();
  res.render("user/orders", { orders: orders, isUser });
};

const singleOrder = async function (req, res) {
  const orderId = req.params.id;

  const user = await userHelper.findUserById(req.session.userid);
  const order = await orderHelper.getSingleOrder(orderId);
  res.render("user/single-order", { order: order, user: user, isUser: true });
};

const deleteOrder = async function (req, res) {
  const deletedOrder = await orderHelper.cancelOrder(req.params.id);
  res.redirect("/admin/orders");
};

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
  deleteOrder,
  couponGet,
  removeCoupon
};
