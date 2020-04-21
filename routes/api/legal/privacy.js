const express = require("express");
const router = express();
const legalTxt = require("./legalTxt");
router.get("/privacy", (req, res) => {
  res.send(`${legalTxt.PRIVACY()}`);
});

router.get("/tos", (req, res) => {
  res.send(`${legalTxt.TOS()}`);
});

module.exports = router;
