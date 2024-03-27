import express from "express";
import {checkPermissions} from "../../security/interceptors.js";
import axios from "axios";
import esirUtil from "../../middleware/esirUtil.js";

const router = express.Router();

router.use("/", (req, res, next) => {
    router.post("/invoices", checkPermissions(), async () => {
        try {
            console.log("ESIR_API_KLJUC")
            const ESIR_API_KLJUC = process.env.ESIR_API_KLJUC;
            const config = {
                headers: {
                    Authorization: `Bearer ${ESIR_API_KLJUC}`
                }
            };

            // todo call esir
            const ESIR_INVOICES_URL = process.env.ESIR_INVOICES_URL;
            const body = esirUtil.assembleEsirInvoicesRequestBody(req.body);
            const esirInvoicesResponse = await axios.post(`${ESIR_INVOICES_URL}`, body, config);
            res.status(200).json({data: esirUtil.assembleEsirInvoicesResponse(esirInvoicesResponse)});
        } catch (err) {
            //todo ovde bi trebalo da upande status 400
            res.status(500).json({message: `Doslo je do greske  ${req.objName}`, error: err.message});
        }
    });
    next();
});

export default router;