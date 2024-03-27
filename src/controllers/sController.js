import sHelper from "../helpers/sHelper.js";


const getLista = async (req, res) => {
  try {
    const item = await sHelper.getLista( req.objName, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getLista sController ${req.objName}`, error: err.message });
  }
};

const getLista2 = async (req, res) => {
  try {
    console.log(req.query, "*********getLista2**********")
    const item = await sHelper.getLista2( req.objName, req.query.stm, req.query.objid, req.query.objid1, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getLista vController ${req.objName}`, error: err.message });
  }
};

const postFunction = async (req, res) => {
  try {
    
    const requestBody = req.body || {};
    console.log(req.query, "*********postFunction**********")
    const item = await sHelper.postFunction( 
        req.query.att||0, 
        req.query.objName1||0, 
        req.query.objName2||0, 
        req.query.objId1||0, 
        req.query.objId2||0, 
        req.query.stm||0, 
        req.query.begda||0, 
        req.query.endda||0, 
        req.query.sl||'en',
        req.query.par1||null,
        req.query.par2||null,
        req.query.par3||null,
        requestBody
         );
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

export default {
    getLista,
    postFunction,
    getLista2,
};
