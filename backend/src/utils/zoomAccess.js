const axios = require("axios");

async function getZoomAccessToken() {
  try {
    const tokenRes = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "account_credentials",
          account_id: process.env.ZOOM_ACCOUNT_ID,
        },
        auth: {
          username: process.env.ZOOM_CLIENT_ID,
          password: process.env.ZOOM_CLIENT_SECRET,
        },
      }
    );

    // console.log("Zoom token response:", tokenRes.data);
    return tokenRes.data.access_token;

  } catch (error) {
    console.error("Zoom token error:", error.response?.data || error.message);
  }
}


module.exports = { getZoomAccessToken };
