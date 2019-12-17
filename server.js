const express = require('express');
const dotenv = require('dotenv');
const babelpolyfill = require('babel-polyfill');
const checkAuth = require('./middleware/check-auth');

const multer = require('multer');

const Users = require('./src/app/controllers/Users');
const Articles = require('./src/app/controllers/Articles');
const Gifs = require('./src/app/controllers/Gifs');
const Feed = require('./src/app/controllers/Feed');

dotenv.config();

const app = express();
app.use(express.json())


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});



app.get('/', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/9082520/SW7gTQ9n');
})

const port = process.env.PORT || 3000;

app.listen(port)
console.log('app running on port ', port);


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

app.post('/api/v1/auth/create-user', checkAuth, Users.create);
app.post('/api/v1/auth/signin', Users.signin);

app.post('/api/v1/articles', checkAuth, Articles.create_article);
app.patch('/api/v1/articles/:id', checkAuth, Articles.edit_article);
app.delete('/api/v1/articles/:id', checkAuth, Articles.delete_article);
app.post('/api/v1/articles/:id/comment', checkAuth, Articles.comment_on_article);
app.get('/api/v1/articles/:id', checkAuth, Articles.get_article);
app.get('/api/v1/articles', checkAuth, Articles.get_all_articles);

app.post('/api/v1/gifs', checkAuth, upload.single('GifImage'), Gifs.create_gif);
app.delete('/api/v1/gifs/:id', checkAuth, Gifs.delete_gif);
app.post('/api/v1/gifs/:id/comment', checkAuth, Gifs.comment_on_gif);
app.get('/api/v1/gifs/:id', checkAuth, Gifs.get_gif);

app.get('/api/v1/feed', checkAuth, Feed.get_feed);

module.exports = app;