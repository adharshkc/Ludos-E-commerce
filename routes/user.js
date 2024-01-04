const express = require("express");
const {
  userLogin,
  user_signin,
  user_registration,
  userRegister,
  home,
  logout,
  user_dashboard,
  user_profile_edit,
  checkout,
  editAddress,
  cart,
  userAccount,
  editUser,
  add_address,
} = require("../controller/user");
// const { cart } = require("../controller/order");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", home);
router.get("/login", userLogin);
router.post("/user_signin", user_signin);
router.get("/register", userRegister);
router.post("/user_registration", user_registration);
router.get("/add_cart");
router.get("/cart",checkAuth, cart);
router.get("/checkout");
router.get("/user/profile", checkAuth, user_dashboard);
router.get("/user/edit_profile",checkAuth, user_profile_edit)
router.post("/user/editUser",checkAuth, editUser)
router.get("/user/add_address", checkAuth, add_address)
router.get("/user/edit_address", checkAuth, editAddress)
router.get("/user/checkout", checkout)
router.get("/logout", logout);

module.exports = router;
