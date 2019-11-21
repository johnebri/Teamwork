const bcrypt = require('bcryptjs');

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teamwork',
    password: '12345678',
    port: 5432,
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
                    pool.query('INSERT INTO users (first_name, last_name, email, password, gender, job_role, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [firstName, lastName, email, hash, gender, jobRole, department, address], (error, result) => {
                        if(error) {
                            throw error;
                        } 
                        
                        return res.status(200).json({
                            status: "success", 
                            data : {
                                message: "User account successfully created",
                                token : "String",
                                userId : result.insertedId
                            }
                        })
                    })
                }
            });
        }
        
    }) 

};