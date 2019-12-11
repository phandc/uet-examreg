
const mysql = require('mysql');

//config db
const config = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    
};

const pool = mysql.createPool(config);

//check connections
pool.getConnection((err, connection) => {
    if (err) {
        console.log(err.code);
    }
    console.log('Connected!')

    if (connection) {
        connection.release()
        return
    }
})

module.exports = pool;