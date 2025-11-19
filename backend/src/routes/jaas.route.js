const express = require("express");
const router = express.Router();
const { generateToken } = require("../controllers/jaas.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/generate-token/:roomName", authUser, generateToken);

module.exports = router;