const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(username) {
  // const payload = {
  //   user: {
  //     id: user_id,
  //   },
  // };

  const payload = {
    username: username,
  };

  /* 
  How to generate 
  1. type 'node'
  2. type 'require('crypto').randomBytes(64).toString('hex')'
  3. copy the result and paste
   */

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10minutes" });
}

function jwtGenerator_refreshToken(username) {
  const payload = {
    username: username,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

module.exports = { jwtGenerator, jwtGenerator_refreshToken };
