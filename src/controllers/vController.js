import vHelper from "../helpers/vHelper.js";


const getCmnLinkV = async (req, res) => {
  try {
    const item = await vHelper.getCmnLinkV( req.objName, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getCmnLinkV vController ${req.objName}`, error: err.message });
  }
};

const getLista = async (req, res) => {
  //try {
    console.log(req.query, "*******************")
    const item = await vHelper.getLista( req.objName, req.query.stm, req.query.objid, req.query.sl||'en');
    res.status(200).json({ item }); 
/*  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getLista vController ${req.objName}`, error: err.message });
  }*/
};

const getListaC = async (req, res) => {
  try {
    const item = await vHelper.getListaC( req.objName, req.query.stm, req.query.sqlstmt, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getLista vController ${req.objName}`, error: err.message });
  }
};

const getListaById = async (req, res) => {
  try {
    const item = await vHelper.getListaById( req.objName, req.query.stm, req.query.id, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getListaById vController ${req.objName}`, error: err.message });
  }
};

const getListaByText = async (req, res) => {
  try {
    const item = await vHelper.getListaByText( req.objname, req.query.stm, req.query.item, req.query.id, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getListaByTxt vController ${req.objName}`, error: err.message });
  }
};

const getListaByNum = async (req, res) => {
  try {
    const item = await vHelper.getListaByNum( req.objname, req.query.stm, req.query.item, req.query.id, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getListaByNum vController ${req.objName}`, error: err.message });
  }
};

const getListaByNum2 = async (req, res) => {
  try {
    const item = await vHelper.getListaByNum2( req.objname, req.query.stm, req.query.item1, req.query.id1, req.query.item2, req.query.id2, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getListaByNum vController ${req.objName}`, error: err.message });
  }
};

export default {
  getCmnLinkV,
  getLista,
  getListaC,
  getListaById,
  getListaByText,
  getListaByNum,
  getListaByNum2
};
