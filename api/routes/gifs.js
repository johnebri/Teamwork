const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({

    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
    
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/gif') {
        cb(null, true); // accepts the file
    } else {
        cb(null, false); // ignores the file
    }   
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 10 // file limit of 10MB
    },
    fileFilter: fileFilter
});

const GifsController = require('../controllers/gifs');

router.post('/', checkAuth, upload.single('GifImage'), GifsController.create_gif);
router.delete('/:id', checkAuth, GifsController.delete_gif);
router.post('/:id/comment', checkAuth, GifsController.comment_on_gif);
router.get('/:id', checkAuth, GifsController.get_gif);

module.exports = router;