import sModel from "../models/sModel.js";

const saltRounds = 10;

const getLista2 = async (objName, stm, objId, objId1, lang) => {
  try {
    console.log("*******HelperGetLista2*********", stm);
    let result = {};
    switch (stm) {
      case "tic_eventartcena_v":
        result = await sModel.getEventartCena(objName, objId, objId1, lang);
        break;
      default:
        console.error("vHelper: Pogresan naziv za view-a");
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getLista = async (objName, stm, objId, lang) => {
  try {
    console.log("*******Helper*********", stm);
    let result = {};
    switch (stm) {
      case "tic_art_v":
        result = await sModel.getAgendaL(objName, lang);
        break;
      case "tic_eventlink_v":
        result = await sModel.getArtL(objName, objId, lang);
        break;
      case "tic_eventcena_v":
        result = await sModel.getEventCena(objName, objId, lang);
        break;
      default:
        console.error("vHelper: Pogresan naziv za view-a");
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const postFunction = async (
  att,
  objName1,
  objName2,
  objId1,
  objId2,
  stm,
  begda,
  endda,
  lang,
  par1,
  requestBody
) => {
  try {
    console.log("*******Helper*********", stm);
    let result = {};
    switch (stm) {
      case "tic_eventtpatt_s":
        result = await sModel.postFunction(
          att,
          objName1,
          objName2,
          objId1,
          objId2,
          stm,
          lang
        );
        break;
      case "tic_autoeventatts_s":
        result = await sModel.autoEventatts(objId1);
        break;
      case "tic_copyevent_s":
        result = await sModel.copyEvent(objId1, objId2, begda, endda);
        break;
      case "tic_copyeventsettings_s":
        result = await sModel.copyEventSettings(objId1, objId2, begda, endda);
        break;
      case "tic_activateevent_s":
        result = await sModel.activateEvent(objId1);
        break;
      case "tic_grpeventatts_s":
        result = await sModel.copyGrpEvent(objId1, par1, requestBody);
        break;
      case "tic_tpeventloc_s":
        result = await sModel.copyTpEventloc(objId1, par1, requestBody);
        break;
      case "tic_copyeventatts_s":
        result = await sModel.copyEventatts(objId1, requestBody);
        break;
      default:
        console.error("sHelper: Pogresan naziv za view-a - " + stm);
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  getLista,
  postFunction,
  getLista2,
};
