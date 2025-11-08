const express = require("express");
const router = express.Router();
const { getCalendarEvents, createCalendarEvent } = require("../controllers/google.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/calendar", authUser, getCalendarEvents)
router.post("/calendar", authUser, createCalendarEvent)

module.exports = router;
