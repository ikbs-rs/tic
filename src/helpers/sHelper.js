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
  par2,
  par3,
  requestBody
) => {
  try {
    console.log(par1, "* par1 ******Helper*********", stm);
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
      case "tic_grpeventart_s":
        result = await sModel.copyGrpEventart(objId1, par1, requestBody);
        break;
      case "tic_grpeventloc_s":
        result = await sModel.copyGrpEventloc(objId1, par1, par2, par3, begda, endda, requestBody);
        break;
      case "tic_grpeventlocl_s":
        result = await sModel.copyGrpEventlocl(objId1, par1, par2, par3, begda, endda, requestBody, objId2);
        break;
      case "tic_tpeventloc_s":
        result = await sModel.copyTpEventloc(objId1, par1, requestBody);
        break;
      case "tic_copyeventatts_s":
        result = await sModel.copyEventatts(objId1, requestBody);
        break;
      case "tic_prodaja_s": // obrada zaglavlja na prodaji 
        result = await sModel.obradaProdaja(par1, par2, requestBody);
        break;
      case "tic_prodajas_s": // obrada stavke na prodaji
        result = await sModel.obradaProdajas(par1, par2);
        break;
      case "tic_docssetservice_s": // obrada stavke na prodaji
        result = await sModel.docSetService(requestBody);
        break;
      case "tic_docsetcancel_s": // obrada stavke na prodaji
        result = await sModel.docSetCancelService(objId1);
        break;
      case "tic_eventcopy_s": // obrada stavke na prodaji
        result = await sModel.ticEventCopy(requestBody);
        break;
      case "tic_eventdeleteall_s": // obrada stavke na prodaji
        result = await sModel.ticEventDeleteAll(objId1);
        break;
      case "tic_eventsavedate_s": // obrada stavke na prodaji
        result = await sModel.ticEventSaveDate(requestBody);
        break;
      case "tic_set_s": // obrada stavke na prodaji
        result = await sModel.ticSetItem(par1, par2, requestBody);
        break;
      case "tic_setvalue_s": // obrada stavke na prodaji
        result = await sModel.ticSetValue(par1, par2, objId1, objId2);
        break;
      case "tic_docstorno_s": // obrada stavke na prodaji
        result = await sModel.ticDocstorno(par1, par2, objId1, requestBody, lang)
        break;
      case "tic_docsuidpar_s": // obrada stavke na prodaji
        result = await sModel.ticDocsuidPar(objId1, requestBody, lang)
        break;
        case "tic_docsuidposetilac_s": // obrada stavke na prodaji
        result = await sModel.ticDocsuidPosetilac(objId1, requestBody, lang)
        break;        
      case "tic_docsuidparall_s": // obrada stavke na prodaji
        result = await sModel.ticDocsuidParAll(objId1, requestBody, lang)
        break;
      case "tic_docsuidparallnull_s": // obrada stavke na prodaji
        result = await sModel.ticDocsuidParAllNull(objId1, requestBody, lang)
        break;
      case "tic_docsuidparnull_s":
        result = await sModel.ticDocsuidParNull(objId1, requestBody, lang)
        break;
      case "tic_docsdiscountall_s":
        result = await sModel.ticDocdiscountAll(objId1, requestBody, lang)
        break;
      case "tic_deldocsdiscounteventall_s":
        result = await sModel.ticDelDocdiscountEventAll(objId1, requestBody, lang)
        break;
      case "tic_deldocsdiscountall_s":
        result = await sModel.ticDelDocdiscountAll(objId1, requestBody, lang)
        break;
      case "tic_docpayments_s":
        result = await sModel.ticDocpayments(requestBody, lang)
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
