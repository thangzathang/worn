require("dotenv").config();
const jwt = require("jsonwebtoken");

// Database
const pool = require("../db");

// Jwt Generator
// const { jwtGenerator, jwtGenerator_refreshToken } = require("../utils/jwtGenerator");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  try {
    // If no token, send empty accessToken and 401 // Unauthorized.
    if (!cookies?.jwt) {
      return res.status(401).send({ accessToken: "" });
    }

    const refreshToken = cookies.jwt;

    let payload = null;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log("Failed to verify:", err);
      return res.send({ accessToken: "" });
    }

    // If token is valid, using the payload from the .verify, get the user.
    const foundUser = await pool.query("SELECT * FROM users WHERE refreshToken = $1", [payload.user_id]);
    if (!foundUser) {
      return res.sendStatus(403); // Forbidden
    }
    console.log("foundUser (with refresh Token):", foundUser.rows[0]);
    return res.json({ user: JSON.stringify(foundUser.rows[0]) });

    return;
    // Evaluate Jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser.row[0].user_name !== decoded.username) {
        console.log("foundUser === decoded.username?", foundUser.row[0].user_name !== decoded.username);
        return res.sendStatus(403);
      }
      // Since refresh token has been signed, send new access token.
      const accessToken = jwt.sign(
        //
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15minutes" }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.log("Error at refreshToken:", error);
  }
};

module.exports = { handleRefreshToken };
