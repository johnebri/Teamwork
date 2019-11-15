const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// set your env variable CLOUDINARY_URL or set the following configuration
cloudinary.config({
  cloud_name: 'dxi6ee9zf',
  api_key: '698928915214427',
  api_secret: 'V1XPw_1Jqw6qR1Qy_ch8NKdxd44'
});

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

exports.create_gif = (req, res, next) => {

    cloudinary.uploader.upload(req.file.path, { tags: 'basic_sample' })
    .then(function (image) {
        console.log();
        console.log("** File Upload (Promise)");
        console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
        console.log("* " + image.public_id);
        console.log("* " + image.url);

        // insert into db
        pool.query('INSERT INTO gifs (user_id, title, image_url, created_on) VALUES ($1, $2, $3, now()) RETURNING gif_id', [req.userData.userId, req.body.title, image.url], (error, result) => {
            if(error) {
                throw error;
            }

            return res.status(200).json({
                message: "success",
                data : {
                    gifId : result.rows[0].gif_id,
                    message : "GIF image successfully posted",
                    createdOn : new Date(),
                    title : req.body.title,
                    imageUrl: image.url
                }
            });
        });

      
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