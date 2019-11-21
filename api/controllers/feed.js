const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config');

exports.get_feed = (req, res, next) => {
    
    pool.query('SELECT article_id AS id, created_on AS createdOn, title AS title, article AS articleurl, user_id AS authorId FROM articles UNION SELECT gif_id AS id, created_on AS createdOn, title AS title, image_url as articleurl, user_id as authorId FROM gifs ORDER BY createdOn DESC', (error, result) => {
        if(error) {
            throw error;
        } 

        res.status(200).json(
            result.rows
        )
    });

};

