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
} = require("../controller/user");
const { cart } = require("../controller/order");

const router = express.Router();

router.get("/", home);
router.get("/login", userLogin);
router.post("/user_signin", user_signin);
router.get("/register", userRegister);
router.post("/user_registration", user_registration);
router.get("/add_cart");
router.get("/cart", cart);
router.get("/checkout");
router.post("/user_account");
router.get("/user_profile", user_dashboard);
router.get("/user_edit_profile", user_profile_edit)
router.get("/user_edit_address", editAddress)
router.get("/user_checkout", checkout)
router.get("/logout", logout);

module.exports = router;
