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
  edit_address,
  addToCart,
  addProductToCart,
  cart,
  updateCart,
  deleteCart,
  userAccount,
  editUser,
  add_address,
  addAddress,
  editAddress,
  delete_address,
  googleLogin,
  callbackUrl,
  invoice,
} = require("../controller/user");
// const { cart } = require("../controller/order");
const { checkAuth } = require("../middlewares/auth");
const passport = require("passport");

const router = express.Router();

router.get("/", home);
router.get("/login", userLogin);
router.post("/user_signin", user_signin);
router.get("/register", userRegister);
router.post("/user_registration", user_registration);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  callbackUrl
);
router.get("/add_cart");
router.get("/cart", checkAuth, cart);
router.get("/addToCart/:id", checkAuth, addToCart);
router.get("/addProductToCart/:id", checkAuth, addProductToCart);
router.post("/updateCart", checkAuth, updateCart);
router.get("/deleteCartProduct/:id", checkAuth, deleteCart);
router.get("/user/profile", checkAuth, user_dashboard);
router.get("/user/edit_profile", checkAuth, user_profile_edit);
router.post("/user/editUser", checkAuth, editUser);
router.get("/user/add_address", checkAuth, add_address);
router.post("/user/addAddress", checkAuth, addAddress);
router.get("/user/edit_address/:id", checkAuth, edit_address);
router.post("/user/editAddress/:id", checkAuth, editAddress);
router.get("/user/delete_address/:id", delete_address);
router.get("/user/invoice/:id", checkAuth, invoice);
router.get("/logout", logout);

module.exports = router;
