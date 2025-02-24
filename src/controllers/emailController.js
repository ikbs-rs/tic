import sHelper from "../helpers/emailHelper.js";


const postFiskal = async (req, res) => {
  try {
    const requestBody = req.body || {};
    const objId = req.query.objId1||0;
    const item = await sHelper.postFiskal(objId, requestBody);
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

const postRacun = async (req, res) => {
  try {
    
    const requestBody = req.body || {};
    const item = await sHelper.postFiskal(requestBody);
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

const postMessage = async (req, res) => {
  try {
    
    const requestBody = req.body || {};
    const item = await sHelper.postFiskal(requestBody);
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

export default {
  postFiskal,
  postRacun,
  postMessage,
};
