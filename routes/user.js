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
  getAddress,
  googleLogin,
  callbackUrl,
  fbCallback,
  invoice,
  wishlist,
  addWishlist,
  deleteWishlist,
  verifyEmail,
  resetPassword,
  passwordReset,
  verify
} = require("../controller/user");
const { checkAuth } = require("../middlewares/auth");
const passport = require("passport");

const router = express.Router();

router.get("/", home);
router.get("/login", userLogin);
router.post("/userLogin", user_signin);
router.get("/register", userRegister);
router.post("/user_registration", user_registration);
router.get('/verify-email', verifyEmail)
router.get('/verify', verify)
router.get('/user/resetPassword', checkAuth, resetPassword)
router.post('/reset-password', checkAuth, passwordReset)
router.get("/cart", cart);
router.get("/addToCart/:id", addToCart);
router.get("/addProductToCart/:id", addProductToCart);
router.post("/updateCart", updateCart);
router.get("/deleteCartProduct/:id", deleteCart);
router.get("/user/profile", checkAuth, user_dashboard);
router.get("/user/edit_profile", checkAuth, user_profile_edit);
router.post("/user/editUser", checkAuth, editUser);
router.get("/user/add_address", checkAuth, add_address);
router.put("/user/getAddress", checkAuth, getAddress)
router.post("/user/addAddress", checkAuth, addAddress);
router.get("/user/edit_address/:id", checkAuth, edit_address);
router.post("/user/editAddress/:id", checkAuth, editAddress);
router.get("/user/delete_address/:id", delete_address);
router.get("/user/invoice/:id", checkAuth, invoice);
router.get("/user/wishlist", checkAuth, wishlist);
router.get("/user/addWishlist/:id", checkAuth, addWishlist);
router.get("/deleteWishlistProduct/:id", checkAuth, deleteWishlist);
router.get("/logout", logout);

//google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  callbackUrl
);
//facebook authentication
router.get("/login/federated/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  fbCallback
);
module.exports = router;
