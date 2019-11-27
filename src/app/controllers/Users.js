const moment = require('moment');
const uuidv4 = require('uuid/v4');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Helper = require('./Helper');


module.exports = {
  /**
   * Create A Reflection
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */

 
   
  async create(req, res) {
  
    const { firstName, lastName, email, password, gender, jobRole, department, address } = req.body;          

    // check if user already exist
    const checktext = 'SELECT * FROM  users WHERE email = $1';
    try {
        const { rows, rowCount } = await db.query(checktext, [email]);
        if (rowCount > 0) {
            // user found
            return res.status(401).json({
                message : "An account already exist with the email address you provided"
            })
        } 
    } catch (error) {
        return res.status(404).send(error);
    } 

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await Helper.hashPassword(password, salt);   

    const text = `INSERT INTO
      users(first_name, last_name, email, password, gender, job_role, department, address)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      returning *`;
    const values = [
      firstName,
      lastName,
      email,
      hashedPassword,
      gender,
      jobRole, 
      department, 
      address
    ];

    try {
      const { rows } = await db.query(text, values);

        // create token
        const token = jwt.sign
        (
            {
                email: email,
                userId: rows[0].user_id
            },
            "secret",
            {
                expiresIn: "5h"
            }
        );

      return res.status(201).json({
          status : "success",
          data : {
            message : "User account successfully created", 
            token : token, 
            userId : rows[0].user_id
          }
      });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get A Reflection
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object
   */
  async signin(req, res) {

    const { email, password } = req.body;

    // check email
    // check if user already exist
    const checktext = 'SELECT * FROM  users WHERE email = $1';
    try {
        const { rows, rowCount } = await db.query(checktext, [email]);
        if (rowCount > 0) {
            // user found
            // compare the password
            const compareRes = Helper.comparePassword(rows[0].password, password);
            if(compareRes) {
                // create token
                const token = jwt.sign
                (
                    {
                        email: email,
                        userId: rows[0].user_id
                    },
                    "secret",
                    {
                        expiresIn: "5h"
                    }
                );
                return res.status(200).json({
                    message : "success",
                    data: {
                        token : token,
                        userId: rows[0].user_id
                    }
                })
            } else {
                // password failed
                return res.status(404).json({
                    message : 'Incorrect Username or password'
                })
            }
            
        } else {
            // email failed
            return res.status(404).json({
                message : 'Incorrect Username or password'
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    } 
  }
}

// export default Reflection;
// module.exports = new Reflection();