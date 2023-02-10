const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = async (req, res, next) => {
  try {
    /* Dave Gray - node code */
    // Check for auth header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "verifyJWT failed" });
    }
    console.log(authHeader); // Bearer Token

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // Invalid - 403.
        return res.sendStatus(403);
      }
      req.user = decoded.user_id;
      next();
    });

    // /* Stoic Programmer PERN code */
    // const jwtToken = req.cookies.token;
    // // No token means no authorization
    // // console.log("jwtToken:", jwtToken);
    // if (!jwtToken) {
    //   // return res.status(403).send({ verified: false, message: "You are not authorized!" });
    //   const token = "";
    //   return res
    //     .status(403)
    //     .cookie("token", token, {
    //       sameSite: "none",
    //       secure: true,
    //       httpOnly: true,
    //     })
    //     .send({ verified: false, message: "You are not authorized! New empty cookie sent!" });
    // }
    // const payload = await jwt.verify(jwtToken, process.env.jwtSecret);
    // req.user = payload.user;
    // next();
  } catch (error) {
    console.log("Serer error - authorized failed:", error);

    // Expired token means send back an empty token so that user is directed to login page in the client side.
    const token = "";
    return res
      .status(403)
      .cookie("token", token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .send({ verified: false, message: "You are not authorized! New empty cookie sent!" });
  }
};

module.exports = verifyJWT;
