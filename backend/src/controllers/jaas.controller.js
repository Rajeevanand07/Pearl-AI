const generateJaaSToken = require("../utils/jaasToken");

async function generateToken(req, res) {
  try {
    const { roomName } = req.params;   
    const token = generateJaaSToken(roomName);
    res.json({ token,appId:process.env.JAAS_APP_ID });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
}

module.exports = { generateToken };
