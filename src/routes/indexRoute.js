import express from 'express'
import abstruct from './models/abstructRoute.js'
import abstructX from "./models/abstructXRoute.js";
import fileRouter from "./services/fileRouter.js";
import esirRouter from "./services/esirRouter.js";
import allSecureRouter from "./services/allSecureRouter.js"
import paymentPostbackRouter from "./services/paymentPostbackRouter.js"
//import servicesRoute from './services/servicesRoute.js'
import { checkJwt, checkPermissions, checkPermissionsEx, checkPermissionsAllSecure } from '../security/interceptors.js'

const router = express.Router();

//router.use(checkJwt); // provera JWT tokena na svakom zahtevu
router.use(express.json())

router.use("/", (req, res, next) => {
   console.log("Dosao u index");
  const urlParts = req.url.split("/");
  // Dohvatam iz URL-a, koju tabelu obradjujen i setuje --- req.objName ****** TABELU
  // .../adm/menu/... adm je modul a menu je tabela
  if (!(urlParts[2] === "services")||!(urlParts[2] === "x")) {
    req.objName = urlParts[1] + "_" + urlParts[2];
  } 
  if (urlParts[2] === "x") { // za tebele koje imaju visejezicku podrsku
    req.objName = urlParts[1] + "_" + urlParts[3];
  }
  console.log("Dosao u index");
  next();
});

router.use((req, res, next) => {
  console.log("----- REQ PATH -----", req.path);
  if (req.path.startsWith("/adm/services/sign") || req.path.startsWith("/postback")) {
    return next();
  }
  console.log("Pre checkJwt");
  checkJwt(req, res, next);
  console.log("Dosao u checkJwt");
});

// Moze da se svede na jedan ruter ali volim da vidim sta je sve implementirano!!!
router.use((req, res, next) => {
  console.log("Dosao do ruta");
  next();
});

router.use('/tic/artcena', checkPermissions(), abstruct) 
router.use('/tic/artloc', checkPermissions(), abstruct) 
router.use('/tic/artlink', checkPermissions(), abstruct) 


 
router.use('/tic/chanellseatloc', checkPermissions(), abstruct) 
router.use('/tic/channel', checkPermissions(), abstruct) 
router.use('/tic/channeleventpar', checkPermissions(), abstruct) 


router.use('/tic/doc', checkPermissions(), abstruct) 
router.use('/tic/docdocslink', checkPermissions(), abstruct) 
router.use('/tic/docdiscount', checkPermissions(), abstruct)
router.use('/tic/docsdiscount', checkPermissions(), abstruct)
router.use('/tic/doclink', checkPermissions(), abstruct) 
router.use('/tic/docs', checkPermissions(), abstruct) 
router.use('/tic/docslink', checkPermissions(), abstruct) 
router.use('/tic/docpayment', checkPermissions(), abstruct)
router.use('/tic/docdelivery', checkPermissions(), abstruct)
router.use('/tic/docsuid', checkPermissions(), abstruct)

router.use('/tic/eventagenda', checkPermissions(), abstruct) 
router.use('/tic/eventart', checkPermissions(), abstruct) 
router.use('/tic/eventartlink', checkPermissions(), abstruct)
router.use('/tic/eventartcena', checkPermissions(), abstruct)
router.use('/tic/eventatts', checkPermissions(), abstruct) 
router.use('/tic/eventcenatp', checkPermissions(), abstruct) 
router.use('/tic/eventlink', checkPermissions(), abstruct) 
router.use('/tic/eventloc', checkPermissions(), abstruct)  
router.use('/tic/loclink', checkPermissions(), abstruct)
router.use('/tic/eventobj', checkPermissions(), abstruct)
router.use('/tic/events', checkPermissions(), abstruct) 
router.use('/tic/eventtps', checkPermissions(), abstruct)
router.use('/tic/file', checkPermissions(), fileRouter)

router.use('/tic/esir', checkPermissions(), esirRouter)
router.use('/tic/allsecure', checkPermissions(), allSecureRouter)
// todo
 router.use('/postback', checkPermissionsAllSecure(), paymentPostbackRouter)

router.use('/tic/naime', checkPermissions(), abstruct) 
router.use('/tic/parprivilege', checkPermissions(), abstruct) 

router.use('/tic/privilegecond', checkPermissions(), abstruct) 
router.use('/tic/privilegediscount', checkPermissions(), abstruct)
router.use('/tic/privilegelink', checkPermissions(), abstruct) 
 

router.use('/tic/seatloc', checkPermissions(), abstruct) 
router.use('/tic/seattpatts', checkPermissions(), abstruct) 
router.use('/tic/stampa', checkPermissions(), abstruct)

router.use('/tic/x/agenda', checkPermissions(), abstructX) 
router.use('/tic/x/agendatp', checkPermissions(), abstructX) 
router.use('/tic/x/art', checkPermissions(), abstructX) 
router.use('/tic/x/artgrp', checkPermissions(), abstructX) 
router.use('/tic/x/arttp', checkPermissions(), abstructX) 
router.use('/tic/x/cena', checkPermissions(), abstructX) 
router.use('/tic/x/cenatp', checkPermissions(), abstructX)
router.use('/tic/x/condtp', checkPermissions(), abstructX) 
router.use('/tic/x/discount', checkPermissions(), abstructX) 
router.use('/tic/x/discounttp', checkPermissions(), abstructX) 
router.use('/tic/x/doctp', checkPermissions(), abstructX) 
router.use('/tic/x/docvr', checkPermissions(), abstructX) 
router.use('/tic/x/grp', checkPermissions(), abstructX) 
router.use('/tic/x/event', checkPermissions(), abstructX) 
router.use('/tic/x/eventatt', checkPermissions(), abstructX)
router.use('/tic/x/eventatttp', checkPermissions(), abstructX)
router.use('/tic/x/eventctg', checkPermissions(), abstructX) 
router.use('/tic/x/eventtp', checkPermissions(), abstructX) 
router.use('/tic/x/privilege', checkPermissions(), abstructX) 
router.use('/tic/x/privilegetp', checkPermissions(), abstructX)
router.use('/tic/x/season', checkPermissions(), abstructX) 
router.use('/tic/x/seat', checkPermissions(), abstructX) 
router.use('/tic/x/seattp', checkPermissions(), abstructX) 
router.use('/tic/x/seattpatt', checkPermissions(), abstructX) 

//router.use('/adm/services', servicesRoute)

router.use("/", (req, res, next) => {
  next();
  return res.status(403).send({ error: "Forbidden!! "+req.url });

})

export default router;
