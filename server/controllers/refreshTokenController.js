require("dotenv").config();
const jwt = require("jsonwebtoken");

// Database
const pool = require("../db");

// Jwt Generator
const { jwtGenerator } = require("../utils/jwtGenerator");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  // If no token, send empty accessToken and 401 // Unauthorized.
  if (!cookies?.jwt) {
    return res.status(401).send({ accessToken: "" });
  }

  // Init refresh Token and payload
  const refreshToken = cookies.jwt;
  let payload = null;

  try {
    payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    //   console.log("payload:", payload.user_id);
  } catch (err) {
    console.log("Failed to verify:", err);
    return res.send({ accessToken: "" });
  }

  try {
    // If token is valid, using the payload from the .verify, get the user.
    const foundUser = await pool.query("SELECT user_id,user_name,user_email FROM users WHERE user_id = $1", [payload.user_id]);
    // If not user, Forbidden. Send empty access Token.
    if (!foundUser) {
      return res.sendStatus(403).json({ accessToken: "" }); // Forbidden
    }
    let roles = foundUser.rows[0].roles;
    // If User is found, we send a new accessToken
    const accessToken = jwtGenerator(foundUser.rows[0].user_id, roles);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Error at getting user:", error);
    return res.status(403).send({ accessToken: "" });
  }
};

module.exports = { handleRefreshToken };
