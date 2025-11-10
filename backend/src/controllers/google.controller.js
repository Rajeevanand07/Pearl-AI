const { oauth2Client } = require("../utils/googleConfig");
const { google } = require("googleapis");
const axios = require("axios");
const { decrypt } = require("../utils/cryptoUtils");
const { getZoomAccessToken } = require("../utils/zoomAccess");

async function getCalendarEvents(req, res) {
  try {
    const encryptedRefreshToken = req.user.google.refreshToken;
    const refreshToken = decrypt(encryptedRefreshToken);

    const googleRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    oauth2Client.setCredentials(googleRes.data);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const calendarRes = await calendar.events.list({
      calendarId: "primary",
      timeMin: firstDay.toISOString(),
      timeMax: lastDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.status(200).json(calendarRes.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function createCalendarEvent(req, res) {
  try {
    const encryptedRefreshToken = req.user.google.refreshToken;
    const refreshToken = decrypt(encryptedRefreshToken);

    const googleRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    oauth2Client.setCredentials(googleRes.data);

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    try {
      const zoomAccessToken = await getZoomAccessToken();
      const zoomRes = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
          topic: "Team Sync Meeting",
          type: 2,
          start_time: "2025-11-11T10:00:00",
          duration: 60,
          timezone: "Asia/Kolkata",
        },
        {
          headers: {
            Authorization: `Bearer ${zoomAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const zoomMeeting = zoomRes.data.join_url;

      const event = {
        summary: "Team Sync Meeting",
        description: "Weekly sync with project team.",
        location: zoomMeeting,
        start: {
          dateTime: "2025-11-11T10:00:00+05:30",
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: "2025-11-11T11:00:00+05:30",
          timeZone: "Asia/Kolkata",
        },
        attendees: [{ email: "anandrajeev226@gmail.com" }],
      };

      // Create the event
      const { data } = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error(
        "Error creating Zoom meeting:",
        error.response?.data || error.message
      );
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { getCalendarEvents, createCalendarEvent };
