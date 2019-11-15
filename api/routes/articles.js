const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ArticlesController = require('../controllers/articles');

router.post('/', checkAuth, ArticlesController.create_article);
router.patch('/:id', checkAuth, ArticlesController.edit_article);
router.delete('/:id', checkAuth, ArticlesController.delete_article);

module.exports = router;