require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const passport = require("passport");
require("./middlewares/passport");
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
// Import routes

// Load environment variables from .env file

// Initialize Express app
const app = express();

// Middlewarechat
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(helmet()); // Set security HTTP headers
app.use(morgan("combined")); // Logging
app.use(compression()); // Gzip compression
app.use(passport.initialize());
app.use(cookieParser());

// User Routes
app.use("/user", require("./routes/user.route"));
app.use(
  "/project",
  passport.authenticate("jwt", { session: false }),
  require("./routes/manager.route")
);
app.use(
  "/ticket",
  passport.authenticate("jwt", { session: false }),
  require("./routes/ticket.route")
);
app.use("/refresh", require("./middlewares/verifyRefresh"));
app.use("/mobileToken", require("./middlewares/verifyMobileToken"));
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
