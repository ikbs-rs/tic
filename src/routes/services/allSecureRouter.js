import express from "express";
import { checkPermissions} from "../../security/interceptors.js";
import allSecureController from "../../controllers/allSecureController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
    router.post("/sendTransaction", checkPermissions(), allSecureController.sendDebitTransaction);   
    next();
});

export default router;