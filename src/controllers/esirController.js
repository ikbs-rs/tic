import esirHelper from "../helpers/esirHelper.js";

const postEsirInvoices = async (req, res) => {
  try {
  
    const item = await esirHelper.postEsirInvoices(req.body);
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

export default {
  postEsirInvoices,
};
