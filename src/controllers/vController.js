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
  try {
    const item = await vHelper.getLista( req.objName, req.query.stm, req.query.objid, req.query.sl||'en');
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

export default {
  getCmnLinkV,
  getLista,
  getListaById
};
