const express = require("express");
const router = express();
const sqlQuery = require("../../services/database");
router.use(express.json({ extended: false }));

const sql = `select t1.BKG_CUST_FIRST_NM, t1.BKG_CUST_LAST_NM,t1.RES_CONFRM_ID,t1.ELEC_CONTACT_ADDR_TXT,t1.RES_START_LOC_TXT,
t1.RES_START_TMS,t1.VNDR_CD,t2.CAR_RENTAL_VEHICLE_CATG_CD,t1.RES_STATUS_CD, t2.DRVR_FIRST_NM, t2.DRVR_LAST_NM from 
ECDD_TRAVEL_RES t1, ECDD_CAR_RENTAL_RES t2
 where t1.RES_CONFRM_ID = t2.RES_CONFRM_ID AND t1.RES_BKG_TMS = t2.RES_BKG_TMS `;
let fullSql;
let result;

router.post("/ResId", async (req, res) => {
  const { confirmId } = req.body;
  fullSql = sql + `AND t1.RES_CONFRM_ID = '${confirmId}'`;
  result = await sqlQuery.simpleExecute(fullSql.toUpperCase());
  return res.send(result.rows[0]);
});

router.post("/Email", async (req, res) => {
  const { email } = req.body;
  fullSql = sql + ` AND t1.ELEC_CONTACT_ADDR_TXT = '${email}'`;
  result = await sqlQuery.simpleExecute(fullSql.toUpperCase());
  return res.send(result.rows[0]);
});

router.post("/Loyaltyinfo", async (req, res) => {
  const { loyaltyNumber, loyaltyAccountOwner } = req.body;
  fullSql =
    sql +
    ` AND t1.BKNG_LYLTY_ACCT_ID = '${loyaltyNumber}' AND t1.BKNG_LYLTY_ACCT_OWN_AIRLN_CD = '${loyaltyAccountOwner}'`;
  // return res.send(fullSql.toUpperCase());
  result = await sqlQuery.simpleExecute(fullSql.toUpperCase());
  return res.send(result.rows[0]);
});

router.post("/nameandresdate", async (req, res) => {
  const {
    lastName,
    firstName,
    resTimestamp,
    startTimestampIndicator
  } = req.body;
  fullSql =
    sql +
    ` AND t1.BKG_CUST_FIRST_NM = '${firstName}' AND t1.BKG_CUST_LAST_NM = '${lastName}'`;

  switch (resTimestamp.toUpperCase()) {
    case "EXACT":
      fullSql =
        fullSql +
        ` AND TRUNC( t1.RES_START_TMS ) = '${startTimestampIndicator}'`;
      break;

    case "BEFORE":
      fullSql =
        fullSql + ` AND t1.RES_START_TMS < '${startTimestampIndicator}'`;
      break;

    case "AFTER":
      fullSql =
        fullSql + ` AND t1.RES_START_TMS >= '${startTimestampIndicator}'`;
      break;
  }

  try {
    result = await sqlQuery.simpleExecute(fullSql.toUpperCase());
    return res.send(result.row[0]);
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
