const express = require("express");
const router = express();

router.use(express.json({ extended: false }));

router.post("/", (req, res) => {
  const { test } = req.body;
  res.send(`adding ${test}`);
});

module.exports = router;
