const express = require("express");
const router = express();
const cleaningUtil = require("../../services/cleaningUtility");
const sqlQuery = require("../../services/database");
router.use(express.json({ extended: false }));

// const sql = `select t1.BKG_CUST_FIRST_NM as BkgCustomerFstName, t1.BKG_CUST_LAST_NM, t2.DRVR_FIRST_NM, t2.DRVR_LAST_NM, t3.PHONE_NBR,
// t3.CNTRY_IATA_CD, t1.PRIME_PHONE_TYPE_CD, t1.ELEC_CONTACT_ADDR_TXT, t1.BKNG_LYLTY_ACCT_ID, t1.BKNG_LYLTY_ACCT_OWN_AIRLN_CD, t1.RES_CONFRM_ID,t1.RES_START_LOC_TXT,
// t1.RES_START_TMS,t1.VNDR_CD,t2.CAR_RENTAL_VEHICLE_CATG_CD,t1.RES_STATUS_CD from
// ECDD_TRAVEL_RES t1, ECDD_CAR_RENTAL_RES t2, ECDD_PHONE t3
// where t1.RES_CONFRM_ID = t2.RES_CONFRM_ID AND t1.RES_BKG_TMS = t2.RES_BKG_TMS AND t1.prime_phone_id = t3.phone_id `;

// const sql = `SELECT * FROM ECDD_TRAVEL_RES t1 LEFT JOIN ECDD_CAR_RENTAL_ANCLRY_EQP_RES t4
// ON t1.RES_CONFRM_ID = t4.RES_CONFRM_ID,  ECDD_CAR_RENTAL_RES t2, ECDD_PHONE t3
// where t1.RES_CONFRM_ID = t2.RES_CONFRM_ID
// AND t1.RES_BKG_TMS = t2.RES_BKG_TMS
// AND t1.prime_phone_id = t3.phone_id `;

let listOfAnc;
const sql = `select * from
ECDD_TRAVEL_RES t1, ECDD_CAR_RENTAL_RES t2, ECDD_PHONE t3
where t1.RES_CONFRM_ID = t2.RES_CONFRM_ID AND t1.RES_BKG_TMS = t2.RES_BKG_TMS AND t1.prime_phone_id = t3.phone_id `;
const anc = `select * from ECDD_CAR_RENTAL_ANCLRY_EQP_RES t4 LEFT JOIN ECDD_TRAVEL_RES t1 ON t4.RES_CONFRM_ID IN (${listOfAnc}) `;
let fullSql;
let result;

router.post("/ResId", async (req, res) => {
  const { confirmId } = req.body;
  fullSql = sql + ` AND t1.RES_CONFRM_ID = '${confirmId}'`;
  result = await sqlQuery.simpleExecute(fullSql.toUpperCase());
  return res.send(await cleaningUtil(result.rows));
});

router.post("/Email", async (req, res) => {
  const { email } = req.body;
  fullSql = sql + ` AND t1.ELEC_CONTACT_ADDR_TXT = '${email}'`;
  result = await sqlQuery.simpleExecute(fullSql.toUpperCase());
  return res.send(await cleaningUtil(result.rows));
});

router.post("/Loyaltyinfo", async (req, res) => {
  const { loyaltyNumber, loyaltyAccountOwner } = req.body;
  fullSql =
    sql +
    ` AND t1.BKNG_LYLTY_ACCT_ID = '${loyaltyNumber}' AND t1.BKNG_LYLTY_ACCT_OWN_AIRLN_CD = '${loyaltyAccountOwner}'`;
  // return res.send(fullSql.toUpperCase());
  result = await sqlQuery.simpleExecute(fullSql.toUpperCase());
  return res.send(await cleaningUtil(result.rows));
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
        fullSql + ` AND t1.RES_START_TMS = '${startTimestampIndicator}'`;
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
    return res.send(await cleaningUtil(result.rows));
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
