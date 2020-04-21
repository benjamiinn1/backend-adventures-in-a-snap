const express = require("express");
const router = express();
const legalTxt = require("./legalTxt");
router.get("/privacy", (req, res) => {
  console.log(legalTxt);
  res.send(`${legalTxt.PRIVACY()}`);
});

module.exports = router;
