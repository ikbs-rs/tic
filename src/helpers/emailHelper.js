import mailer from "./mailer.js";


const postFiskal = async (requestBody) => {
  try {
    const { user, transaction, payment, items, imageSrc } = requestBody;
    var rezultat = await mailer.sendEmail({ user, transaction, payment, items, imageSrc });
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
