const express = require("express");
const {userLogin, user_signin, user_registration, userRegister, home} = require('../controller/user')


const router = express.Router();

router.get('/', home)
router.get("/login", userLogin);
router.post("/user_signin", user_signin);
router.get("/register", userRegister);
router.post("/user_registration", user_registration);
router.get("/add_cart");
router.get("/cart");
router.get("/checkout");
router.post("/user_account");
router.get("/logout");

module.exports = router;
