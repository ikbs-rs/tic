import axios from "axios";

const getEsirSettings = async (url, config) => {
  const rows = await axios.get(url, config);
  return rows
};

const setEsirSettings = async (url, body, config) => {
  const rows = await axios.post(url, body, config);
  return rows
};

const postEsirInvoices = async (url, body, config) => {
  const rows = await axios.post(url, body, config);
  return rows
};

export default {
  getEsirSettings,
  setEsirSettings,
  postEsirInvoices,
};