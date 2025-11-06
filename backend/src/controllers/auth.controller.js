const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../utils/googleConfig");
const axios = require("axios");

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

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: id,
        profileImage: picture,
        loginType: "google",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRE_TOKEN,
    });

    res.cookie("token", token, {
      maxAge: 15 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({
        message: "User created successfully",
        token,
        user,
        userRes: userRes.data,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      loginType: "normal",
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    return res.status(201).json({ user, token });
  } catch (error) {
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
