import abstractModel from "../models/Abstruct.js";
import { uniqueId, uniqiueUUID, transactionId, randomTenDigit } from "../middleware/utility.js";
import abstructQuery from "../middleware/model/abstructQuery.js";
import { getToken } from "../security/jwt/tokenJWT.js";
import bcrypt from "bcryptjs";

const saltRounds = 10

const add = async (objName, objData) => {
  try {
    // console.log(objData.id, "***********AbstructHelper****************")
    if (!objData.id || objData.id == null) {
      objData.id = await uniqueId();
      if (objName === "tic_doc") {
        objData.broj = await transactionId(objData.par);
      //   for (let i = 0; i < 50; i++) {
      //     const timestamp = Date.now().toString();
      //     console.log(`Broj ${i + 1}: ${timestamp} `,transactionId(objData.par));
      // }
      }
    }
    // Mozda mi ovo ne treba jer dolazi sa fronta !!!
    if (objName === "adm_user") {
      const hashedPassword = await bcrypt.hash(objData.password, saltRounds);
      objData.password = hashedPassword;
    }
    // Mozda mi ovo ne treba jer dolazi sa fronta !!!
    // console.log(objName, "@ 00 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", objData)
    if (objName === "tic_doc") {
      const pBroj = await randomTenDigit(objData.id)
      objData.broj = pBroj;
    }
    // console.log(objName, "@ 01 @@@@@@@@@@@@@@@@@@@@@@@@ AB_HELPER 33 @@@@@@@@@@@@@@@@@@@@@@@@@@", objData.broj)

    const sqlQuery = await abstructQuery.getInsertQuery(objName, objData);

    const result = await abstractModel.add(sqlQuery);

    // console.log(sqlQuery, "@ 03 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", objData)

    if (objName === "tic_doc" || objName === "tic_eventatts") {
      return objData
    } else {
      return objData.id;
    } 
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAll = async (objName) => {
  try {
    const result = await abstractModel.find(objName);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getById = async (objName, id) => {
  try {
    const result = await abstractModel.findById(objName, id);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getByStext = async (objName, value) => {
  try {
    const result = await abstractModel.findByStext(objName, value);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (objName, objData) => {
  try {
    // console.log(objData, "***************11111111111111************", objName)
    const sqlQuery = await abstructQuery.getUpdateQuery(objName, objData);
    // console.log(objData, "***************2222222222222************", sqlQuery)
    const result = await abstractModel.update(sqlQuery);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const remove = async (objName, id) => {
  try {
    const result = await abstractModel.remove(objName, id);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
//******************************* */
const getItem = async (objName, item, objId) => {
  try {
    const result = await abstractModel.findItem(objName, item, objId);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getIdByItem = async (objName, item, itemValue) => {
  try {
    const result = await abstractModel.findIdbyItem(objName, item, itemValue);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const setItem = async (objName, item, items) => {
  try {
    const result = await abstractModel.setItem(objName, item, items);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//************************** */

const signup = async (objName, objData) => {
  try {
    objData.id = await uniqueId();
    const token = await getToken(objData.id, objData.username)
    const item = {
      id: objData.id,
      username: objData.username,
      token: token,
    };
    const user = await add(objName, objData);
    return item;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  add,
  getAll,
  getById,
  getByStext,
  update,
  remove,
  getItem,
  getIdByItem,
  setItem,
  signup,
};
