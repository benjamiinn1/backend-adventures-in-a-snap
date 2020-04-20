const webServer = require("./services/web-server.js");
const database = require("./services/database.js");

const startup = async () => {
  console.log("Starting application");
  try {
    console.log("Initializing database module");

    await database();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }

  try {
    console.log("Initializing web server module");

    webServer.initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }
};

startup();
