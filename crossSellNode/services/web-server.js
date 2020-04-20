const http = require("http");
const express = require("express");
const webServerConfig = require("../config/web-server");

let httpServer;

function initialize() {
  const router = express();
  httpServer = http.createServer(router);

  router.get("/", async (_req, res) => {
    res.send("ok");
  });

  router.use("/getcrosssell", require("../routes/api/getCrossSell"));
  router.use("/addcrosssell", require("../routes/api/addCrossSell"));

  httpServer.listen(webServerConfig.port).on("listening", () => {
    console.log(`Web server listening on localhost:${webServerConfig.port}`);
  });
}

module.exports.initialize = initialize;
