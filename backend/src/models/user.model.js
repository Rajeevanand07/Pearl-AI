const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String }, // only for normal signup users
  googleId: { type: String }, // only for Google OAuth users
  profileImage: String,
  loginType: { type: String, enum: ["normal", "google"], default: "normal" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
