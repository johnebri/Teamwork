const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const FeedController = require('../controllers/feed');

router.get('/', checkAuth, FeedController.get_feed);

module.exports = router;