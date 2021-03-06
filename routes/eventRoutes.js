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
  router.post('/api/dfwevents/create', (req, res) => {
    let { name, description } = req.body;
    const newAdventure = {};
    name = name.toUpperCase();
    newAdventure.name = name;
    newAdventure.description = description
    
    try {
      
      adventure = new Adventure(newAdventure);

      await adventure.save();
      res.json({ msg: adventure });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  })
};
