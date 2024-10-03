import axios from "axios";

const sendDebitTransaction = async (url, body, config) => {
  const rows = await axios.post(url, body, config);
  return rows
};

export default {
    sendDebitTransaction
};