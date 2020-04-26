const passport = require("passport");

module.exports = (router) => {
  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/");
    }
  );

  router.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  router.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
