const express = require('express');
const app = express(); // spins up express app
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./api/routes/auth');
const gifsRoutes = require('./api/routes/gifs');
const articlesRoutes = require('./api/routes/articles');
const feedRoutes = require('./api/routes/feed');

app.use(morgan('dev')); 
// app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET' );
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/gifs', gifsRoutes);
app.use('/api/v1/articles', articlesRoutes);
app.use('/api/v1/feed', feedRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;