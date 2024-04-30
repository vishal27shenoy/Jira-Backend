const jwt = require("jsonwebtoken");
const generateAccessToken = (_id ,userName, email ,role) => {
  return jwt.sign({ _id:_id,userName: userName, email: email ,role}, process.env.ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (_id ,userName, email,role ) => {
    return jwt.sign({_id:_id, userName: userName, email: email,role }, process.env.REFRESH_SECRET, {
      expiresIn: "1h",
    });
  };
  
  module.exports = {generateAccessToken,generateRefreshToken}