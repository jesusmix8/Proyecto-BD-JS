const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "Yeiglo20",
  database: "Banco",
  port: "5432",
});

module.exports = pool;
