const moment = require('moment');
const uuidv4 = require('uuid/v4');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Helper = require('./Helper');
const cloudinary = require('cloudinary').v2;

// set your env variable CLOUDINARY_URL or set the following configuration
cloudinary.config({
    cloud_name: 'dxi6ee9zf',
    api_key: '698928915214427',
    api_secret: 'V1XPw_1Jqw6qR1Qy_ch8NKdxd44'
});

module.exports = {
  /**
   * Create a Gif
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object 
   */

  async create_gif(req, res) {
  
    const { title } = req.body;
   
    const image = await Helper.uploadToCloudinary(req.file.path); 

    const createGifQuery = `INSERT INTO gifs(user_id, title, image_url, created_on, type)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      req.userData.userId,
      title,
      image.url,
      moment(new Date()),
      'gif'
    ];

    try {
      const { rows, rowCount } =  await db.query(createGifQuery, values);
    
      if(rowCount > 0) {
          // created
          return res.status(201).json({
            status : "success",
            data : {
              gitId : rows[0].gif_id,
              message : "GIF image successfully posted",
              createdOn : rows[0].created_on,
              title : title,
              imageUrl : image.url
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
   * Delete A Gif
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async delete_gif(req, res) {

    const gifId = parseInt(req.params.id);

    // check if article exists
    const findOneQuery = 'SELECT * FROM  gifs WHERE gif_id = $1';
    try {
        const { rowCount } = await db.query(findOneQuery, [gifId]);
        if (rowCount > 0) {
            // gif exists
            
            const deleteQuery = 'DELETE FROM gifs WHERE gif_id = $1 returning *';
            try {
                const { rows, rowCount } = await db.query(deleteQuery, [gifId]);
                if(rowCount > 0) {
                    // article deleted
                    return res.status(404).json({
                        status : "success",
                        data : { 
                            message : 'Gif Post successfully deleted'
                        }
                    })
                } else {
                    // delete failed
                    return res.status(404).json({
                        message : 'You do not have the permission to deleted selected gif post'
                    })
                }
            } catch(error) {
                return res.status(400).send(error);
            }

        } else {
            // article does not exist
            return res.status(404).json({
                message : 'Gif post does not exist'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    }
    
  }, 
   /**
   * Comment on an Gif
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  async comment_on_gif(req, res) {

    const gifId = parseInt(req.params.id);
    const { comment } = req.body;

    // check if gif exists
    const findOneQuery = 'SELECT * FROM  gifs WHERE gif_id = $1';

    try {
        const { rows, rowCount } = await db.query(findOneQuery, [gifId]);
        if (rowCount > 0) {
            // gif exists

            const commentQuery = `INSERT INTO gif_comments(gif_id, user_id, comment, comment_date) VALUES($1, $2, $3, $4) returning *`;
            const values = [
                gifId,
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
                            comment : comment
                        }
                    })
                } else {
                    // comment failed
                    return res.status(404).json({
                        message : 'You do not have the permission to deleted selected gif post'
                    })
                }
            } catch(error) {
                return res.status(400).send(error);
            }

        } else {
            // article does not exist
            return res.status(404).json({
                message : 'Gif post does not exist'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    }
    
  },
  /**
   * Get a gif post
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object
   */
  async get_gif(req, res) {

    const gifId = parseInt(req.params.id);

    let createdOn = ""; 
    let title = ""; 
    let url = ""; 

    // check if user article exists
    const checktext = 'SELECT * FROM gifs WHERE gif_id = $1';
    try {
        const { rows, rowCount } = await db.query(checktext, [gifId]);
        if (rowCount > 0) {
            // gif exists

            createdOn = rows[0].created_on;
            title = rows[0].title;
            url = rows[0].image_url;

            // get article comments
            const gifCommentsQuery = 'SELECT comment_id AS commentId, comment, user_id AS authorId FROM gif_comments WHERE gif_id = $1 ORDER BY comment_date DESC';
            try {
                const { rows, rowCount } = await db.query(gifCommentsQuery, [gifId]);
                
                return res.status(200).json({
                    status : "success",
                    data : {
                        id : gifId,
                        createdOn : createdOn,
                        title : title,
                        url : url,
                        comment : rows
                    }
                })
               
            } catch(error) {
                return res.status(404).send(error);
            }          
            
        } else {
            // article does not exist
            return res.status(404).json({
                message : 'Gif post does not exist'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    } 
  }, 

  async get_all_gifs(req, res) {

    const allGifsQuery = 'SELECT * from gifs';
    try {
        const { rows, rowCount } = await db.query(allGifsQuery);
        if (rowCount > 0) {
            // got feed                      
            return res.status(200).json({
                result : rows
            })

        } else {
            // feed not found
            return res.status(404).json({
                message : 'No Gif found'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    } 
  }

}

// export default Reflection;
// module.exports = new Reflection();