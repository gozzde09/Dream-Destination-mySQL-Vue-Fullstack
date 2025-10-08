const mysql = require("mysql");
require("dotenv").config();

const connectionMySQL = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

connectionMySQL.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("MySQL connection successful!");
});

module.exports = connectionMySQL;
