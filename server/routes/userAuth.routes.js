const router = require("express").Router();

// Middleware
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// Import controllers
const { registerUser, loginUser } = require("../controllers/users.controller");

// Registering
router.post("/register", validInfo, registerUser);

// Login Route
router.post("/login", validInfo, loginUser);

// Verify route
router.get("/verify", authorization, async (req, res) => {
  try {
    // This means user has passed authorization
    // res.json(req.user);
    res.json(true);
  } catch (error) {
    console.log("Error at Verifying Route", error);
    res.status(500).send("Server Error -  at Verifying");
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = "";
    return res
      .status(200)
      .cookie("token", token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .send({ message: "Logging out" });
  } catch (error) {
    console.log("Error at Logout Route", error);
    res.status(500).send("Error at Logout Route");
  }
});

module.exports = router;

// Chaining http methods
/*
// This means that for all '/', the get, post, delete, put are all in one chain. So cool.
router.route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .put((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .delete((req, res) => {
        res.json({ "id": req.body.id })
    });

*/
