const oracledb = require("oracledb");
const dbConfig = require("../config/database.js");

async function initialize() {
  await oracledb
    .createPool(dbConfig.dbPool)
    .then(console.log("pool is created"));
}

async function close() {
  console.log("\nTerminating");
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
    await oracledb
      .getPool()
      .close()
      .then(console.log("shutting off pool"));
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

process.once("SIGTERM", close).once("SIGINT", close);

async function simpleExecute(statement, binds = [], opts = {}) {
  let conn;

  opts.outFormat = oracledb.OBJECT;
  opts.autoCommit = true;

  try {
    conn = await oracledb.getConnection();

    const result = await conn.execute(statement, binds, opts);
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      try {
        await conn.close();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports.simpleExecute = simpleExecute;
module.exports.close = close;
module.exports.initialize = initialize;
