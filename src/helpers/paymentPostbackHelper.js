
const receivePostback = async (pBody) => {
    try {
        console.log("--- POSTBACK DATA ---", pBody)
        return {};
    } catch (err) {
        console.log("sendDebitTransaction err ", err)
        throw new Error(`esirHelper - Greška u POST-u EsirInvoices: ${err.message}`);
    }
};

export default {
    receivePostback
};