const db = require('../db');

module.exports = {
  /**
   * Get a gif post
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object
   */
  async get_feed(req, res) {

    // check if user article exists
    const feedQuery = 'SELECT article_id AS id, created_on AS createdOn, title AS title, article AS articleurl, user_id AS authorId FROM articles UNION SELECT gif_id AS id, created_on AS createdOn, title AS title, image_url as articleurl, user_id as authorId FROM gifs ORDER BY createdOn DESC';
    try {
        const { rows, rowCount } = await db.query(feedQuery);
        if (rowCount > 0) {
            // got feed                      
            return res.status(200).json({
                result : rows
            })

        } else {
            // feed not found
            return res.status(404).json({
                message : 'No Feed found'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    } 
  }

}

// export default Reflection;
// module.exports = new Reflection();