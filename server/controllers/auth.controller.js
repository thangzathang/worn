// Database
const pool = require("../db");

// Bcrypt
const bcrypt = require("bcrypt");

// Jwt
const jwt = require("jsonwebtoken");

// Jwt Generator
const { jwtGenerator, jwtGenerator_refreshToken } = require("../utils/jwtGenerator");

const registerUser = async (req, res) => {
  try {
    // 1. Get data
    const { username, email, password } = req.body;
    console.log("Data we get:", { username, email, password });

    let roles = '{"User": 2001}';

    if (!username || !email || !password) {
      return res.status(400).send({ message: "Username, email or password are missing" });
    }

    // 2. Check if user exists
    const checkDuplicate = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

    // If User exists
    if (checkDuplicate.rows.length !== 0) {
      // 409 Status code is conflict.
      return res.status(409).send({ message: "User already exists", data: checkDuplicate.rows });
    }

    // res.json(checkDuplicate.rows);

    // 3. Bcrypt the user password.
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Add/store the user to database.
    // NOTE: We store the encrypted password, not the password itself.
    // Save the refresh token in the database? Do I need a new field for that?
    // We don't store refresh tokens when we register
    const newUser = await pool.query(
      `
      INSERT INTO users (user_name, user_email, user_password, roles) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [username, email, bcryptPassword, roles]
    );

    // 5. Generate required tokens.
    const accessToken = jwtGenerator(newUser.rows[0].user_name);
    const refreshToken = jwtGenerator_refreshToken(newUser.rows[0].user_name);

    // 6. Insert the refresh token?

    // 7. Send JWT
    return res
      .status(200)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        // One day maxAge
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        // secure: true,
      })
      .json({
        accessToken,
        // accessToken,
        // user: {
        //   user_id: newUser.rows[0].user_id,
        //   user_email: newUser.rows[0].user_id,
        //   user_name: newUser.rows[0].user_name,
        // },
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
    if (!email || !password) {
      return res.status(400).send({ message: "Username and password are required" });
    }

    // 2. Check if user exists
    const foundUser = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
    // console.log("User is:", foundUser.rows[0]);
    let roles = Object.values(foundUser.rows[0].roles);
    // console.log("User Role is:", roles);

    // If user does not exist
    if (foundUser.rows.length === 0) {
      // 401 - unauthorized
      return res.status(401).send({ message: "User with email does not exist" });
    }

    // 3. Check password
    const validPassword = await bcrypt.compare(password, foundUser.rows[0].user_password);
    // console.log("Password is valid:", validPassword);

    if (!validPassword) {
      return res.status(401).send({ message: "Incorrect credentials" });
    }

    /* JWT and refresh token */
    // 4. Give JWT Token
    const accessToken = jwtGenerator(foundUser.rows[0].user_id, roles);
    const refreshToken = jwtGenerator_refreshToken(foundUser.rows[0].user_id, roles);

    // 5. Insert Refresh token to the user.
    const UserUpdated = await pool.query(
      `
      UPDATE users
      SET refreshToken = $1
      WHERE user_id = $2
      RETURNING *
      `,
      [refreshToken, foundUser.rows[0].user_id]
    );

    //--> Don't ever have to do this
    // await pool.end();
    // console.log("UserUpdated:", UserUpdated.rows[0]);

    // const userBody = {
    //   user_id: foundUser.rows[0].user_id,
    //   user_name: foundUser.rows[0].user_name,
    //   user_email: foundUser.rows[0].user_email,
    // };
    // console.log("User body:", userBody);

    console.log("Successfully Logged In");
    // 6. Send JWT as cookie/.
    return res
      .status(200)
      .cookie("jwt", refreshToken, {
        sameSite: "none",
        // You need secure; true for chrome.
        secure: true,
        httpOnly: true,
      })
      .send({
        accessToken,
        // user: userBody,
        roles: foundUser.rows[0].roles,
      });

    // res.status(200).send({ token });
  } catch (error) {
    console.log("Error at Login Route", error);
    return res.status(500).send("Server Error -  at Logging in");
  }
};

const logoutUser = async (req, res) => {
  // Make sure to delete the access token on the client end.
  // In this backend, we will be deleting the refresh token.

  const cookies = req.cookies;
  console.log("logoutUser() start");

  // Verify user can logout
  if (!cookies?.jwt) {
    return res.sendStatus(204); // Successful and no content to send back.
  }

  const refreshToken = cookies.jwt;

  // Check for user with this refreshToken
  let payload = null;
  try {
    payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    //   console.log("payload:", payload.user_id);
    const foundUser = await pool.query("SELECT user_id,user_name,user_email FROM users WHERE user_id = $1", [payload.user_id]);

    // If not user, Forbidden. Send empty access Token.
    if (!foundUser) {
      // If no user exists but cookie is verified - we just clear that send cookie.
      res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });
      return res.sendStatus(204); //
    }

    // 1. Delete refreshToken in the database.
    const refreshTokenDelete = await pool.query(
      `
     UPDATE users
      SET refreshToken = ''
      WHERE user_id = $1
      RETURNING *
    `,
      [foundUser.rows[0].user_id]
    );

    if (refreshTokenDelete) {
      return res.status(200).json({ message: `Refresh Token for user with username "${foundUser.rows[0].user_name}" has been deleted.` });
    }

    // 2. Delete the refreshToken in the res.
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });
    // later we add secure: true - only serves in https -> We don't add this in development but in production.

    console.log("logoutUser() end");
    return res.sendStatus(204);
  } catch (err) {
    console.log("Failed to verify:", err);
    return res.send({ accessToken: "" });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
