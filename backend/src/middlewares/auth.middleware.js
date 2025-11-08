require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authUser(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authUser };