const mysql = require('mysql2');
require('dotenv').config();


// connection to db
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'employee_manager_db'
    },
);

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the employee_manager_db');
    startPrompt();
});

module.exports = db;