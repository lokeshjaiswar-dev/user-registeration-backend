const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,      
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false   
    }
});

const promisePool = pool.promise();
module.exports = promisePool;

// make changes afterwards 
// add NODE_ENV in render
// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const isProduction = process.env.NODE_ENV === 'production';

// const poolConfig = {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// };

// // Only add SSL for production (Render + Aiven)
// if (isProduction) {
//     poolConfig.ssl = {
//         rejectUnauthorized: false
//     };
// }

// const pool = mysql.createPool(poolConfig);
// const promisePool = pool.promise();
// module.exports = promisePool;