import express from "express";
import {checkPermissions} from "../../security/interceptors.js";
import esirController from "../../controllers/esirController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
    router.post("/invoices", checkPermissions(), esirController.postEsirInvoices);   
    next();
});

export default router;