const express = require("express");
const {
  getCheckout,
  deleteProductCheckout,
  postCheckout,
  verifyPayment,
  adminOrders,
  success,
  failed,
  orders,
  postCoupon,
  singleOrder,
  deleteOrder
} = require("../controller/order");
const { checkAuth, checkAdmin } = require("../middlewares/auth");


const router = express.Router();

router.get("/admin_panel/orders");
router.put("/admin_panel/orders/edit/:id");
router.get("/admin/orders/delete/:id", checkAdmin, deleteOrder);
router.get("/checkout", checkAuth, getCheckout);
router.get("/deleteProductCheckout/:id", checkAuth, deleteProductCheckout);
router.post("/postCheckout", checkAuth, postCheckout);
router.post("/verifyPayment", checkAuth, verifyPayment);
router.get("/user/success", checkAuth, success)
router.get("/user/failed", checkAuth, failed)
router.post("/user/applyCoupon", checkAuth, postCoupon)
router.get("/admin/orders", checkAdmin,adminOrders)
router.get("/orders", checkAuth, orders)
router.get("/user/order/:id", checkAuth, singleOrder)

module.exports = router;
