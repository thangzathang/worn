// Connect to the root env
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Connect to the root database
const pool = require("../db");

const init = async () => {
  try {
    console.log("Connected:", await pool);
    await pool.end();
  } catch (error) {
    console.log(error);
  }
};

init();
