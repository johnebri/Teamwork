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

    const text = `INSERT INTO articles(user_id, title, article, created_on)
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [
      req.userData.userId,
      title,
      article,
      moment(new Date())
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
  }
}

// export default Reflection;
// module.exports = new Reflection();