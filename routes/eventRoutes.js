module.exports = (router) => {
  router.get("/api/dfwevents", (req, res) => {
    res.json([
      {
        id: 1,
        name: "Event 1",
        startTime: new Date("December 17, 1995 03:24:00"),
        endTime: new Date("December 17, 1995 05:00:00"),
      },
      {
        id: 2,
        name: "Event 2",
        startTime: new Date("December 18, 1995 05:30:00"),
        endTime: new Date("December 18, 1995 06:30:00"),
      },
    ]);
  });
};
