const router = require("express").Router();
const verifyJWT = require("../../middleware/verifyJWT");

// Get controller
const userController = require("../../controllers/users.controller");

// If we want to protect all /user routes there is a better way.
// Checkout index file
router.get(
  "/",
  //
  //   verifyJWT,
  userController.getAllUsers
);

module.exports = router;
