const Pool = require('pg').Pool

// const pool = new Pool({
//     user: process.env.USER,
//     host: process.env.HOST,
//     database: process.env.DB,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// })


const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DB}`

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
})

module.exports = { pool }