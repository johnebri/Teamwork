const moment = require('moment');
const uuidv4 = require('uuid/v4');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Helper = require('./Helper');


module.exports = {
  /**
   * Create an Article
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object 
   */

  async create_article(req, res) {
  
    const { title, article } = req.body;  

    const text = `INSERT INTO articles(user_id, title, article, created_on, type)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      req.userData.userId,
      title,
      article,
      moment(new Date()),
      "article"
    ];

    try {
      const { rows, rowCount } = await db.query(text, values);
    
      if(rowCount > 0) {
          // created
          return res.status(201).json({
            status : "success",
            data : {
              message : "Article successfully posted",
              articleId: rows[0].article_id,
              createdOn: moment(new Date()),
              title: title
            }
        });
      } else {
          // failed
          return res.status(201).json({
            status : "Failed",
            data : {
              message : "Failed, Please try again"
            }
        });
      }
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Edit an article
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object
   */
  async edit_article(req, res) {

    const articleId = parseInt(req.params.id);
    const { title, article } = req.body;

    // check if user article exists
    const checktext = 'SELECT * FROM  articles WHERE article_id = $1';
    try {
        const { rowCount } = await db.query(checktext, [articleId]);
        if (rowCount > 0) {
            // article exists

            const updateOneQuery =`UPDATE articles
              SET title=$1,article=$2 WHERE article_id=$3 AND user_id=$4 returning *`;
            try {

                const values = [
                    title,
                    article,
                    articleId,
                    req.userData.userId
                ];
                
                const { rows, rowCount } = await db.query(updateOneQuery, values);
                if(rowCount > 0) {
                    // article updated
                    return res.status(200).json({
                        status : "success",
                        data : {
                            message : 'Article successfully updated',
                            title : title, 
                            article: article
                        }
                        
                    })
                } else {
                    // update failed
                    return res.status(404).json({
                        message : 'You do not have the permission to edit selected article'
                    })
                }

            } catch(error) {
                return res.status(400).send(error);
            }
            
        } else {
            // article does not exist
            return res.status(404).json({
                message : 'Article does not exist'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    } 
  },
  /**
   * Delete A Reflection
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async delete_article(req, res) {

    const articleId = parseInt(req.params.id);

    // check if article exists
    const findOneQuery = 'SELECT * FROM  articles WHERE article_id = $1';
    try {
        const { rowCount } = await db.query(findOneQuery, [articleId]);
        if (rowCount > 0) {
            // article exists
            
            const deleteQuery = 'DELETE FROM articles WHERE article_id=$1 returning *';
            try {
                const { rows, rowCount } = await db.query(deleteQuery, [articleId]);
                if(rowCount > 0) {
                    // article deleted
                    return res.status(404).json({
                        status : "success",
                        data : { 
                            message : 'Article successfully deleted'
                        }
                    })
                } else {
                    // delete failed
                    return res.status(404).json({
                        message : 'You do not have the permission to deleted selected article'
                    })
                }
            } catch(error) {
                return res.status(400).send(error);
            }

        } else {
            // article does not exist
            return res.status(404).json({
                message : 'Article does not exist'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    }
    
  }, 
   /**
   * Comment on an Article
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async comment_on_article(req, res) {

    const articleId = parseInt(req.params.id);
    const { comment } = req.body;
    let article = "";

    // check if article exists
    const findOneQuery = 'SELECT * FROM  articles WHERE article_id = $1';

    try {
        const { rows, rowCount } = await db.query(findOneQuery, [articleId]);
        if (rowCount > 0) {
            // article exists
            article = rows[0].article;

            const commentQuery = `INSERT INTO article_comments(article_id, user_id, comment, comment_date) VALUES($1, $2, $3, $4) returning *`;
            const values = [
                articleId,
                req.userData.userId,
                comment,
                moment(new Date())
            ];

            try {
                const { rows, rowCount } = await db.query(commentQuery, values);
                
                if(rowCount > 0) {
                    // comment added
                    return res.status(200).json({
                        status : "success",
                        data : { 
                            message : 'Comment successfully created',
                            createdOn : rows[0].comment_date,
                            article: article,
                            comment : comment
                        }
                    })
                } else {
                    // comment failed
                    return res.status(404).json({
                        message : 'You do not have the permission to deleted selected article'
                    })
                }
            } catch(error) {
                return res.status(400).send(error);
            }

        } else {
            // article does not exist
            return res.status(404).json({
                message : 'Article does not exist'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    }
    
  },
  /**
   * Get an article
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object
   */
  async get_article(req, res) {

    const articleId = parseInt(req.params.id);


    let createdOn = ""; 
    let title = ""; 
    let article = ""; 

    // check if user article exists
    const checktext = 'SELECT * FROM  articles WHERE article_id = $1';
    try {
        const { rows, rowCount } = await db.query(checktext, [articleId]);
        if (rowCount > 0) {
            // article exists


            createdOn = rows[0].created_on;
            title = rows[0].title;
            article = rows[0].article;

            // get article comments
            const articleCommentsQuery = 'SELECT comment_id AS commentId, comment, user_id AS authorId FROM article_comments WHERE article_id = $1 ORDER BY comment_date DESC';
            try {
                const { rows, rowCount } = await db.query(articleCommentsQuery, [articleId]);
                
                return res.status(200).json({
                    status : "success",
                    data : {
                        id : articleId,
                        createdOn : createdOn,
                        title : title,
                        article : article,
                        comment : rows
                    }
                })
             
            } catch(error) {
                return res.status(404).send(error);
            }          
            
        } else {
            // article does not exist
            return res.status(404).json({
                message : 'Article does not exist'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    } 
  },

  async get_all_articles(req, res) {
    // get user id
    const userId = req.userData.userId;

    const allArticlesQuery = 'SELECT * from articles WHERE user_id = $1';
    try {
        const { rows, rowCount } = await db.query(allArticlesQuery, [userId]);
        if (rowCount > 0) {
            // got feed                      
            return res.status(200).json({
                result : rows,
                status: 200
            })

        } else {
            // feed not found
            return res.status(404).json({
                result : 'No Article found',
                status: 400
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    } 
  }

}

// export default Reflection;
// module.exports = new Reflection();