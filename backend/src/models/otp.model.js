const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires in 5 minutes (300 seconds)
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
