const express = require("express");
const router = express.Router();
const { getCalendarEvents } = require("../controllers/google.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/calendar", authUser, getCalendarEvents)

module.exports = router;
