const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  // console.log("Credentials middleware:", req.headers);
  if (allowedOrigins.includes(origin)) {
    // res.header NOT res.headers
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
