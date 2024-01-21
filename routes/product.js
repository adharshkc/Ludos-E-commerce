const express = require("express");
const {
  addProduct,
  editProduct,
  edit_product,
  showProduct,
  deleteProduct,
  singleProduct,
  getAddProduct,
  adminProduct,
  searchProduct,
} = require("../controller/product");
const { checkAuth, checkAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/products", showProduct);
router.get("/product/:id", singleProduct)
router.post("/user/search", searchProduct)
router.get("/admin/addProduct",checkAdmin, getAddProduct);
router.post("/admin/add_product",checkAdmin, addProduct);
router.get("/admin/editProduct/:id", checkAdmin, edit_product)
router.post("/admin/edit_product/:id",checkAdmin, editProduct);
router.get("/admin/deleteProduct/:id", checkAdmin, deleteProduct)
router.get("/admin/products",checkAdmin, adminProduct );

module.exports = router;
