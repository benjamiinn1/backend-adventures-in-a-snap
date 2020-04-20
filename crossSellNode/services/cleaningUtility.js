const sqlQuery = require("./database");
const cleanNulls = async rows => {
  try {
    let objecList = [];
    let resIdList = [];
    if (rows.length > 50) {
      return { msg: "Narrow down your search." };
    }
    const removeNull = JSON.parse(JSON.stringify(rows, replacer));
    for (row of removeNull) {
      let objec = {};
      const {
        BKG_CUST_LAST_NM,
        BKG_CUST_FIRST_NM,
        DRVR_FIRST_NM,
        DRVR_LAST_NM,
        PHONE_NBR,
        CNTRY_IATA_CD,
        PRIME_PHONE_TYPE_CD,
        ELEC_CONTACT_ADDR_TXT
      } = row;
      const {
        RES_CONFRM_ID,
        RES_BKG_TMS,
        VNDR_CD,
        TRAVEL_RES_TYPE_CD,
        RES_START_TMS,
        RES_END_TMS,
        RES_START_LOC_TXT,
        RES_END_LOC_TXT,
        RES_STATUS_CD,
        TRAVEL_RES_CURNCY_CD,
        BASE_PRICE_AMT,
        TAX_AMT,
        RES_CANCEL_ID,
        RES_CANCEL_TMS,
        CAR_RENTAL_VEHICLE_CATG_CD,
        CAR_RENTAL_VEHICLE_SIZE_CD,
        CAR_RENTAL_RATE_CATG_CD,
        CAR_RENTAL_RATE_QUALFR_CD,
        REFRAL_LINK_ID,
        ARVL_FLIGHT_NBR,
        ARVL_CXR_CD
      } = row;
      // BUILD CUST INFO
      objec.resCustomerInfo = {};
      objec.resCustomerInfo.BkgCustomerFstName = BKG_CUST_FIRST_NM;
      objec.resCustomerInfo.BkgCustomerLstName = BKG_CUST_LAST_NM;
      objec.resCustomerInfo.DriverFstName = DRVR_FIRST_NM;
      objec.resCustomerInfo.DriverLstName = DRVR_LAST_NM;
      objec.resCustomerInfo.CustomerPhoneNbr = PHONE_NBR;
      objec.resCustomerInfo.CustomerPhoneCntryCd = CNTRY_IATA_CD;
      objec.resCustomerInfo.CustomerPhoneType = PRIME_PHONE_TYPE_CD;
      objec.resCustomerInfo.CustomerEmail = ELEC_CONTACT_ADDR_TXT;

      // BUILD TRAVEL RES INFO
      objec.TravelResInfo = {};
      objec.TravelResInfo.ReservationID = RES_CONFRM_ID;
      objec.TravelResInfo.ReservationTimestamp = RES_BKG_TMS;
      objec.TravelResInfo.VenderId = VNDR_CD;
      objec.TravelResInfo.ReservationTypeCd = TRAVEL_RES_TYPE_CD;
      objec.TravelResInfo.ReservationStartTimestamp = RES_START_TMS;
      objec.TravelResInfo.ReservationEndTimestamp = RES_END_TMS;
      objec.TravelResInfo.ReservationStartLocation = RES_START_LOC_TXT;
      objec.TravelResInfo.ReservationEndLocation = RES_END_LOC_TXT;
      objec.TravelResInfo.ReservationStatus = RES_STATUS_CD;
      objec.TravelResInfo.ReservationCurncyCd = TRAVEL_RES_CURNCY_CD;
      objec.TravelResInfo.ReservationBasePrice = BASE_PRICE_AMT;
      objec.TravelResInfo.ReservationTax = TAX_AMT;
      objec.TravelResInfo.ReservationCancellId = RES_CANCEL_ID;
      objec.TravelResInfo.ReservationCancellTimestamp = RES_CANCEL_TMS;
      objec.TravelResInfo.CarRentalVehicleCategoryCd = CAR_RENTAL_VEHICLE_CATG_CD;
      objec.TravelResInfo.CarRentalVehicleSizeCd = CAR_RENTAL_VEHICLE_SIZE_CD;
      objec.TravelResInfo.CarRentalRateCategoryCd = CAR_RENTAL_RATE_CATG_CD;
      objec.TravelResInfo.CarRentalRateQualfrCd = CAR_RENTAL_RATE_QUALFR_CD;
      objec.TravelResInfo.ReferralLinkId = REFRAL_LINK_ID;
      objec.TravelResInfo.ArrivalFlightNumber = ARVL_FLIGHT_NBR;
      objec.TravelResInfo.ArrivalFlightCarrierCode = ARVL_CXR_CD;
      objec.TravelResInfo.Ancilary = [];
      objecList.push(objec);

      // Build ResId List to check for ancilary equipment
      resIdList.push(RES_CONFRM_ID);
    }
    // this is where we build the sql for anc table
    let asc = "";
    for (let i = 0; i < resIdList.length; i++) {
      if (i == resIdList.length - 1) {
        asc = asc + `'${resIdList[i]}'`;
      } else {
        asc = asc + `'${resIdList[i]}',`;
      }
    }
    const anc = `select * from ECDD_CAR_RENTAL_ANCLRY_EQP_RES where RES_CONFRM_ID in (${asc})`;
    const result = await callDb(anc);
    // takes the anclry list and adds equipment to resObjects
    for (let y = 0; y < objecList.length; y++) {
      for (item of result) {
        if (item.resConfId == objecList[y].TravelResInfo.ReservationID) {
          objecList[y].TravelResInfo.Ancilary.push({
            EquipmentCode: item.EquipmentCode,
            EquipmentQuantity: item.EquipmentQuantity
          });
        }
      }
    }
    return objecList;
  } catch {
    return { msg: "no results" };
  }
};

const replacer = (key, value) => {
  // Filtering out properties
  if (value === null) {
    return undefined;
  }
  return value;
};

// Builds a list of anclry
const callDb = async query => {
  let ancArr = [];
  const result = await sqlQuery.simpleExecute(query.toUpperCase());
  const removeNullAnc = JSON.parse(JSON.stringify(result.rows, replacer));
  for (let i = 0; i < removeNullAnc.length; i++) {
    const {
      RES_CONFRM_ID,
      CAR_RENTAL_ANCLRY_EQUIP_CD,
      CAR_RENTAL_ANCLRY_EQUIP_QTY
    } = removeNullAnc[i];
    ancArr.push({
      resConfId: RES_CONFRM_ID,
      EquipmentCode: CAR_RENTAL_ANCLRY_EQUIP_CD,
      EquipmentQuantity: CAR_RENTAL_ANCLRY_EQUIP_QTY
    });
  }
  //   console.log(ancArr);
  return ancArr;
};

module.exports = cleanNulls;
