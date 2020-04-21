const legalTxt = require("../services/legalTxt");

module.exports = (router) => {
  router.get("/privacy", (req, res) => {
    res.send(`${legalTxt.PRIVACY()}`);
  });

  router.get("/tos", (req, res) => {
    res.send(`${legalTxt.TOS()}`);
  });
};
