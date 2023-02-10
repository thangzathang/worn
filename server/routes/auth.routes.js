const router = require("express").Router();

// Middleware
const validInfo = require("../middleware/validInfo");
const verifyJWT = require("../middleware/verifyJWT");

// Import controllers
const authController = require("../controllers/auth.controller");

// Registering
router.post("/register", validInfo, authController.registerUser);

// Login Route
router.post("/login", validInfo, authController.loginUser);

// Verify route
router.get("/verify", verifyJWT, async (req, res) => {
  try {
    // This means user has passed authorization
    // res.json(req.user);
    res.json(true);
  } catch (error) {
    console.log("Error at Verifying Route", error);
    res.status(500).send("Server Error -  at Verifying");
  }
});

/* New logout route */
router.post("/logout", authController.logoutUser);

/* Old logout route */
// router.post("/logout", async (req, res) => {
//   try {
//     const token = "";
//     return res
//       .status(200)
//       .cookie("token", token, {
//         sameSite: "none",
//         secure: true,
//         httpOnly: true,
//       })
//       .send({ message: "Logging out" });
//   } catch (error) {
//     console.log("Error at Logout Route", error);
//     res.status(500).send("Error at Logout Route");
//   }
// });

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
