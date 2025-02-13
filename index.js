import express  from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './src/routes/indexRoute.js' 
import fs from 'fs';
import  http  from 'http';
import https from 'https';


const app = express()
dotenv.config()
app.use(cors())

// Povećanje limita za JSON payload
app.use(bodyParser.json({ limit: '50mb' })); // Povećava limit na 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const httpPort = process.env.APP_PORT || 3000; // HTTP port
const httpsPort = process.env.HTTPS_PORT || 3443; // HTTPS port
const sslDir = process.env.SSL_DIR
const rootDir = process.env.ROOT_DIR
const webDomen = process.env.WEB_DOMEN

// Učitavanje SSL/TLS sertifikata i privatnog ključa
const privateKey = fs.readFileSync(`${sslDir}localhost.key`, 'utf8');
const certificate = fs.readFileSync(`${sslDir}localhost.crt`, 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use((req, res, next) => {
  const allowedOrigins = [webDomen, '*.ems.local'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }    
  //res.setHeader('Access-Control-Allow-Origin', `${webDomen}`);
  next();
});

app.use((req, res, next) => { 
  //console.log("************TIC**************", req.url)
  next();
});

//app.use(forceHttps); // Osiguranje da zahtevi budu preusmereni na HTTPS

app.use(`/${rootDir}`,router)

// Kreiranje HTTP servera
const httpServer = http.createServer(app);

// Kreiranje HTTPS servera
const httpsServer = https.createServer(credentials, app);



httpServer.listen(httpPort, () => {
  console.log(`HTTP Server je pokrenut na adresi ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
   console.log(`HTTPS Server je pokrenut na adresi ${httpsPort}`);
});


/*
const app = express()
dotenv.config()
app.use(cors())

app.use('/',router) // Treba prepraviti '/' route, npr. /ticketlines/api

const appPort = process.env.APP_PORT 
app.listen(appPort||3000, () => {
  console.log(`Server je pokrenut na adresi ${appPort}`)
})
*/