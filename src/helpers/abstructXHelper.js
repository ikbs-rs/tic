import abstractModel from "../models/AbstructX.js";
import { uniqueId } from "../middleware/utility.js";
import abstructQuery from "../middleware/model/abstructQuery.js";
import { getToken } from "../security/jwt/tokenJWT.js";
import bcrypt from "bcryptjs";

const saltRounds = 10

const add = async (objName, objData, lang) => {
  try {
    let objName1 = objName
    let objData1 = objData
    let objName2 = `${objName}x`    
    let objData2 = {}

    if (!objData1.id || objData1.id !== null) {
        objData1.id = await uniqueId();
    }
 
    objData2.id = await uniqueId();
    objData2.site = null
    objData2.tableid = objData1.id
    objData2.lang = lang ||'en'
    objData2.grammcase = 1
    objData2.text = objData1.text

    // Mozda mi ovo ne treba jer dolazi sa fronta !!!
    if (objName === "adm_user") {
      const hashedPassword = await bcrypt.hash(objData.password, saltRounds);
      objData.password = hashedPassword;
    }
    const sqlQuery1 = await abstructQuery.getInsertQuery(objName1, objData1);
    const sqlQuery2 = await abstructQuery.getInsertQuery(objName2, objData2);
    const result = await abstractModel.add(sqlQuery1, sqlQuery2);
    return objData1.id; //result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAll = async (objName, lang) => {
  try { 
    const result = await abstractModel.find(objName, lang);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getById = async (objName, lang, id) => {
  try {
    const result = await abstractModel.findById(objName, lang, id);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getByStext = async (objName, lang, value) => {
  try {
    const result = await abstractModel.findByStext(objName, lang, value);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (objName, objData, lang) => {
  try {

    const sqlQuery = await abstructQuery.getUpdateQueryX(objName, objData);
    const result = await abstractModel.update(sqlQuery, objName,  objData, lang);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const remove = async (objName, lang, id) => {
  try {
    const result = await abstractModel.remove(objName, lang, id);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
    //throw err;
  }
};
//******************************* */
const getItem = async (objName, lang, item, objId) => {
  try {
    const result = await abstractModel.findItem(objName, lang, item, objId);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getIdByItem = async (objName, lang, item, itemValue) => {
  try {
    const result = await abstractModel.findIdbyItem(objName, lang, item, itemValue);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllByItem = async (objName, lang, item, itemValue) => {
  try {
    const result = await abstractModel.findAllbyItem(objName, lang, item, itemValue);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const setItem = async (objName, lang, item, items) => {
  try {
    const result = await abstractModel.setItem(objName, lang, item, items);
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
  getAllByItem,
  setItem,
  signup,
};
