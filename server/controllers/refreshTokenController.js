// Database
const pool = require("../db");

// Jwt Generator
const { jwtGenerator, jwtGenerator_refreshToken } = require("../utils/jwtGenerator");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  // Check for jwt token
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;
  const foundUser = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

  return;
  try {
    /* JWT and refresh token */
    // 4. Give JWT Token
    const accessToken = jwtGenerator(foundUser.rows[0].user_name);
    console.log("Token login:", accessToken);

    const userBody = {
      user_id: foundUser.rows[0].user_id,
      user_name: foundUser.rows[0].user_name,
      user_email: foundUser.rows[0].user_email,
    };
    // console.log("User body:", userBody);

    console.log("Sending token and user back");
    // 5. Send JWT as cookie
    return res
      .status(200)
      .cookie("token", accessToken, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .send({
        accessToken,
        user: userBody,
      });

    // res.status(200).send({ token });
  } catch (error) {
    console.log("Error at Login Route", error);
    return res.status(500).send("Server Error -  at Logging in");
  }
};

module.exports = { handleRefreshToken };
