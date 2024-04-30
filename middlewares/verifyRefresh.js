const User = require("../models/user.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/generate.token");

const verifyRefresh = async (req, res) => {
  try {
    const token = req.cookies;
    const decoded = jwt.verify(token.jwt, process.env.REFRESH_SECRET);
    const userFound = await User.findOne({ _id: decoded._id });
    if (userFound) {
      const accessToken = generateAccessToken(
        userFound._id,
        userFound.userName,
        userFound.email,
        userFound.role
      );
      res.status(200).json({ token: accessToken });
    } else {
      res.status(400).json({message : "User not found"});
    }
  } catch (err) {
    res.status(500).json({message : "Internal Server Error"});
  }
};
router.route("/").get(verifyRefresh);
module.exports = router;
