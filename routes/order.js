const express = require("express");
const { addToCart, getCart, addProductToCart, deleteCart, updateCart, getCheckout, deleteProductCheckout, postCheckout } = require("../controller/order");
const { checkAuth } = require("../middlewares/auth");
// const { deleteCartProduct } = require("../helpers/cart");

const router = express.Router();

router.get("/admin_panel/orders");
router.put("/admin_panel/orders/edit/:id");
router.delete("/admin_panel/orders/delete_orders/:id");
router.get("/addToCart/:id", checkAuth, addToCart);
router.get("/addProductToCart/:id", checkAuth, addProductToCart)
router.get("/deleteCartProduct/:id", checkAuth, deleteCart )
router.post("/updateCart", checkAuth, updateCart)
router.get("/cart", checkAuth, getCart)
router.get("/checkout", checkAuth, getCheckout)
router.get("/deleteProductCheckout/:id", checkAuth, deleteProductCheckout)
router.post("/postCheckout", checkAuth, postCheckout)

module.exports = router;
