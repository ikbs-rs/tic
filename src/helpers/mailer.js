
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import PuppeteerHTMLPDF from 'puppeteer-html-pdf';


const sendTicketConfirmationEmail = async ({ user, orderDetails }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Potvrda o rezervaciji ulaznica</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Uspešno ste izvršili odabir ulaznica za događaj:</p>
            <h3 style="color: #333;">${orderDetails.eventName}</h3>
            <p><strong>Datum i vreme:</strong> ${orderDetails.eventDate}</p>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Broj porudžbine:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <h3 style="color: #333;">Detalji ulaznica:</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th>Rb</th>
                  <th>Kategorija</th>
                  <th>Strana</th>
                  <th>Red</th>
                  <th>Sedište</th>
                  <th>Cena</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.tickets
                  .map(
                    (ticket) => `
                      <tr>
                        <td>${ticket.rb}</td>
                        <td>${ticket.category}</td>
                        <td>${ticket.side}</td>
                        <td>${ticket.row}</td>
                        <td>${ticket.seat}</td>
                        <td>${ticket.price}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
            <p><strong>Ukupna vrednost ulaznica:</strong> ${orderDetails.ticketsTotal} Din.</p>
            <p><strong>Troškovi obrade:</strong> ${orderDetails.processingFee} Din.</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din.</p>
            <p style="margin-top: 20px; font-size: 14px;">Vaša rezervacija važeća je narednih 24 sata.</p>
            <p style="font-size: 14px;">Ulaznice za događaj možete preuzeti na nekom od Ticketline prodajnih mesta. Tačan spisak prodajnih mesta i njihovo radno vreme možete pogledati na <a href="http://www.ticketline.rs" style="color: #4CAF50; text-decoration: none;">www.ticketline.rs</a>.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Potvrda o rezervaciji ulaznica',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};


/******************************************************************************************************************** */

const sendReservationConfirmationEmail = async ({ user, orderDetails }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Potvrda o rezervaciji ulaznica</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Uspešno ste izvršili odabir ulaznica za događaj:</p>
            <h3 style="color: #333;">${orderDetails.eventName}</h3>
            <p><strong>Datum i vreme:</strong> ${orderDetails.eventDate}</p>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Broj porudžbine:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <h3 style="color: #333;">Detalji ulaznica:</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th>Rb</th>
                  <th>Kategorija</th>
                  <th>Strana</th>
                  <th>Red</th>
                  <th>Sedište</th>
                  <th>Cena</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.tickets
                  .map(
                    (ticket) => `
                      <tr>
                        <td>${ticket.rb}</td>
                        <td>${ticket.category}</td>
                        <td>${ticket.side}</td>
                        <td>${ticket.row}</td>
                        <td>${ticket.seat}</td>
                        <td>${ticket.price}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
            <p><strong>Ukupna vrednost ulaznica:</strong> ${orderDetails.ticketsTotal} Din.</p>
            <p><strong>Troškovi obrade:</strong> ${orderDetails.processingFee} Din.</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din.</p>
            <p style="margin-top: 20px; font-size: 14px;">Vaša rezervacija važeća je narednih 24 sata.</p>
            <p style="font-size: 14px;">U naznačenom roku potrebno je izvršiti uplatu porudžbine u skladu sa uputstvom iz priloga poruke.</p>
            <p style="font-size: 14px;">Prilikom evidentiranja Vaše uplate dobićete potvrdni mejl na ovu istu adresu.</p>
            <p style="font-size: 14px;">Tek nakon dobijanja potvrdnog mejla ulaznice možete preuzeti na nekom od Ticketline prodajnih mesta. Tačan spisak prodajnih mesta i njihovo radno vreme možete pogledati na <a href="http://www.ticketline.rs" style="color: #4CAF50; text-decoration: none;">www.ticketline.rs</a>.</p>
            <p style="font-size: 14px;">Ukoliko uplata porudžbine ne bude izvršena u naznačenom roku, Vaša rezervacija će biti automatski poništena.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Potvrda o rezervaciji ulaznica',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};


/******************************************************************************************************************** */

const sendPaymentChangeConfirmationEmail = async ({ user, orderDetails }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Promena načina plaćanja</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Izvršena je promena Vaše rezervacije broj: <strong>${orderDetails.orderNumber}</strong>.</p>
            <p style="font-size: 16px;">Izabrali ste da Vašu porudžbinu uplatite na tekući račun, a ulaznice nakon uplate preuzmete na našem prodajnom mestu.</p>
            <h3 style="color: #333;">Detalji događaja:</h3>
            <p><strong>Naziv događaja:</strong> ${orderDetails.eventName}</p>
            <p><strong>Datum i vreme:</strong> ${orderDetails.eventDate}</p>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <p style="margin-top: 20px; font-size: 14px;">Vaša rezervacija važeća je narednih 24 sata.</p>
            <p style="font-size: 14px;">U naznačenom roku potrebno je izvršiti uplatu porudžbine u skladu sa uputstvom iz priloga poruke.</p>
            <p style="font-size: 14px;">Prilikom evidentiranja Vaše uplate dobićete potvrdni mejl na ovu istu adresu.</p>
            <p style="font-size: 14px;">Tek nakon dobijanja potvrdnog mejla ulaznice možete preuzeti na nekom od Ticketline prodajnih mesta. Tačan spisak prodajnih mesta i njihovo radno vreme možete pogledati na <a href="http://www.ticketline.rs" style="color: #4CAF50; text-decoration: none;">www.ticketline.rs</a>.</p>
            <p style="font-size: 14px;">Ukoliko uplata porudžbine ne bude izvršena u naznačenom roku, Vaša rezervacija će biti automatski poništena.</p>
            <p style="font-size: 14px;">Zahvaljujemo se na Vašoj porudžbini i želimo Vam dobru zabavu.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Promena načina plaćanja',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};

/******************************************************************************************************************** */

const sendPaymentAtPickupConfirmationEmail = async ({ user, orderDetails }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Promena načina plaćanja</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Izvršena je promena Vaše rezervacije broj: <strong>${orderDetails.orderNumber}</strong>.</p>
            <p style="font-size: 16px;">Izabrali ste da Vašu porudžbinu uplatite prilikom preuzimanja ulaznica na našem prodajnom mestu.</p>
            <h3 style="color: #333;">Detalji događaja:</h3>
            <p><strong>Naziv događaja:</strong> ${orderDetails.eventName}</p>
            <p><strong>Datum i vreme:</strong> ${orderDetails.eventDate}</p>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <p style="margin-top: 20px; font-size: 14px;">Vaša rezervacija važeća je narednih 24 sata.</p>
            <p style="font-size: 14px;">U naznačenom roku ulaznice možete platiti i preuzeti na nekom od Ticketline prodajnih mesta. Tačan spisak prodajnih mesta i njihovo radno vreme možete pogledati na <a href="http://www.ticketline.rs" style="color: #4CAF50; text-decoration: none;">www.ticketline.rs</a>.</p>
            <p style="font-size: 14px;">Zahvaljujemo se na Vašoj porudžbini i želimo Vam dobru zabavu.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Promena načina plaćanja',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};

/******************************************************************************************************************** */

const sendOnlinePaymentLinkEmail = async ({ user, orderDetails, paymentLink }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Link za online plaćanje</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Zahvaljujemo se na Vašoj porudžbini. Vaš broj porudžbine je: <strong>${orderDetails.orderNumber}</strong>.</p>
            <p style="font-size: 16px;">Link za online plaćanje nalazi se u nastavku:</p>
            <p style="font-size: 16px; text-align: center; margin: 20px 0;">
              <a href="${paymentLink}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Plati online</a>
            </p>
            <p style="font-size: 14px;">Zahvaljujemo se na Vašoj porudžbini i želimo Vam dobru zabavu.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Link za online plaćanje',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};

/******************************************************************************************************************** */

const sendTicketSelectionConfirmationEmail = async ({ user, orderDetails }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Potvrda o odabiru ulaznica</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Uspešno ste izvršili odabir ulaznica za događaj:</p>
            <h3 style="color: #333;">${orderDetails.eventName}</h3>
            <p><strong>Datum i vreme:</strong> ${orderDetails.eventDate}</p>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Broj porudžbine:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <h3 style="color: #333;">Detalji ulaznica:</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th>Rb/No</th>
                  <th>Kategorija/Category</th>
                  <th>Strana/Section</th>
                  <th>Red/Row</th>
                  <th>Sedište/Seat</th>
                  <th>Cena/Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.tickets
                  .map(
                    (ticket) => `
                      <tr>
                        <td>${ticket.rb}</td>
                        <td>${ticket.category}</td>
                        <td>${ticket.side}</td>
                        <td>${ticket.row}</td>
                        <td>${ticket.seat}</td>
                        <td>${ticket.price}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
            <p><strong>Ukupna vrednost ulaznica:</strong> ${orderDetails.ticketsTotal} Din.</p>
            <p><strong>Troškovi obrade:</strong> ${orderDetails.processingFee} Din.</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din.</p>
            <p style="margin-top: 20px; font-size: 14px;">Ovo je potvrda samo odabira ulaznica. U narednom mejlu dobićete obaveštenje da li je vaše online plaćanje izvršeno uspešno ili neuspešno. Tek nakon uspešno izvršenog plaćanja ulaznice će Vam biti dostupne.</p>
            <p style="font-size: 14px;">U slučaju da ne dobijete mejl, smatrajte da Vaše plaćanje nije uspešno završeno, pa će odabrana mesta biti oslobođena i puštena u slobodnu prodaju.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
  
  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Potvrda o odabiru ulaznica',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};
/******************************************************************************************************************** */
const sendPrintAtHomeConfirmationEmail = async ({ user, orderDetails, transactionDetails, attachments }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Potvrda o uspešnom plaćanju</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Uspešno ste izvršili plaćanje print@home ulaznica za događaj:</p>
            <h3 style="color: #333;">${orderDetails.eventName}</h3>
            <p><strong>Datum i vreme:</strong> ${orderDetails.eventDate}</p>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Broj porudžbine:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <h3 style="color: #333;">Detalji ulaznica:</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th>Rb/No</th>
                  <th>Kategorija/Category</th>
                  <th>Strana/Section</th>
                  <th>Red/Row</th>
                  <th>Sedište/Seat</th>
                  <th>Cena/Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.tickets
                  .map(
                    (ticket) => `
                      <tr>
                        <td>${ticket.rb}</td>
                        <td>${ticket.category}</td>
                        <td>${ticket.side}</td>
                        <td>${ticket.row}</td>
                        <td>${ticket.seat}</td>
                        <td>${ticket.price}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
            <p><strong>Ukupna vrednost ulaznica:</strong> ${orderDetails.ticketsTotal} Din.</p>
            <p><strong>Troškovi obrade:</strong> ${orderDetails.processingFee} Din.</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din.</p>
            <h3 style="color: #333;">Podaci o transakciji:</h3>
            <p><strong>Status transakcije:</strong> ${transactionDetails.status}</p>
            <p><strong>Referentni ID transakcije:</strong> ${transactionDetails.referenceId}</p>
            <p><strong>Broj narudžbine:</strong> ${transactionDetails.orderNumber}</p>
            <p><strong>Autorizacioni kod:</strong> ${transactionDetails.authorizationCode}</p>
            <p><strong>Broj transakcije:</strong> ${transactionDetails.transactionNumber}</p>
            <p><strong>Datum transakcije:</strong> ${transactionDetails.transactionDate}</p>
            <p><strong>Iznos transakcije:</strong> ${transactionDetails.amount} RSD</p>
            <h3 style="color: #333;">Podaci o kupcu:</h3>
            <p><strong>Ime:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Adresa:</strong> ${user.address}</p>
            <p><strong>Poštanski broj:</strong> ${user.zipCode}</p>
            <p><strong>Mesto:</strong> ${user.city}</p>
            <h3 style="color: #333;">Podaci o trgovcu:</h3>
            <p><strong>Naziv:</strong> ${transactionDetails.merchantName}</p>
            <p><strong>PIB:</strong> ${transactionDetails.merchantTaxId}</p>
            <p><strong>Adresa:</strong> ${transactionDetails.merchantAddress}</p>
            <p style="margin-top: 20px; font-size: 14px;">Vaše print@home ulaznice su priložene uz ovaj e-mail.</p>
            <p style="font-size: 14px;">Zahvaljujemo se na Vašoj porudžbini i želimo Vam dobru zabavu.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Potvrda o uspešnom plaćanju i print@home ulaznice',
    html: emailContent,
    attachments: attachments || [], // Dodaj priloge (print@home ulaznice)
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};

/******************************************************************************************************************** */

const sendDeliveryConfirmationEmail = async ({ user, orderDetails }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Potvrda o porudžbini i dostavi</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Uspešno ste izvršili odabir ulaznica za događaj:</p>
            <h3 style="color: #333;">${orderDetails.eventName}</h3>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Broj porudžbine:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <h3 style="color: #333;">Detalji ulaznica:</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th>Rb</th>
                  <th>Kategorija</th>
                  <th>Cena</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.tickets
                  .map(
                    (ticket) => `
                      <tr>
                        <td>${ticket.rb}</td>
                        <td>${ticket.category}</td>
                        <td>${ticket.price}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
            <p><strong>Ukupna vrednost ulaznica:</strong> ${orderDetails.ticketsTotal} Din.</p>
            <p><strong>Troškovi dostave:</strong> ${orderDetails.deliveryFee} Din.</p>
            <p><strong>Troškovi obrade:</strong> ${orderDetails.processingFee} Din.</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din.</p>
            <p style="margin-top: 20px; font-size: 14px;">Ulaznice će Vam biti isporučene na sledeću adresu:</p>
            <p style="font-size: 14px;"><strong>Adresa:</strong> ${user.address}, ${user.zipCode}, ${user.city}</p>
            <p style="font-size: 14px;">Ukupna vrednost porudžbine se plaća kuriru prilikom isporuke ulaznica.</p>
            <p style="font-size: 14px;">Zahvaljujemo se na Vašoj porudžbini i želimo Vam dobru zabavu.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Potvrda o porudžbini i dostavi',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};
/******************************************************************************************************************** */

const sendPaymentAndDeliveryConfirmationEmail = async ({ user, orderDetails }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Promena načina plaćanja i dostave</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.name}!</h2>
            <p style="font-size: 16px;">Izvršena je promena Vaše rezervacije broj: <strong>${orderDetails.orderNumber}</strong>.</p>
            <p style="font-size: 16px;">Izabrali ste da Vašu porudžbinu uplatite na naš račun, a ulaznice će Vam biti dostavljene kurirskom službom.</p>
            <h3 style="color: #333;">Detalji događaja:</h3>
            <p><strong>Naziv događaja:</strong> ${orderDetails.eventName}</p>
            <p><strong>Mesto održavanja:</strong> ${orderDetails.eventLocation}</p>
            <p><strong>Ukupna vrednost porudžbine:</strong> ${orderDetails.totalAmount} Din. (sa uračunatim PDV-om)</p>
            <p style="margin-top: 20px; font-size: 14px;">Vaša rezervacija važeća je narednih 24 sata.</p>
            <p style="font-size: 14px;">U naznačenom roku potrebno je izvršiti uplatu porudžbine u skladu sa uputstvom iz priloga poruke.</p>
            <p style="font-size: 14px;">Prilikom evidentiranja Vaše uplate dobićete potvrdni mejl i PDF ulaznicu(e) na ovu istu adresu.</p>
            <p style="font-size: 14px;">Nakon registrovane uplate, ulaznice će Vam biti isporučene na sledeću adresu:</p>
            <p style="font-size: 14px;"><strong>Adresa:</strong> ${user.address}, ${user.zipCode}, ${user.city}</p>
            <p style="font-size: 14px;"><strong>Napomena:</strong> Uplate preko računa kao i dostave na kućnu adresu ne vršimo 7 dana pred događaj!</p>
            <p style="font-size: 14px;">Zahvaljujemo se na Vašoj porudžbini i želimo Vam dobru zabavu.</p>
            <p style="font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [], 
    subject: 'Promena načina plaćanja i dostave',
    html: emailContent,
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });

  return true;
};


/******************************************************************************************************************** */

const generateUplatnica = async ({
  uplatilac,
  svrhaUplate,
  racunPrimaoca,
  primalac,
  model,
  pozivNaBroj,
  mestoIDatum,
  datumValute,
  iznos,
}) => {
  // HTML za uplatnicu
  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${uplatnicaCSS}
        </style>
        <script>
          // JavaScript za praćenje Ctrl+P
          document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
              event.preventDefault(); // Sprečite podrazumevano ponašanje
              document.body.classList.add('print-mode'); // Dodajte klasu za štampu
              window.print(); // Ručno otvorite dijalog za štampu
            }
          });
        </script>        
      </head>
      <body>
        <table class="form-table" align="center" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="16">&nbsp;</td>
            <td width="72">&nbsp;</td>
            <td width="72">&nbsp;</td>
            <td width="72">&nbsp;</td>
            <td width="128">&nbsp;</td>
            <td width="24">&nbsp;</td>
            <td width="64">&nbsp;</td>
            <td width="16">&nbsp;</td>
            <td width="64">&nbsp;</td>
            <td width="16">&nbsp;</td>
            <td width="96">&nbsp;</td>
            <td width="96">&nbsp;</td>
            <td width="16">&nbsp;</td>
          </tr>
          <tr>
            <td> </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colspan="6" class="form-ff-naslov">НАЛОГ ЗА УПЛАТУ</td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4">уплатилац</td>
            <td></td>
            <td width="64">шифра плаћања</td>
            <td></td>
            <td>валута</td>
            <td></td>
            <td>износ</td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4" rowspan="2" class="form-ff">${uplatilac}</td>
            <td></td>
            <td rowspan="2" class="form-ff"></td>
            <td></td>
            <td rowspan="2" class="form-ff"></td>
            <td rowspan="2"> </td>
            <td colspan="2" rowspan="2" class="form-ff">${iznos}</td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td></td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4">сврха плаћања</td>
            <td></td>
            <td colspan="6">рачун примаоца</td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4" rowspan="2" class="form-ff">${svrhaUplate}</td>
            <td></td>
            <td colspan="6" class="form-ff">${racunPrimaoca}</td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td></td>
            <td>модел</td>
            <td></td>
            <td colspan="4">позив на број (одобрење)</td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4">прималац</td>
            <td></td>
            <td class="form-ff">${model}</td>
            <td></td>
            <td colspan="4" class="form-ff">${pozivNaBroj}</td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4" rowspan="2" width="64" height="32" class="form-ff">${primalac}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4">____________________________________</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="4">печат и потпис уплатиоца</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td> </td>
            <td></td>
            <td colspan="3" align="right">___________________________</td>
            <td></td>
            <td colspan="4">__________________________</td>
            <td></td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td> </td>
            <td></td>
            <td colspan="3" align="right">${mestoIDatum}</td>
            <td></td>
            <td colspan="3">${datumValute}</td>
            <td></td>
            <td></td>
            <td></td>
            <td> </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return htmlContent;
};

// CSS za uplatnicu
const uplatnicaCSS = `
  @page {
    size: 99mm 210mm; /* Širina x Visina */
    margin: 5mm; 
  }

  body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    width: 99mm;
    height: 210mm;
    box-sizing: border-box;
  }
    @media print {
      @page {
        size: 99mm 210mm;
        margin: 0;
      }

      body {
        margin: 0;
        padding: 0;
      }
    }
    .print-mode {
      margin: 0;
      padding: 0;
    }    

  table {
    font-size: 8pt;
    table-layout: fixed;
  }

  .form-ff {
    border: 1pt solid black;
    font-weight: 700;
    font-size: 12pt;
    text-align: center;
    font-family: monospace;
    height: 24pt;
  }

  .form-ff-naslov {
    text-align: right;
    font-weight: 700;
    font-size: 12pt;
  }

  .form-table {
    border: 1pt solid black;
    height: 99mm;
    width: 210mm;
  }
`;


const sendEmail = async ({ user, transaction, payment, items, imageSrc, attachments }) => {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px auto;">
        <tr>
          <td style="background-color: #4CAF50; padding: 20px; color: #fff; text-align: center; font-size: 24px;">
            <strong>Hvala vam na kupovini!</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center;">
            <img src="${imageSrc}" alt="Ticketline Banner" style="width: 100%; max-width: 560px; border-radius: 5px;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #333;">Poštovani/a, ${user.text}!</h2>
            <p style="font-size: 16px;">Zahvaljujemo se na vašoj kupovini putem Ticketline-a. Vaša transakcija je uspešno završena, a vaše ulaznice su spremne!</p>
            <h3 style="color: #333;">Detalji transakcije:</h3>
            <p><strong>Broj narudžbine:</strong> ${transaction.broj}</p>
            <p><strong>Ukupan iznos:</strong> ${payment.amount || 'N/A'} RSD</p>
            <p><strong>Način plaćanja:</strong> Kartica (Kod: ${payment.id})</p>
            <p><strong>Datum transakcije:</strong> ${new Date(transaction.updated_at).toLocaleDateString()}</p>
            <h3 style="color: #333;">Detalji sedišta:</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th>Sedište</th>
                  <th>Red</th>
                  <th>Sektor</th>
                </tr>
              </thead>
              <tbody>
                ${items
      .map(
        (item) =>
          `<tr>
                        <td>${item.seat}</td>
                        <td>${item.row}</td>
                        <td>${item.nart} RSD</td>
                      </tr>`
      )
      .join('')}
              </tbody>
            </table>
            <p style="margin-top: 20px; font-size: 14px;">Za sva pitanja, obratite se na <a href="mailto:office@ticketline.rs" style="color: #4CAF50; text-decoration: none;">office@ticketline.rs</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const uplatnicaData = {
    uplatilac: 'Илија Тестирање',
    svrhaUplate: 'Уплата за улазнице',
    racunPrimaoca: '840-0000001234567-78',
    primalac: 'Тикетлајн ДОО',
    model: '97',
    pozivNaBroj: '123456789',
    mestoIDatum: 'Београд, 14.02.2024.',
    datumValute: '14.02.2024.',
    iznos: '1400.00 Дин.',
  };

  const transporter = nodemailer.createTransport({
    host: 'mail.ticketline.rs',
    port: 465,
    secure: true,
    auth: {
      user: 'test@ticketline.rs',
      pass: 'Hun_3030',
    },
    tls: {
      rejectUnauthorized: false, // Ovo isključuje proveru sertifikata
    },
  });

  const htmlContent = await generateUplatnica(uplatnicaData);

  const base64Content = Buffer.from(htmlContent).toString('base64');

  const mailOptions = {
    from: 'Ticketline <no-reply@ticketline.rs>',
    to: user.email,
    cc: ['bobanmvasiljevic@gmail.com'],
    bcc: [],
    // to: user.email,
    subject: 'Potvrda o kupovini ulaznica###',
    // html: "Tekst koji se salje kupcu uz fiskalni racun!!",
    html: emailContent,
    attachments: [
      {
        filename: 'uplatnica.html',
        content: base64Content,
        encoding: 'base64',
      },
      ...(attachments || []), // Dodajte postojeće priloge ako postoje
    ],
  };

  await transporter.verify();
  console.log("Pokušavam da pošaljem e-mail...");
  // const status = await transporter.sendMail(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });
  return true
};

export default {
  sendEmail,
};
