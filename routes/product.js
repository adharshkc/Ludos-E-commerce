const express = require("express");
const {
  addProduct,
  editProduct,
  showProduct,
  deleteProduct,
  singleProduct,
  getAddProduct,
  postProduct,
  adminProduct,
} = require("../controller/product");
const { checkAuth, checkAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/products", showProduct);
router.get("/product/:id", singleProduct)
router.get("/admin/addProduct",checkAdmin, getAddProduct);
// router.post("/postProduct/:id",checkAuth, postProduct)
router.post("/admin_panel/products/add_product",checkAdmin, addProduct);
router.put("/admin_panel/products/edit/:id",checkAdmin, editProduct);
router.delete("/admin_panel/products/delete/:id", checkAdmin, deleteProduct)
router.get("/admin/products",checkAdmin, adminProduct );

module.exports = router;
