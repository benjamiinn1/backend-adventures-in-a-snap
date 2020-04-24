const PORT = process.env.PORT || 5000;
const path = require("path");
const express = require("express");
const router = express();
const cookieSession = require("cookie-session");
const passport = require("passport");

const keys = require("./config/keys");
const database = require("./services/database.js");
require("./models/User");
require("./services/passport");

const startup = async () => {
  await database();

  router.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey],
    })
  );

  router.use(passport.initialize());
  router.use(passport.session());

  router.get("/", async (_req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
  });

  require("./routes/legalRoutes")(router);
  require("./routes/authRoutes")(router);

  router.listen(PORT).on("listening", () => {
    console.log(`Web server listening on localhost:${PORT}`);
  });
};

startup();
