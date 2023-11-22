const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "0000",
  database: "banco",
  port: "5432",
});

module.exports = pool;
