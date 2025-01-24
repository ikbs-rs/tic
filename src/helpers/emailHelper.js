import mailer from "./mailer.js";
import db from "../db/db.js";


const postFiskal = async (objId, requestBody) => {
  try {
    const sqlUserRecenica = `
      SELECT *
      FROM cmn_parx_v s
      WHERE s.id = $1
    `;
    const userResult = await db.query(sqlUserRecenica, [requestBody.usr]); 
    const user = userResult.rows[0]||{}
    // console.log(user, "===========================================================================")
    const transaction = requestBody
    const payment = {}
    const sqlItemsRecenica = `
      SELECT *
      FROM tic_docs b
      WHERE b.doc = $1
    `;
    const itemsResult = await db.query(sqlItemsRecenica, [requestBody.id]);     
    const items = itemsResult.rows||[]
    const imageSrc = ""
    const sqlAttRecenica = `
      SELECT b.bcontent, vrednost
      FROM tic_docb b
      WHERE b.doc = $1
    `;
    const attResult = await db.query(sqlAttRecenica, [requestBody.id]);  
    const base64Image = attResult.rows[0].vrednost;  
    const base64Data = base64Image.split(',')[1];
    
    
    const attachments = [
      {
        filename: `racun${requestBody.broj}.png`,
        content: Buffer.from(base64Data, 'base64'), 
        contentType: 'image/png',
      },
    ]
    var rezultat = await mailer.sendEmail({ user, transaction, payment, items, imageSrc, attachments });

    return rezultat.status
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`esirHelper - Greška u POST-u EsirInvoices: ${error.message}`);
  }
};


const postRacun = async (requestBody) => {
  try {
    const { user, transaction, payment, items, imageSrc } = requestBody;
    var rezultat = await mailer.sendEmail({ user, transaction, payment, items, imageSrc });
    return rezultat.status
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`esirHelper - Greška u POST-u EsirInvoices: ${error.message}`);
  }
};

export default {
  postFiskal,
  postRacun,
};
