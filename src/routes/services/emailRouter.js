import express from "express";
// import {mailer }from "../../helpers/mailer.js";
import { checkPermissions} from "../../security/interceptors.js";
import emailController from "../../controllers/emailController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
    router.post("/fiskal", emailController.postFiskal);
    router.post("/racun", emailController.postRacun);   
    router.post("/message", emailController.postMessage); 
    next();
});

export default router;