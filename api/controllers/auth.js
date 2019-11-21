const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

exports.admin_create_user = (req, res, next) => {

    const {firstName, lastName, email, password, gender, jobRole, department, address } = req.body;

    // check if email address is registered
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        if (error) {
            throw error;
        } 
        
        if(result.rows.length > 0) {
            // email is taken
            return res.status(200).json({
                message : "An account already exist with the email address you provided" 
            });
        } else {
            // email is available
            // hash the password
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(409).json({
                        message : err
                    })
                } else {
                    pool.query('INSERT INTO users (first_name, last_name, email, password, gender, job_role, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id, email', [firstName, lastName, email, hash, gender, jobRole, department, address], (error, result) => {
                        if(error) {
                            throw error;
                        } 

                        const token = jwt.sign
                        (
                            {
                                email: result.rows[0].email,
                                userId: result.rows[0].user_id
                            }, 
                            process.env.JWT_KEY, 
                            {
                                expiresIn: "1h"
                            }
                        );  
                        
                        return res.status(200).json({
                            status: "success", 
                            data : {
                                message: "User account successfully created",
                                token : token,
                                userId : result.rows[0].user_id
                            }
                        })
                    })
                }
            });
        }
        
    }) 

};


exports.signin = (req, res, next) => {
    const {email, password } = req.body;

    // check email
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        if(error) {
            throw error;
        }

        if (result.rows.length > 0 ) {
            // found a user with email address entered
            // compare the password
            bcrypt.compare(password, result.rows[0].password, (err, results) => {
                if (err) {
                    return res.status(401).json({
                        message : "Incorrect Username or Password"
                    });
                }
                if(results) {
                    const token = jwt.sign
                    (
                        {
                            email: result.rows[0].email,
                            userId: result.rows[0].user_id
                        }, 
                        process.env.JWT_KEY, 
                        {
                            expiresIn: "1h"
                        }
                    ); 
                    return res.status(200).json({
                        message: 'Success',
                        data: {
                            token: token,
                            userId: result.rows[0].user_id
                        }
                    }) 
                }
                res.status(404).json({
                    message: "Incorrect username or password"
                })
            });

        } else { 
            // no user found with email address
            return res.status(400).json({
                message : "Incorrect username or password"
            });
        }
    });

};