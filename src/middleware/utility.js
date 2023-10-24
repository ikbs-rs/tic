import { Snowflake as snowflake } from "node-snowflake";

import { hostname } from "os";
import { createHash } from "crypto";
import dotenv from "dotenv";

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

