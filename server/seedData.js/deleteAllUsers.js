// Connect to the root env
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Database - local
const pool = require("../db");

const usersList = require("./usersList");

const init = async (data) => {
  try {
    const deleteQuery = await pool.query(`DELETE FROM users;`);
    console.log(deleteQuery);
  } catch (error) {
    console.log(error);
  }
};

init(usersList);
