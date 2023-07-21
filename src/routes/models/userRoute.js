import express, { request, response } from "express";
import userController from "../../controllers/userController.js";

const router = express.Router();

router.post("/up", userController.signup);
router.post("/in", userController.signin);
router.post('/out', userController.signout);

export default router;