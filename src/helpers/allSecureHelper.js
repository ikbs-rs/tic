import AllSecure from "../models/AllSecure.js";

const sendDebitTransaction = async (pBody) => {
    try {
        // check settings
        // checkSettings();

        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic dGlja2V0aW5nLWFwaTpBOEpKMmVjej9WNFRlLlJtVzE3b2UkZmRiTkt2cA=="
          };
        

        // const ESIR_API_KLJUC = process.env.ESIR_API_KLJUC;
        const config = {
            // headers: {
                // Authorization: `Bearer ${ESIR_API_KLJUC}`
            // }
            headers: headers,

        };
        // const ESIR_INVOICES_URL = process.env.ESIR_INVOICES_URL;
        // const body = esirUtil.assembleEsirInvoicesRequestBody(pBody);
        console.log("----- sendDebitTransaction -----");
        const result = await AllSecure.sendDebitTransaction("https://asxgw.paymentsandbox.cloud/api/v3/transaction/ticketing-simulator/debit", pBody, config);
        console.log("----- sendDebitTransaction result ----- ",result)
        return result.data;
    } catch (err) {
        console.log("sendDebitTransaction err ", err)
        throw new Error(`esirHelper - Greška u POST-u EsirInvoices: ${err.message}`);
    }
};

export default {
    sendDebitTransaction
};