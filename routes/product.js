const express = require("express");
const {
  addProduct,
  editProduct,
  showProduct,
  deleteProduct,
  singleProduct,
} = require("../controller/product");

const router = express.Router();

router.get("/products", showProduct);
router.get("/products/single/:id", singleProduct)
router.get("/admin_panel/products/add_product");
router.post("/admin_panel/products/add_product", addProduct);
router.put("/admin_panel/products/edit/:id", editProduct);
router.delete("/admin_panel/products/delete/:id",deleteProduct)
router.get("/view");

module.exports = router;
