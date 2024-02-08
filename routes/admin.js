const express = require("express");
const {
  getUsers,
  deleteUser,
  admin,
  getAddCoupon,
  addCoupon,
  updateOrder,
  // shipped,
  // delivered,
  filterOrder,
  filterType,
  filterDate,
  // cancelled
} = require("../controller/admin");

const { searchProduct } = require("../controller/product");
const { checkAuth, checkAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/admin", checkAdmin, admin);
router.get("/admin/users", checkAdmin, getUsers);
router.get("/admin/addCoupon", checkAdmin, getAddCoupon);
router.post("/admin/PostAddCoupon", checkAdmin, addCoupon);
router.get("/admin/searchProduct", checkAdmin, searchProduct);
router.put("/admin/delete_user/:id", checkAdmin, deleteUser);
router.put("/admin/update-order", checkAdmin, updateOrder);
router.get("/admin/filter/", checkAdmin, filterOrder);
router.get("/admin/filter/:type", checkAdmin, filterType);
router.get("/admin/filterDate/:date", checkAdmin, filterDate)
module.exports = router;
