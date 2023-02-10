const allowedOrigins = require("../config/allowedOrigins");

const credentials = (rew, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.include(origin)) {
    res.headers("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
