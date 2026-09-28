const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

async function aws() {
    try {
        let connection = await pool.getConnection();
        console.log("db connected.........")
    }
    catch (err) {
        console.log(err.message, "db not connected..........")
    }
}
aws()


module.exports = pool;