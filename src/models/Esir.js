import axios from "axios";

const postEsirInvoices = async (url, body, config) => {
  const rows = await axios.post(`${url}`, body, config);
  return rows
};

export default {
  postEsirInvoices,
};
