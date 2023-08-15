import sHelper from "../helpers/sHelper.js";


const getLista = async (req, res) => {
  try {
    const item = await sHelper.getLista( req.objName, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getCmnLinkV vController ${req.objName}`, error: err.message });
  }
};

export default {
    getLista,
};
