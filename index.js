const PORT = process.env.PORT || 5000;
const path = require("path");
const express = require("express");
const router = express();

const database = require("./services/database.js");
require("./models/User");
require("./services/passport");

const startup = async () => {
  await database();

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
