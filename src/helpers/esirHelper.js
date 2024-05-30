import esirUtil from "../middleware/esirUtil.js";
import Esir from "../models/Esir.js";

let settingsInitialized = null;

const checkSettings = () => {
    if (settingsInitialized == null) {
        setEsirSettings().then(() => settingsInitialized = true);
    }
}

const setEsirSettings = async () => {
    // Setup ESIR settings
    let certBase64; // todo ESIR_CERT_BASE64 ? ESIR_CERT_BASE64 : loadCertificate(__DIR__ . '/' . ESIR_CERT_FILENAME);

    const ESIR_API_KLJUC = process.env.ESIR_API_KLJUC;
    const ESIR_SETTINGS_URL = process.env.ESIR_SETTINGS_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${ESIR_API_KLJUC}`
        }
    };

    let currentSettings = await Esir.getEsirSettings(ESIR_SETTINGS_URL, config);
    let newSettings = {};

    if (currentSettings?.vpfrEnabled !== true) {
        newSettings.vpfrEnabled = true;
    }

    if (currentSettings?.vpfrClientCertificateBase64 !== certBase64) {
        newSettings.vpfrClientCertificateBase64 = certBase64;
    }

    if (currentSettings?.vpfrClientCertificatePassword !== process.env.ESIR_CERT_PASSWORD) {
        newSettings.vpfrClientCertificatePassword = process.env.ESIR_CERT_PASSWORD;
    }

    if (currentSettings?.vpfrPac !== process.env.ESIR_CERT_PAC) {
        newSettings.vpfrPac = process.env.ESIR_CERT_PAC;
    }

    if (Object.values(newSettings)?.length > 0) {
        // todo no response? but we should check if 200 OK was returned
        await Esir.setEsirSettings(ESIR_SETTINGS_URL, newSettings, config);
    }
}

const postEsirInvoices = async (pBody) => {
    try {
        // check settings
        checkSettings();

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