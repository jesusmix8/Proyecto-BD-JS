const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "admin",
  database: "bancop",
  port: "5432",
});


module.exports = pool;
