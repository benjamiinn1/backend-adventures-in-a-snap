const express = require("express");
const router = express();
const webServerConfig = require("../config/web-server");

function initialize() {
  router.get("/", async (_req, res) => {
    res.send("Hello Person");
  });

  router.listen(webServerConfig.PORT).on("listening", () => {
    console.log(`Web server listening on localhost:${webServerConfig.PORT}`);
  });
}

module.exports.initialize = initialize;
