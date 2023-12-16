const express = require("express");
const {cart} = require("../controller/order")

const router = express.Router();

router.get("/admin_panel/orders");
router.put("/admin_panel/orders/edit/:id");
router.delete("/admin_panel/orders/delete_orders/:id");



router.get("/cart", cart)


module.exports = router;
