// Database
const pool = require("../db");

// Bcrypt
const bcrypt = require("bcrypt");

// Jwt Generator
const jwtGenerator = require("../utils/jwtGenerator");

const registerUser = async (req, res) => {
  try {
    // 1. Get data
    const { username, email, password } = req.body;

    // 2. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

    // If User exists
    if (user.rows.length !== 0) {
      return res.status(401).send({ message: "User already exists", data: user.rows });
    }

    // res.json(user.rows);

    // 3. Bcrypt the user password.
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Add the user to database.
    // NOTE: We store the encrypted password, not the password itself.
    const newUser = await pool.query(
      `
      INSERT INTO users (user_name, user_email, user_password) 
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [username, email, bcryptPassword]
    );

    // 5. Generate JWT.
    const token = jwtGenerator(newUser.rows[0].user_id);

    // 6. Send JWT
    return res
      .status(200)
      .cookie("token", token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .send({
        token,
        user: {
          user_id: newUser.rows[0].user_id,
          user_email: newUser.rows[0].user_id,
          user_name: newUser.rows[0].user_name,
        },
      });

    // res.status(200).send({ token });
  } catch (error) {
    console.log("Error at Registering", error);
    res.status(500).send("Server Error -  at Registering");
  }
};

const loginUser = async (req, res) => {
  try {
    // 1. Get data
    const { email, password } = req.body;

    // 2. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

    console.log("User is:", user.rows[0]);

    // If user does not exist
    if (user.rows.length === 0) {
      return res.status(401).send({ message: "User with email does not exist" });
    }

    // 3. Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

    console.log("Password is valid:", validPassword);
    if (!validPassword) {
      return res.status(401).send({ message: "Incorrect credentials" });
    }

    // 4. Give JWT Token
    const token = jwtGenerator(user.rows[0].user_id);
    console.log("Token login:", token);

    const userBody = {
      user_id: user.rows[0].user_id,
      user_name: user.rows[0].user_name,
      user_email: user.rows[0].user_email,
    };
    // console.log("User body:", userBody);

    console.log("Sending token and user back");
    // 5. Send JWT as cookie
    return res
      .status(200)
      .cookie("token", token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .send({
        token,
        user: userBody,
      });

    // res.status(200).send({ token });
  } catch (error) {
    console.log("Error at Login Route", error);
    return res.status(500).send("Server Error -  at Logging in");
  }
};

module.exports = { registerUser, loginUser };
