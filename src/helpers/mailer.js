
import nodemailer from 'nodemailer';

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
            <p><strong>Broj narudžbine:</strong> ${transaction.id}</p>
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
    from: 'test@ticketline.rs',
    to: 'bobanmvasiljevic@gmail.com',
    cc: ['bobanmvasiljevic@gmail.com', 'bmvasiljevic@yahoo.com'],
    bcc: ['bobanmvasiljevic@gmail.com', 'bmvasiljevic@yahoo.com'], 
    // to: user.email,
    subject: 'Potvrda o kupovini ulaznica###',
    html: "Proba da li ovo fercera",
    // html: emailContent,
    attachments: attachments || [], // Dodaj priloge, ako postoje
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
