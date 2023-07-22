import vModel from "../models/vModel.js";

const saltRounds = 10;

const getCmnLinkV = async (objName, lang) => {
  try {
    const result = await vModel.getCmnLinkV(objName, lang);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getLista = async (objName, stm, objId, lang) => {
  try {
    let result = {};
    switch (stm) {
      case "tic_agenda_v":
        result = await vModel.getAgendaL(objName, lang);
        break;
      case "tic_event_v":
        result = await vModel.getEventL(objName, lang);
        break;
      case "tic_eventlink_v":
        result = await vModel.getEventlinkL(objName, objId, lang);
        break;
      case "tic_eventatts_v":
        result = await vModel.getEventattsL(objName, objId, lang);
        break;
      case "tic_eventagenda_v":
        result = await vModel.getEventagendaL(objName, objId, lang);
        break;
      case "tic_eventloc_v":
        result = await vModel.getEventlocL(objName, objId, lang);
        break;
      case "cmn_obj_v":
        result = await vModel.getObjV(objName, lang);
        break;
      case "cmn_objtree_json_v":
        result = await vModel.getObjTree(objName, lang);
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

const getListaById = async (objName, stm, objId, lang) => {
  try {
    switch (stm) {
      case "cmn_objatts_v":
        var result = await vModel.getCmnObjattsV(objName, objId, lang);
        break;
      case "cmn_objlink_v":
        var result = await vModel.getCmnObjlinkV(objName, objId, lang);
        break;
      default:
        console.error("Pogresan naziv za view");
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  getCmnLinkV,
  getLista,
  getListaById,
};
