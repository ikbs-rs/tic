import Esir from "../models/Esir.js"
import esirUtil from "../middleware/esirUtil.js";

const postEsirInvoices = async (pBody) => {
    try {
        const ESIR_API_KLJUC = process.env.ESIR_API_KLJUC;
        const config = {
            headers: {
                Authorization: `Bearer ${ESIR_API_KLJUC}`
            }
        };
        const ESIR_INVOICES_URL = process.env.ESIR_INVOICES_URL;
        const body = esirUtil.assembleEsirInvoicesRequestBody(pBody);
        const result = await Esir.postEsirInvoices(ESIR_INVOICES_URL, body, config);
  
        return result.data;
    } catch (err) {
        throw new Error(`esirHelper - Greška u POST-u EsirInvoices: ${err.message}`);
    }
};

export default {
    postEsirInvoices,
};