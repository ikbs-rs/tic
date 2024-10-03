import express from "express";
import {checkPermissionsAllSecure} from "../../security/interceptors.js";
import paymentPostbackController from "../../controllers/paymentPostbackController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
    console.log("DOSAO 0000001")
    router.post("/allsecure", checkPermissionsAllSecure(), paymentPostbackController.postback);   
    next();
});

export default router;