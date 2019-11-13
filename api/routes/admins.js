const express = require("express");
const router = express.Router();

const AdminController = require('../controllers/admins');

// admins/auth/create-user
router.post('/create-user', AdminController.admin_create_user);

module.exports = router;