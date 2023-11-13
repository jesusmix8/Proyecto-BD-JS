const {Pool} = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    //password: "admin",
    password: "EsdrasUn698",
    //database: "Banco",
    database: "banco",
    port: "5432"
});

module.exports = pool;