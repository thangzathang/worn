const router = require("express").Router();

const verifyJWT = require("../../middleware/verifyJWT");

// Get controller
const userController = require("../../controllers/user.controller");

router.get("/", verifyJWT, userController.getAllUsers);
