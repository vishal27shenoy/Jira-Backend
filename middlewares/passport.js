const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/user.model");

const secretKey = process.env.ACCESS_SECRET; // Replace with your own secret key

const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    console.log(payload, "this is payload");
    const user = await User.findById(payload._id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);
