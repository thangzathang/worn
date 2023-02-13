const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, roles = []) {
  // const payload = {
  //   user: {
  //     id: user_id,
  //   },
  // };

  const payload = {
    UserInfo: {
      user_id: user_id,
      roles: roles,
    },
  };

  /* 
  How to generate 
  1. type 'node'
  2. type 'require('crypto').randomBytes(64).toString('hex')'
  3. copy the result and paste
   */

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15minutes" });
}

function jwtGenerator_refreshToken(user_id) {
  const payload = {
    user_id: user_id,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

module.exports = { jwtGenerator, jwtGenerator_refreshToken };
