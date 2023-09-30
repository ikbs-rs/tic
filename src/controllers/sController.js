import sHelper from "../helpers/sHelper.js";


const getLista = async (req, res) => {
  try {
    const item = await sHelper.getLista( req.objName, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getLista sController ${req.objName}`, error: err.message });
  }
};

const postFunction = async (req, res) => {
  try {
    const item = await sHelper.postFunction( req.att, req.objName1, req.objName2, req.objId1, req.objId2, req.stm, req.query.sl||'en' );
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

export default {
    getLista,
    postFunction,
};
