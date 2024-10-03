import paymentPostbackHelper from "../helpers/paymentPostbackHelper.js";

const postback = async (req, res) => {
  try {
    const data = await paymentPostbackHelper.receivePostback(req.body);
    res.status(200).json({ data }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske postFunction sController ${req.objName}`, error: err.message });
  }
};

export default {
  postback
};
