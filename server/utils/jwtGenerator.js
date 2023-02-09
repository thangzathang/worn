const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
  // const payload = {
  //   user: user_id,
  // };

  const payload = {
    user: {
      id: user_id,
    },
  };

  /* 
  How to generate 
  1. type 'node'
  2. type 'require('crypto').randomBytes(64).toString('hex')'
  3. copy the result and paste
   */

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
