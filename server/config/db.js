const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,

    ssl: {
        ca: fs.readFileSync(
            path.join(__dirname, "../certificates/ca.pem")
        )
    }
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("❌ Database Connection Failed");
        console.log(err.message);
        return;
    }

    console.log("✅ MySQL Connected");

    connection.release();
});

module.exports = pool.promise();