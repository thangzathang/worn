const router = require("express").Router();

const ROLES_LIST = require("../../config/roles_lists");

/* Middleware */
const verifyRoles = require("../../middleware/verifyRoles");

// Get controller
const userController = require("../../controllers/users.controller");

// If we want to protect all /user routes there is a better way.
// Checkout index file
router.get("/", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), userController.getAllUsers);

module.exports = router;
