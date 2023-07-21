import express, { request, response } from "express";
import { checkPermissionsEx } from '../../security/interceptors.js'
import { decodeJWT } from '../../security/jwt/tokenJWT.js'

const router = express.Router();

router.post('/checkPermissions', async (req, res, next) => {
  checkPermissionsEx(req, res, next);
}); 
router.post('/checkJwt', async (req, res, next) => {
  checkPermissionsEx(req, res, next);
}); 
router.post('/decodeJwt', async (req, res, next) => {
  decodeJWT(req, res, next);
}); 

export default router;  