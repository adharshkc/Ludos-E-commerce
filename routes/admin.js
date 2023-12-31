const express = require("express");
const { getUsers, editUser, deleteUser, admin } = require("../controller/admin");
const {checkAuth, checkAdmin} = require("../middlewares/auth")


const router = express.Router();

router.get("/admin", checkAdmin, admin);
router.get("/admin/users",checkAdmin, getUsers);
router.put("/admin_panel/user_management/edit_user/:id",checkAdmin, editUser);
router.delete("/admin_panel/user_management/delete_user/:id",checkAdmin, deleteUser);
// router.get("/addToCart/:id", checkAuth, addToCart);
module.exports = router;
