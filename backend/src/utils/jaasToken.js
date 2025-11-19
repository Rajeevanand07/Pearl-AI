// ../utils/jaasToken.js

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../keys/jaas-private.pem"),
  "utf8"
);


function generateJaaSToken(roomName) {
  const payload = {
    aud: "jitsi",
    iss: "chat", 
    sub: process.env.JAAS_APP_ID, 
    room: roomName,               
    moderator: true,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,

    context: {
      user: {
        name: "Rajeev Anand",
        email: "anandrajeev1234@gmail.com",
      },
      features: {
        // Changed strings to booleans
        livestreaming: true,
        recording: true,
        transcription: true,
        "outbound-call": true,
      },
    }
  };

  // Your signing options are correct
  return jwt.sign(payload, privateKey, { 
    algorithm: "RS256", 
    header: { kid: process.env.JAAS_KID } 
  });
}

module.exports = generateJaaSToken;