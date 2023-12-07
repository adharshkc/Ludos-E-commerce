const express = require("express");
const {userLogin, user_signin} = require('../controller/user')


const router = express.Router();

router.get("/login", userLogin);
router.post("/user_signin", user_signin);
router.post("/register");
router.post("/user_registration");
router.get("/add_cart");
router.get("/cart");
router.get("/checkout");
router.post("/user_account");
router.get("/logout");

module.exports = router;
