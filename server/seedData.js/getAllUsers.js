// Connect to the root env
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Uncomment console log to understand the code below
// console.log(path.resolve(__dirname, "../.env"));

// Connect to root Database
const pool = require("../db");
const usersList = require("./usersList");

const init = async (data) => {
  try {
    const allUsers = await pool.query(`SELECT * FROM users;`);
    console.log(allUsers.rows);
    return await pool.end();
  } catch (error) {
    console.log(error);
  }
};

init(usersList);
