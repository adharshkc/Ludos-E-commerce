const express = require("express");
const { addToCart, getCart } = require("../controller/order");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/admin_panel/orders");
router.put("/admin_panel/orders/edit/:id");
router.delete("/admin_panel/orders/delete_orders/:id");
router.get("/addToCart/:id", checkAuth, addToCart);
router.get("/cart", checkAuth, getCart)

module.exports = router;
