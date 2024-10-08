import { Snowflake as snowflake } from "node-snowflake";

import { hostname } from "os";
import { createHash, randomBytes } from "crypto";

import  crypto  from "crypto"; 
import dotenv from "dotenv";

import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Host ili virtuelni hostname
const virtualHost = hostname();
// Tekuci proces
const processId = process.pid.toString();
let timestamp
let data;
// Ip address db servera
const dataCentar = process.env.DATA_CENTAR;
let workerId;

//******************************************* */
function generisiSlucajniBroj(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dopuniBrojDoOsamCifara(broj) {
  const brojString = broj.toString();
  const nedostajuceCifre = 8 - brojString.length;

  if (nedostajuceCifre > 0) {
      const dopuna = generisiSlucajniBroj(1, 9).toString().repeat(nedostajuceCifre);
      return dopuna + brojString;
  } else {
      return brojString;
  }
}

export const transactionId = async (par) => {
  const pocetniBroj = 99999999 - generisiSlucajniBroj(0, 100);
  const donjaGranica = 10000000; // 10^7
  const gornjaGranica = 98999999;

  const slucajniBroj = generisiSlucajniBroj(donjaGranica, gornjaGranica);
  let rezultat = pocetniBroj - slucajniBroj;

  if (rezultat < donjaGranica) {
      // Dopuni rezultat do osam cifara
      rezultat = parseInt(dopuniBrojDoOsamCifara(rezultat), 10);
  }

  return rezultat;
}

//******************************************* */

// Generisanje novog Id na osnovu lokalnog okruzenje
export const uniqueId = async () => {
  timestamp = Date.now().toString();
  const randomValue = Math.floor(Math.random() * 90) + 10;
  data = virtualHost + processId + timestamp+ randomValue;
  workerId = createHash("sha256").update(data).digest("hex");
  //console.log(data, "------dataCentar-------", dataCentar, "***workerId***", workerId, "*******processId*******", processId )
  snowflake.init({
    worker_id: workerId,
    data_center_id: dataCentar,
    sequence: data,
  });
  await new Promise((resolve) => setTimeout(resolve, 1.5));

  return snowflake.nextId();
};
// export const uniqueId = async () => {
//   const timestamp = Date.now().toString();
//   const randomValue = Math.floor(Math.random() * 90) + 10;
//   const data = virtualHost + processId + timestamp + randomValue;
//   const workerIdHash = createHash("sha256").update(data).digest("hex");
//   const workerId = BigInt('0x' + workerIdHash.slice(0, 2)) % BigInt(32); // Uzimamo samo prvih 2 hex cifara heša i mod 32 da dobijemo vrednost između 0-31

//   snowflake.init({
//     worker_id: Number(workerId),
//     data_center_id: parseInt(dataCentar, 10),
//     sequence: parseInt(timestamp, 10),
//   });

//   await new Promise((resolve) => setTimeout(resolve, 1.5));

//   const id = snowflake.nextId().toString();
//   return id.padStart(20, '0'); // Osiguravamo da je rezultat tačno 20 cifara
// };

export const transactionId1 = async (par) => {
  timestamp = performance.now().toString();
  let timestamp1 = performance.now()
  for (let i = 0; i < 50; i++) {
    const timestamp = Date.now().toString();
    console.log(`Broj ${i + 1}: ${timestamp} `, performance.now().toString());
    timestamp1 = performance.now().toString();
}
  const randomValue = Math.floor(Math.random() * 90) + 10;
  data = virtualHost + processId + timestamp+ randomValue;
  workerId = createHash("sha256").update(data).digest("hex");
  //console.log(data, "------dataCentar-------", dataCentar, "***workerId***", workerId, "*******processId*******", processId )
  snowflake.init({
    worker_id: workerId,
    data_center_id: par,
    sequence: data,
  });
  await new Promise((resolve) => setTimeout(resolve, 1.5));
  console.log((performance.now()*snowflake.nextId()).toString(), "##########################snowflake.nextId()#############################", snowflake.nextId())
  return snowflake.nextId().toString().slice(0, 8);
};

export const uniqiueUUID =  async () => {
  // Generiše v4 UUID
  const jedinstveniID = await uuidv4();

  // Uzima samo prve osam cifara
  const osamCifaraID = await jedinstveniID.split('-').join('').slice(0, 8);

  return osamCifaraID;
}
// Formira hijerarhijsku strukturu menija DFS, BFS ide po sirini i moze imati problema sa velikom kolicinom podataka
//
export const unflatten = (items) => {
  const rootItems = []
  const lookup = {}
  const stack = []

  // add all items to a lookup table indexed by id
  items.forEach(item => {
    const newItem = { ...item, childrenItems: [] }
    lookup[item.id] = newItem
  })

  // link each item to its parent
  items.forEach(item => {
    const parent = lookup[item.parentid]
    if (parent) {
      parent.childrenItems.push(lookup[item.id])
    } else {
      rootItems.push(lookup[item.id])
    }
  })

  // traverse the tree in DFS order and remove children from nodes that have only one child
  const visitNode = (node) => {
    stack.push(node)
    while (stack.length > 0) {
      const current = stack.pop()
      if (current.childrenItems.length === 1) {
        current.childrenItems = current.childrenItems[0].childrenItems
      } else {
        current.childrenItems.forEach(child => stack.push(child))
      }
    }
  }
    
  rootItems.forEach(visitNode)
    
  return rootItems
}

export const randomTenDigit = async (uid) => {
  console.log("TRANSACTION 00 : ", uid);
  if (uid.length !== 19 || !/^\d+$/.test(uid)) {
    throw new Error("UID mora biti niz od 19 cifara.");
  }
  console.log("TRANSACTION 01 : ");

  // Generisanje prvog cifara između 1 i 9
  const firstDigit = Math.floor(Math.random() * 9) + 1;

  // Generisanje preostalih 9 cifara
  const randomBuffer = randomBytes(5);
  const randomNumber = parseInt(randomBuffer.toString('hex'), 16).toString().slice(0, 9);

  const hash = createHash('sha256').update(uid).digest('hex');
  const hashNumber = parseInt(hash.slice(0, 10), 16).toString().slice(0, 9);

  // Kombinovanje brojeva i osiguravanje tačno 10 cifara
  const uniqueNumber = `${firstDigit}${randomNumber}${hashNumber}`.slice(0, 10);

  console.log("TRANSACTION ID : ", uniqueNumber);
  return uniqueNumber;
};

export const proveriJMBG = async (uJMBG) => {
  let A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13;
  let pKontrolniBroj, pIzlaz = 0;
  let pYY;

  if (uJMBG.charAt(4) === '0') {
      pYY = '20';
  } else {
      pYY = '1' + uJMBG.charAt(4);
  }

  if (uJMBG.length === 13) {
      // Validacija datuma (DDMMYYYY)
      let datum = uJMBG.substring(0, 4) + pYY + uJMBG.substring(5, 7);
      if (isValidDate(datum, 'DDMMYYYY')) {
          A1 = parseInt(uJMBG.charAt(0));
          A2 = parseInt(uJMBG.charAt(1));
          A3 = parseInt(uJMBG.charAt(2));
          A4 = parseInt(uJMBG.charAt(3));
          A5 = parseInt(uJMBG.charAt(4));
          A6 = parseInt(uJMBG.charAt(5));
          A7 = parseInt(uJMBG.charAt(6));
          A8 = parseInt(uJMBG.charAt(7));
          A9 = parseInt(uJMBG.charAt(8));
          A10 = parseInt(uJMBG.charAt(9));
          A11 = parseInt(uJMBG.charAt(10));
          A12 = parseInt(uJMBG.charAt(11));
          A13 = parseInt(uJMBG.charAt(12));

          pKontrolniBroj = (A1 * 7 + A2 * 6 + A3 * 5 + A4 * 4 + A5 * 3 + A6 * 2 +
                            A7 * 7 + A8 * 6 + A9 * 5 + A10 * 4 + A11 * 3 + A12 * 2) % 11;

          if (pKontrolniBroj > 1) {
              if (11 - pKontrolniBroj === A13) {
                  pIzlaz = 1;
              }
          } else {
              if (pKontrolniBroj === A13) {
                  pIzlaz = 1;
              }
          }
      }
  }

  return pIzlaz;
}

// Pomoćna funkcija za validaciju datuma
function isValidDate(date, format) {
  const day = parseInt(date.substring(0, 2));
  const month = parseInt(date.substring(2, 4));
  const year = parseInt(date.substring(4, 8));

  // Provera datuma (osnovna provera bez dodatnih biblioteka)
  const dateObj = new Date(year, month - 1, day);
  return dateObj && (dateObj.getMonth() + 1) === month && dateObj.getDate() === day;
}


export { 
  virtualHost, 
  processId
 };

