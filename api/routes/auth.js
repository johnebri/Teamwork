const express = require("express");
const router = express.Router();

const AuthController = require('../controllers/auth');

// admins/auth/create-user
router.post('/create-user', AuthController.admin_create_user);
router.post('/signin', AuthController.signin);

module.exports = router;