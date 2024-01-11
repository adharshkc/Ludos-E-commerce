const Cart = require("../models/cart");
const cart = require("../helpers/cart");
const Order = require("../models/order");
const crypto = require("crypto");
const {logger} = require("../utils/logger")
const orderHelper = require("../helpers/order");
const userHelper = require("../helpers/user");

// const deleteCart = require("../helpers/cart")

/*************************************************CART*************************************************************/

// const addToCart = async function (req, res) {
//   const userId = req.session.userid;
//   cart.addItemsToCart(req.session.userid, req.params.id);

//   res.redirect("/products");
// };

// const   addProductToCart = async function (req, res) {
//   cart.addItemsToCart(req.session.userid, req.params.id).then(() => {
//     res.redirect("/cart");
//   });
// };

// const getCart = async function (req, res) {
//   if (req.session.user) {
//     const userId = req.session.userid;
//     let isUser = true;
//     const cart = await Cart.findOne({ user: userId })
//       .populate("items.product")
//       .lean();
//     if (cart) {
//       let totalPrice = 0;
//       for (const item of cart.items) {
//         totalPrice += item.quantity * item.product.price;
//       }
//       console.log(totalPrice);
//       res.render("user/cart", {
//         layout: "../layouts/layout",
//         isUser,
//         cart: cart,
//         totalPrice,
//       });
//     }
//   }
// };

// const deleteCart = async function (req, res) {
//   const userId = req.session.userid;
//   cart.deleteCartProduct(userId, req.params.id).then(() => {
//     res.redirect("/cart");
//   });
// };

// const updateCart = async function (req, res) {
//   const { proId, count } = req.body;
//   const userId = req.session.userid;

//   try {
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const result = await Cart.updateOne(
//       { user: userId, "items.product": proId },
//       { $inc: { "items.$.quantity": count } },
//       {
//         $set: {
//           totalPrice: {
//             $reduce: {
//               input: "$items",
//               initialValue: 0,
//               in: {
//                 $add: [
//                   "$$value",
//                   { $multiply: ["$$this.product.price", "$$this.quantity"] },
//                 ],
//               },
//             },
//           },
//         },
//       }
//     );

//     console.log("Cart updated successfully");
//     return res.status(200).json({ message: "Cart updated successfully", cart });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// };

const adminOrders = async function (req, res) {
  const orders = await Order.find().lean().populate("user").populate("cart");
  // console.log(orders.user.name)
  res.render("admin/orders", { orders: orders });
};

///////////////////////////////////////////////////////////////CHECKOUT/////////////////////////////////////////////////////
// const getCheckout = async function (req, res) {
//   if (req.session.user) {
//     let isUser = true;
//     const userId = req.session.userid;
//     const cart = await Cart.findOne({ user: userId })
//       .populate("items.product")
//       .populate("user")
//       .lean();

//     // if (cart) {
//     let totalPrice = 0;
//     for (const item of cart.items) {
//       totalPrice += item.quantity * item.product.price;
//     }
//     const order = await Order.findOne({ cart: cart._id }).lean();
//     if (order == null) {
//       res.render("user/checkout", { isUser, cart: cart, totalPrice });
//     }

//     res.render("user/checkout", { isUser, cart: cart, totalPrice, order });
//     // }
//   }
// };

const getCheckout = async function (req, res) {
  const userId = req.session.userid;
  let isUser = true;
  const user = await userHelper.getCart(userId);
  if (user.cart) {
    const totalPrice = user.totalPrice;
    const address = user.cart.address[0]
    res.render("user/checkout", { isUser, user: user, totalPrice,  address });
  }
};

const deleteProductCheckout = async function (req, res) {
  cart.deleteCartProduct(req.session.userid, req.params.id).then(() => {
    res.redirect("/checkout");
  });
};

// const postCheckout = async function (req, res) {
//   console.log(req.body.payment);
//   const userId = req.session.userid;
//   const cart = await Cart.findOne({ userId }).populate("items.product");
//   let totalPrice = 0;
  

//   try {
//     if (req.body.payment == "COD") {
//       const order = await Order.create({
//         userid: req.session.userid,
//         shippingAddress: {
//           houseName: req.body.houseName,
//           city: req.body.city,
//           pincode: req.body.pincode,
//         },
//         phone: req.body.phone,
//         status: "placed",
//         totalPrice: totalPrice,
//         paymentType: req.body.payment,
//         user: userId,
//       });

//       res.json({ COD: true, order });
//     } else {
//       const order = await Order.create({
//         cart: cart._id,
//         shippingAddress: {
//           houseName: req.body.houseName,
//           city: req.body.city,
//           pincode: req.body.pincode,
//         },
//         phone: req.body.phone,
//         status: "pending",
//         totalPrice: totalPrice,
//         paymentType: req.body.payment,
//         user: userId,
//       });
//       orderHelper
//         .generateRazorpay(order._id, order.totalPrice)
//         .then((response) => {
//           console.log(response);
//           res.json(response);
//         });
//     }
//   } catch (error) {
//     res.json({ status: false });
//   }
//   // }
// };


const postCheckout = async function(req, res){
  try {
    const userId = req.session.userid;
    const user = await userHelper.getCart(userId)
    const cart = user.cart.cart;
    if(user){
      if(req.body.payment == 'COD'){
        const newOrder = await orderHelper.createOrder(userId, cart, req.body)
        console.log("new order",newOrder)
        res.json(newOrder)
        // console.log(newOrder.payment.paymentType)
      }
    }
  } catch (error) {
    logger.error({message: "error post checkout", error})
  }
}

const verifyPayment = async function (req, res) {
  console.log(req.body);
  const paymentId = req.body["payment[razorpay_payment_id]"];
  const orderId = req.body["payment[razorpay_order_id]"];
  const signature = req.body["payment[razorpay_signature]"];

  console.log(paymentId);
  console.log(orderId);
  console.log(signature);
  console.log(process.env.KEY_SECRET);

  let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
  hmac.update(paymentId + "|" + orderId);
  const generatedSignature = hmac.digest("hex");
  console.log(generatedSignature);

  if (generatedSignature == signature) {
    try {
      const orderIdToUpdate = req.body["order[receipt]"];
      const updatedOrder = await Order.findByIdAndUpdate(
        orderIdToUpdate,
        { status: "placed" },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ status: "Order not found" });
      }

      console.log("Payment successful");
      console.log(updatedOrder);
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

module.exports = {
  // addToCart,

  getCheckout,
  deleteProductCheckout,
  postCheckout,
  verifyPayment,
  adminOrders,
};
