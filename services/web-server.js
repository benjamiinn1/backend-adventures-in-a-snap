const express = require("express");
const router = express();
const path = require("path");
const webServerConfig = require("../config/web-server");
const legalAPI = require("../routes/api/legal/privacy");
// const passport = require("passport");
// const FacebookStrategy = require("passport-facebook").Strategy;

function initialize() {
  // passport.use(new FacebookStrategy());

  router.get("/", async (_req, res) => {
    res.sendFile(path.join(__dirname + "../index.html"));
  });

  router.use("/legal", legalAPI);

  router.listen(webServerConfig.PORT).on("listening", () => {
    console.log(`Web server listening on localhost:${webServerConfig.PORT}`);
  });
}

module.exports.initialize = initialize;
