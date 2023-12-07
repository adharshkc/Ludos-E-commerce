const express = require("express");

const router = express.Router();

router.get("/admin_panel/products");
router.get("/admin_panel/products/add_product");
router.post("/admin_panel/products/add_product");
router.put("/admin_panel/products/edit/:id");
router.delete("admin_panel/products/delete/:id");

router.get("/view");

module.exports = router;
