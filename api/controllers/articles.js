const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

exports.create_article = (req, res, next) => {
    
    const {title, article } = req.body;

    pool.query('INSERT INTO articles (user_id, title, article, created_on) VALUES($1, $2, $3, now()) RETURNING article_id, title, article', [req.userData.userId, title, article], (error, result) => {
        
        if (error) {
            throw error;
        }

        return res.status(200).json({
            status: 'success',
            data : {
                message : "Article successfully posted",
                articleId : result.rows[0].article_id,
                createdOn : new Date(),
                title : result.rows[0].title
            }
        })       

    });
};

exports.edit_article = (req, res, next) => {

    const articleId = parseInt(req.params.id);
    const {title, article } = req.body;

    // check if article exists
    pool.query('SELECT * FROM articles WHERE article_id = $1', [articleId], (error, result) => {

        if (error) {
            throw error;
        }

        if(result.rows.length > 0) {
            // update article
            pool.query('UPDATE articles SET title = $1, article = $2 WHERE article_id = $3 AND user_id = $4', [title, article, articleId, req.userData.userId], (error, result) => {

                if (error) {
                    throw error;
                }
        
                return res.status(200).json({
                    status : 'success',
                    data : {
                        message : "Article successfully updated",
                        title : title,
                        article : article

                    }
                });
        
            });
        } else {
            // article not found
            return res.status(404).json({
                message : 'Article does not exist'
            });
        }

    });
};

exports.delete_article = (req, res, next) => {

    const articleId = parseInt(req.params.id);

    // check if article exists
    pool.query('SELECT * FROM articles WHERE article_id = $1', [articleId], (error, result) => {

        if (error) {
            throw error;
        }

        if(result.rows.length > 0) {
            // delete article

            pool.query('DELETE FROM articles WHERE article_id = $1 AND user_id = $2', [articleId, req.userData.userId], (error, result) => {

                if (error) {
                    throw error;
                }

                return res.status(200).json({
                    status : 'success',
                    data : {
                        message : "Article successfully deleted"
                    }
                });

            });

        } else {
            // article not found
            return res.status(404).json({
                message : 'Article does not exist'
            });
        }

    });
};

