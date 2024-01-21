import express from "express";
import {checkPermissions} from "../../security/interceptors.js";
import axios from "axios";

const router = express.Router();

router.use("/", (req, res, next) => {
    router.post("/invoices", checkPermissions(), async () => {
        try {

            const ESIR_API_KLJUC = process.env.ESIR_API_KLJUC;

            const config = { headers: {
                Authorization: `Bearer ${ESIR_API_KLJUC}`
            }}



            // todo call esir
            const ESIR_INVOICES_URL = process.env.ESIR_INVOICES_URL;

            const items = req.body.tic_docs.map(tic_doc => {
                return {
                    gtin: tic_doc.id,       // (tic_docs.id)
                    labels: [
                        "A"
                    ],
                    name: tic_doc.art,// (tic_docs.art) -> tic_art.text
                    quantity: tic_doc.output,      // tic_docs.output
                    totalAmount: tic_doc.totalAmount, //??
                    unitPrice: tic_doc.price   // tic_docs.price
                }
            });

            const payment = [
                {
                    "amount": req?.body?.amount,   // Ovo mora da se izracuna
                    "paymentType": "Card"
                }
            ];

            const body = {
                advancePaid: null,  //?? Koristi se za izdavanje zavrsnog avansnog racuna, opcioni parametar, sadrzi ukupno placeni avans
                advanceTax: null,  //?? Koristi se za izdavanje zavrsnog avansnog racuna, opcioni parametar, sadrzi vrednost poreza na avans
                invoiceRequest: {
                    buyerCostCenterId: req?.body?.buyerCostCenterId, //??
                    buyerId: req?.body?.userId,//??
                    cashier: req?.body?.cashier,//??
                    dateAndTimeOfIssue: req?.body?.date,  //tic_doc.date
                    invoiceNumber: req?.body?.broj,     //tic_doc.broj
                    invoiceType: "Normal", //??
                    referentDocumentDT: null,     //?
                    referentDocumentNumber: null,     //?
                    transactionType: "Sale", //??
                    items: items,
                    payment: payment
                }
            };


            const esirResponse = await axios.post(`${ESIR_INVOICES_URL}`, body, config);

            //esirResponse: invoiceImagePngBase64

            res.status(200).json({data: esirResponse});
        } catch (err) {
            //todo ovde bi trebalo da upande status 400
            res.status(500).json({message: `Doslo je do greske  ${req.objName}`, error: err.message});
        }
    });
    next();
});

export default router;