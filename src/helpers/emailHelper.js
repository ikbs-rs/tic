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
      SELECT b.bcontent
      FROM tic_docb b
      WHERE b.doc = $1
    `;
    const attResult = await db.query(sqlAttRecenica, [requestBody.id]); 
    // const base64Image = `data:image/png;base64,${attResult.rows[0].bcontent.toString("base64")}`;     
    const attachments = [
      {
        filename: `racun${requestBody.broj}.png`,
        content: attResult.rows[0].bcontent, 
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
