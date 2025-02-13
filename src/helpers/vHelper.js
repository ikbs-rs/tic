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

const getListaC = async (objName, stm, sqlstmt, lang) => {
  try {
    const result = await vModel.getCmnLinkV(objName, sqlstmt, lang);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getLista = async (objName, stm, objId, par1, par2, lang, par3, par4, par5, par6, par7, par8, par9, par10) => {
  try {
    // console.log(objId, "*******Helper!!!!!!*********", stm);
    // console.log(objName, stm, objId, par1, par2, lang, par3, par4, par5, par6, par7, par8, par9, par10, '5555555555555555555555555555555555555555555555555555555555555555555555555555555555')
    let result = {};
    switch (stm) {
      case "tic_agenda_v":
        result = await vModel.getAgendaL(objName, lang);
        break;
      case "tic_art_v":
        result = await vModel.getArtL(objName, lang);
        break;
      case "tic_artloc_v":
        result = await vModel.getArtlocL(objName, objId, lang);
        break;
      case "tic_artcena_v":
        result = await vModel.getArtcenaL(objName, objId, lang);
        break;
      case "tic_artlink_v":
        result = await vModel.getArtlinkL(objName, objId, lang);
        break;
      case "tic_docpayment_v":
        result = await vModel.getDocpaymentL(objName, objId, lang);
        break;
      case "tic_eventart_v":
        result = await vModel.getEventartL(objName, objId, lang);
        break;
      case "tic_eventartulaz_v":
        result = await vModel.getEventartulazL(objName, objId, lang);
        break;
      case "tic_eventartlink_v":
        result = await vModel.getEventartlinkL(objName, objId, lang);
        break;
      case "tic_eventart_opt_v":
        result = await vModel.getEventartOptL(objName, objId, lang);
        break;
      case "tic_locart_v":
        result = await vModel.getLocartL(objName, objId, lang);
        break;
      case "tic_cena_v":
        result = await vModel.getCenaL(objName, lang);
        break;
      case "tic_docvr_v":
        result = await vModel.getDocvrL(objName, lang);
        break;
      case "tic_transaction_v":
        result = await vModel.getTransactionL(objName, lang, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10);
        break;
      case "tic_transactionf_v":
        result = await vModel.getTransactionFL(objName, lang, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10);
        break;
      case "tic_docs_v":
        result = await vModel.getDocsL(objName, objId, lang);
        break;
      case "tic_stampa_v":
        result = await vModel.getStampaL(objId, lang);
        break;
      case "tic_docsartikli_v":
        result = await vModel.getDocsArtikliL(objName, objId, lang);
        break;
      case "tic_docseventartcena_v":
        result = await vModel.getDocsEventartcenaL(objName, objId, lang);
        break;
      case "tic_docsartikliprint_v":
        result = await vModel.getDocsArtikliPrintL(objName, objId, lang);
        break;
      case "tic_docsnaknade_v":
        result = await vModel.getDocsNaknadeL(objName, objId, lang);
        break;
      case "tic_event_v":
        result = await vModel.getEventL(objName, lang);
        break;
      case "tic_eventtmp_v":
        result = await vModel.getEventTmpL(objName, lang);
        break;
      case "tic_eventprodaja_v":
        result = await vModel.getEventProdajaL(objName, lang);
        break;
      case "tic_eventlink_v":
        result = await vModel.getEventlinkL(objName, objId, lang);
        break;
      case "tic_eventcena_v":
        result = await vModel.getEventCena(objName, objId, lang);
        break;
      case "tic_eventartcena_v":
        result = await vModel.getEventartcenaL(objName, objId, lang);
        break;
      case "tic_eventartcenat_v":
        result = await vModel.getEventartcenaTL(objName, objId, par1, lang);
        break;
      case "tic_eventobj_v":
        result = await vModel.getEventobjL(objName, objId, lang);
        break;
      case "tic_eventatt_v":
        result = await vModel.getEventattL(objName, lang);
        break;
      case "tic_eventattg_v":
        result = await vModel.getEventattgL(objName, lang);
        break;
      case "tic_eventatts_v":
        result = await vModel.getEventattsL(objName, objId, lang);
        break;
      case "tic_eventattsdd_v":
        result = await vModel.getEventattsddL(objName, objId, par1, par2, lang);
        break;
      case "tic_eventview_v":
        result = await vModel.getEventView(objId, par1, lang);
        break;
      case "tic_eventattstp_v":
        result = await vModel.getEventattstpL(objName, objId, par1, lang);
        break;
      case "tic_eventclszgr_v":
        result = await vModel.getEventclszgrL(objId, lang);
        break;
      case "tic_eventdocsclsz_v":
        result = await vModel.getEventdocsclszL(objId, lang);
        break;
      /****** */
      case "tic_eventattscodevaluel_v":
        result = await vModel.getEventattsCodeValueL(objName, objId, par1, lang);
        break;
      case "tic_eventtps_v":
        result = await vModel.getEventtpsL(objName, objId, lang);
        break;
      case "tic_eventagenda_v":
        result = await vModel.getEventagendaL(objName, objId, lang);
        break;
      case "tic_eventloc_v":
        result = await vModel.getEventlocL(objName, objId, lang);
        break;
      case "tic_eventloctp_v":
        result = await vModel.getEventlocTpL(objName, objId, par1, lang);
        break;
      case "tic_doc_log_v":
        result = await vModel.getDoc_logL(par1, par2, par3, lang);
        break;
      case "tic_eventcenatp_v":
        result = await vModel.getEventcenatpL(objName, objId, lang);
        break;
      case "cmn_obj_v":
        result = await vModel.getObjV(objName, lang);
        break;
      case "tic_privilege_v":
        result = await vModel.getPrivilegeL(objName, lang);
        break;
      case "tic_privilegediscount_v":
        result = await vModel.getPrivilegediscountL(objName, objId, lang);
        break;
      case "tic_privilegelink_v":
        result = await vModel.getPrivilegelinkL(objName, objId, lang);
        break;
      case "tic_privilegecond_v":
        result = await vModel.getPrivilegecondL(objName, objId, lang);
        break;
      case "tic_parprivilege_v":
        result = await vModel.getParprivilegeL(objName, objId, lang);
        break;
      case "tic_discount_v":
        result = await vModel.getDiscountL(objName, lang);
        break;
      case "tic_seat_v":
        result = await vModel.getSeatL(objName, lang);
        break;
      case "tic_eventst_v":
        result = await vModel.getEventstL(objName, objId, lang);
        break;
      case "cmn_objtree_json_v":
        result = await vModel.getObjTree(objName, lang);
        break;
      case "tic_docdelivery_v":
        result = await vModel.getDocdeliveryL(objName, objId, lang);
        break;
      case "tic_docdeliveryl_v":
        result = await vModel.getDocdeliveryLL(objName, objId, lang);
        break;
      case "tic_docdiscounttp_v":
        result = await vModel.getDocdiscounttpL(objName, objId, lang);
        break;
      case "tic_docsdiscounttp_v":
        result = await vModel.getDocsdiscounttpL(objName, objId, lang);
        break
      case "tic_docdiscount_v":
        result = await vModel.getDocdiscountL(objName, objId, lang);
        break;
      case "tic_eventattsdds_v":
        result = await vModel.getEventAttsDDL(objName, objId, par1, lang);
        break;
      case "tic_locll_v":
        result = await vModel.getLocLLV(objName, objId, par1, lang);
        break;
      case "tic_loclinkll_v":
        result = await vModel.getTicLoclinkV(objName, objId, par1, lang);
        break;
      case "tic_eventchpermiss_v":
        result = await vModel.getTicEventchpermissV(objName, objId, par1, lang);
        break;
      case "tic_printgrp_v":
        result = await vModel.getTicPrintgrpV(objId, par1, lang);
        break;
      case "tic_eventpregledv_v":
        result = await vModel.getTicEventPregledVV(objId, par1, lang);
        break;
      case "tic_chpermiss_v":
        result = await vModel.getTicChpermissV(par1, lang);
        break;
      case "tic_docactivuser_v":
        result = await vModel.getTicDocActivUser(objName, objId, lang);
        break;
      case "tic_docsuidprodaja_v":
        result = await vModel.getDocsuidProdajaLista(objName, objId, lang);
        break;
      case "tic_eventattsobjcodel_v":
        result = await vModel.getEventattsobjcodeL(objId, par1, par2, lang);
        break;
      case "tic_doczbirniiznos_v":
        result = await vModel.getDocZbirniiznosL(objId);
        break;
      case "tic_docshavediscount_v":
        result = await vModel.getTicDocHaveDiscountV(objId, par1, lang);
        break;
      case "tic_docsdiscountl_v":
        result = await vModel.getTicDocsdiscountL(objId, lang);
        break;
      case "tic_eventatts11l_v":
        result = await vModel.getTicEventatts11V(objId, par1, lang);
        break;
      case "tic_docdiscountvalue_v":
        result = await vModel.getTicDocsdiscountvalue(objId, lang);
        break;
      case "tic_docpayments_v":
        result = await vModel.getDocPaymentS(objId, lang);
        break;
      case "tic_doccountprint_v":
        result = await vModel.getCountPrint(objId, lang);
        break;
      case "tic_doccountpay_v":
        result = await vModel.getCountPay(objId, lang);
        break;
      case "tic_osnovni1izvl_v":
        result = await vModel.getOsnovni1IzvL(objId, lang);
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

const getFunction = async (objName, stm, eventid, objid, dat, dattm, lang) => {
  try {
    switch (stm) {
      case "tic_artpricecurr_f":
        var result = await vModel.getTicartpricecurrF(
          objName,
          eventid,
          objid,
          lang
        );
        break;
      case "tic_arttgpratecurr_f":
        var result = await vModel.getTicarttgpratecurrF(
          objName,
          eventid,
          objid,
          lang
        );
        break;
      case "tic_pardiscountcurr_f":
        var result = await vModel.getTicpardiscountcurrF(
          objName,
          eventid,
          objid,
          lang
        );
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

const getListaByText = async (objName, stm, item, objId, lang) => {
  try {
    switch (stm) {
      case "cmn_spedicija_v":
        var result = await vModel.getCmnSpedicijaByTxtV(objName, item, objId, lang);
        break;
      case "cmn_channel_v":
        var result = await vModel.getChannelByTxtV(objName, item, objId, lang);
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

const getListaByNum = async (objName, stm, item, objId, lang) => {
  try {
    switch (stm) {
      case "tic_docbynum_v":
        var result = await vModel.getTicDocByNumV(item, objId, lang);
        break;
      case "tic_docsbynum_v":
        var result = await vModel.getTicDocsByNumV(item, objId, lang);
        break;
      case "tic_docdelivery_v":
        var result = await vModel.getTicDocdeliveryByNumV(item, objId, lang);
        break;
      case "tic_docpayment_v":
        var result = await vModel.getTicDocpaymentByNumV(item, objId, lang);
      case "tic_transactions_v":
        var result = await vModel.getTransactionsByNumV(item, objId, lang);
        break;
      default:
        console.error("Pogresan naziv za view, getListaByNum");
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getListaByNum2 = async (
  objName,
  stm,
  item1,
  objId1,
  item2,
  objId2,
  lang
) => {
  try {
    switch (stm) {
      case "tic_docbynum_v":
        var result = await vModel.getTicDocByNumV2(
          item1,
          objId1,
          item2,
          objId2,
          lang
        );
        break;
      default:
        console.error("Pogresan naziv za view, getListaByNum");
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  getListaC,
  getCmnLinkV,
  getLista,
  getFunction,
  getListaById,
  getListaByText,
  getListaByNum,
  getListaByNum2,
};
