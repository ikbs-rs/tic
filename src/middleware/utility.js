import { Snowflake as snowflake } from "node-snowflake";

import { hostname } from "os";
import { createHash } from "crypto";
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
  await new Promise((resolve) => setTimeout(resolve, 0.5));

  return snowflake.nextId();
};

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
  await new Promise((resolve) => setTimeout(resolve, 0.5));
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

export { virtualHost, processId };

