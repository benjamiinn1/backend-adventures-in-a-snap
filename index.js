const database = require("./services/database.js");
const path = require("path");
const webServerConfig = require("./config/web-server");
const express = require("express");
const router = express();
const legalAPI = require("./routes/api/legal/privacy");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const startup = async () => {
  console.log("Starting application");
  try {
    console.log("Initializing database module");

    await database();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }

  try {
    console.log("Initializing web server module");

    router.get("/", async (_req, res) => {
      res.sendFile(path.join(__dirname + "/index.html"));
    });

    router.use("/legal", legalAPI);

    router.listen(webServerConfig.PORT).on("listening", () => {
      console.log(`Web server listening on localhost:${webServerConfig.PORT}`);
    });
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }
};

startup();
