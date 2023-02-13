// Connect to the root env
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Database - local
const pool = require("../db");

// Bcrypt
const bcrypt = require("bcrypt");

const usersList = require("./usersList");

const init = async (usersArray) => {
  for (let i = 0; i < usersArray.length; i++) {
    let username = usersArray[i][0];
    let email = usersArray[i][1];
    let password = usersArray[i][2];
    let roles = usersArray[i][3];

    // console.log("Username:", username);
    // console.log("email:", email);
    // console.log("password:", password);
    // console.log("roles:", roles);

    /* Password Salt */
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    try {
      /* Add user to database */
      const newUser = await pool.query(
        `INSERT INTO users (user_name, user_email, user_password, roles)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [username, email, bcryptPassword, roles]
      );
      newUser && console.log(newUser.rows);
    } catch (error) {
      console.log(error);
    }
  }
  // return await pool.end(); --> Don't have to do this
  return;
};

init(usersList);
