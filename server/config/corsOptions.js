const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    /* 
    -1 means does not exist, but here we are checking !== so in context 
     we are making sure the domain exists in the whitelist 
     */
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Domain not in the whitelist. Not allowed by CORS origin."));
    }
  },
  optionSuccessStatus: 200,
  credentials: true,
};

module.exports = corsOptions;
