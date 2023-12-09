const express = require("express");
const { getUsers, editUser, deleteUser } = require("../controller/admin");

const router = express.Router();

router.get("/admin_panel/");
router.get("/admin_panel/user_management", getUsers);
router.put("/admin_panel/user_management/edit_user/:id", editUser);
router.delete("/admin_panel/user_management/delete_user/:id", deleteUser);

module.exports = router;
