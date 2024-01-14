const express = require("express");
const {
  getUsers,
//   edit_user,
//   editUser,
  deleteUser,
  admin,
  getAddCoupon,
  addCoupon,
} = require("../controller/admin");
const { checkAuth, checkAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/admin", checkAdmin, admin);
router.get("/admin/users", checkAdmin, getUsers);
router.get("/admin/addCoupon", checkAdmin, getAddCoupon);
router.post("/admin/PostAddCoupon", checkAdmin, addCoupon);
// router.get("admin/user/edit/:id", checkAdmin, edit_user);
// router.post("/admin/editUser/:id", checkAdmin, editUser);
router.get(
  "/admin/delete_user/:id",
  checkAdmin,
  deleteUser
);
// router.get("/addToCart/:id", checkAuth, addToCart);
module.exports = router;
