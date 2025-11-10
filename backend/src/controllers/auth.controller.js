const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../utils/googleConfig");
const axios = require("axios");
const { encrypt } = require("../utils/cryptoUtils");
const Otp = require("../models/otp.model");
const { sendOtpEmail } = require("../utils/sendOtp");

async function googleAuth(req, res) {
  try {
    const { code } = req.query;
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { name, email, picture, id } = userRes.data;
    let user = await User.findOne({ email });

    const encryptedRefreshToken = encrypt(googleRes.tokens.refresh_token);

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImage: picture,
        loginType: "google",
        google: {
          googleId: id,
          refreshToken: encryptedRefreshToken,
          isVerified: true,
          googleConnected: true,
        },
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRE_TOKEN,
    });

    res.cookie("token", token, {
      maxAge: 15 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User created successfully",
      user,
      googleRes: googleRes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, otp } = req.body;

    // If OTP is not provided, send OTP
    if (!otp) {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate and send OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.create({ email, otp: otpCode });
      
      const isOTPSent = await sendOtpEmail(email, otpCode);

      if (!isOTPSent) {
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      return res.status(200).json({ 
        message: "OTP sent to email", 
        tempData: { name, email, password } 
      });
    }

    // If OTP is provided, verify and register
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if OTP is expired (5 minutes)
    if (new Date() - otpRecord.createdAt > 5 * 60 * 1000) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: null,
      loginType: "normal",
      google: {
        googleId: null,
        refreshToken: null,
        isVerified: true,
        googleConnected: false,
      },
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    return res.status(201).json({ user, token });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { register, login, logout, googleAuth };
