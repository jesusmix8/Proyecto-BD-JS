const {Pool} = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "BasesDeDatos",
    database: "Banco",
    port: "5432"
});

module.exports = pool;