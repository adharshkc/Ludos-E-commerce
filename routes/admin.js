const express = require("express");
const {
  getUsers,
  deleteUser,
  admin,
  getAddCoupon,
  addCoupon,
} = require("../controller/admin");

const {searchProduct} = require('../controller/product')
const { checkAuth, checkAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/admin", checkAdmin, admin);
router.get("/admin/users", checkAdmin, getUsers);
router.get("/admin/addCoupon", checkAdmin, getAddCoupon);
router.post("/admin/PostAddCoupon", checkAdmin, addCoupon);
router.get("/admin/searchProduct", checkAdmin, searchProduct);
router.get("/admin/delete_user/:id", checkAdmin, deleteUser);
module.exports = router;
