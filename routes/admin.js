const express = require('express');

const router = express.Router()

router.get('/admin_panel');
router.get('/admin_panel/user_management')
router.put('/admin_panel/user_management/edit_user/:id')
router.delete('/admin_panel/user_management/delete_user/:id')

module.exports = router;