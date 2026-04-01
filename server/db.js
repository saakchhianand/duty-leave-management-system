const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

// Create a pool of connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the promise-based version for cleaner code (async/await)
module.exports = pool.promise();