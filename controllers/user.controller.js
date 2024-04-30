const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generate.token");
const Register = async (req, res) => {
  console.log(req.body);
  try {
    const { userName, email, password } = req.body;
    if (
      userName?.trim() == "" ||
      email?.trim() == "" ||
      password?.trim() == ""
    ) {
      return res.status(204).json({ message: "Invalid Credentials" });
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(403)
        .json({ message: "User Exist with this Credentials" });
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    const createUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
      role: "Employee",
    });

    const userSaved = await createUser.save();

    if (userSaved) {
      const accessToken = generateAccessToken(
        userSaved._id,
        userSaved.userName,
        userSaved.email,
        userSaved.role
      );
      const refreshToken = generateRefreshToken(
        userSaved._id,
        userSaved.userName,
        userSaved.email,
        userSaved.role
      );
      userSaved.token = refreshToken;
      await userSaved.save();
      res.cookie("jwt", refreshToken);
      return res
        .status(200)
        .json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      return res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (email?.trim() == "" || password?.trim() == "") {
      return res.status(204).json({ message: "Invalid Credentials" });
    }
    console.log(req.body);
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      console.log(userExist);
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (isMatch) {
        const accessToken = generateAccessToken(
          userExist._id,
          userExist.userName,
          userExist.email,
          userExist.role
        );
        const refreshToken = generateRefreshToken(
          userExist._id,
          userExist.userName,
          userExist.email,
          userExist.role
        );
        res.cookie("jwt", refreshToken);
        return res
          .status(200)
          .json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        return res.status(406).json({ message: "Invalid Credentials" });
      }
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  Register,
  Login,
};
