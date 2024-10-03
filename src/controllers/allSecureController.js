import allSecureHelper from "../helpers/allSecureHelper.js";

const sendDebitTransaction = async (req, res) => {
  try {

    const data = await allSecureHelper.sendDebitTransaction(req.body);
    res.status(200).json({ data }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

export default {
  sendDebitTransaction
};
