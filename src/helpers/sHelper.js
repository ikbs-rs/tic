import sModel from "../models/sModel.js";

const saltRounds = 10;

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
      default:
        console.error("vHelper: Pogresan naziv za view-a");
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  getLista,
};
