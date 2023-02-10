require("dotenv").config();

// Database
const pool = require("../db");

// Jwt Generator
// const { jwtGenerator, jwtGenerator_refreshToken } = require("../utils/jwtGenerator");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  // Check for jwt token
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  console.log("cookie.jwt:", cookies.jwt);

  const refreshToken = cookies.jwt;
  const foundUser = await pool.query("SELECT * FROM users WHERE refreshToken = $1", [refreshToken]);
  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }
  console.log("foundUser (with refresh Token):", foundUser);

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

  return;
};

module.exports = { handleRefreshToken };
