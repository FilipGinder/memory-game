const { createPool } = require('mysql');
const pool = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database: "igra_memorije",
    connectionLimit: 10
});

exports.pool = pool;