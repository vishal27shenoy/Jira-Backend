const User = require("../models/user.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/generate.token");

const verifyMobileRefresh = async (req, res) => {
    try {
      const token = req.headers['refresh-token'];
    console.log(req.headers)
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
      console.log(decoded)
      const userFound = await User.findOne({ _id: decoded._id });
      if (userFound) {
        const accessToken = generateAccessToken(
          userFound._id,
          userFound.userName,
          userFound.email,
          userFound.role
        );
        return res.status(200).json({ accessToken: accessToken });
      } else {
        return res.status(400).json({message : "User not found"});
      }
    } catch (err) {
        console.log(err)
      return res.status(500).json({message : "Internal Server Error"});
    }
  };
router.route("/").get(verifyMobileRefresh);
module.exports = router;
