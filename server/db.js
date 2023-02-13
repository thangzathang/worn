// db.js is where we will connect to our local Postgres database.
require("dotenv").config("./env");
const Pool = require("pg").Pool;

// console.log("process.env:", process.env);

const pool = new Pool({
  // User, password, host, port, datasbase
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  Database: process.env.PG_DATABASE,
});

module.exports = pool;
