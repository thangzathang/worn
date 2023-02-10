const router = require("express").Router();

// Import controllers
const refreshTokenController = require("../controllers/refreshTokenController");

// Registering
router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;
