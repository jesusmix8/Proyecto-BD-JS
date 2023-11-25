const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "51e06101D61@23",
  database: "banco_v2",
  port: "5432",
});

module.exports = pool;