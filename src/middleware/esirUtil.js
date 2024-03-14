const assembleEsirInvoicesRequestBody = (ticInvoice) => {
    return {
        advancePaid: null,  //?? Koristi se za izdavanje zavrsnog avansnog racuna, opcioni parametar, sadrzi ukupno placeni avans
        advanceTax: null,  //?? Koristi se za izdavanje zavrsnog avansnog racuna, opcioni parametar, sadrzi vrednost poreza na avans
        invoiceRequest: {
            buyerCostCenterId: ticInvoice?.buyerCostCenterId, //??
            buyerId: ticInvoice?.userId,//??
            cashier: ticInvoice?.cashier,//??
            dateAndTimeOfIssue: ticInvoice?.date,  //tic_doc.date
            invoiceNumber: ticInvoice?.broj,     //tic_doc.broj
            invoiceType: "Normal", //??
            referentDocumentDT: null,     //?  vreme originalnog računa, ovo se popunjava za transactionType Refund
            referentDocumentNumber: null,  //broj originalnog računa, ovo se popunjava za transactionType Refund
            transactionType: "Sale", //??
            items: ticInvoice.tic_docs.map(tic_doc => {
                return {
                    gtin: tic_doc.id,       // (tic_docs.id)
                    labels: [
                        "A"
                    ],
                    name: tic_doc.art,// (tic_docs.art) -> tic_art.text
                    quantity: tic_doc.output,      // tic_docs.output
                    totalAmount: tic_doc.totalAmount, //?? unitPrice * quantity
                    unitPrice: tic_doc.price   // tic_docs.price
                }
            }),
            payment: [
                {
                    "amount": ticInvoice?.amountCard,   // Ovo je ukupna suma na racunu placena   karticom
                    "paymentType": "Card"
                },
                {
                    "amount": ticInvoice?.amountCash,  // Ovo je ukupna suma na racunu placena   kesom ????
                    "paymentType": "Cash"
                }

            ]
        }
    };
};


const assembleEsirInvoicesResponse = (esirInvoicesResponse) => {
    return {
        "requestedBy": esirInvoicesResponse?.requestedBy,
        "signedBy": esirInvoicesResponse?.signedBy,
        "sdcDateTime": esirInvoicesResponse?.sdcDateTime,
        "invoiceCounter": esirInvoicesResponse?.invoiceCounter,
        "invoiceCounterExtension": esirInvoicesResponse?.invoiceCounterExtension,
        "invoiceNumber": esirInvoicesResponse?.invoiceNumber,
        "verificationUrl": esirInvoicesResponse?.verificationUrl,
        "verificationQRCode": esirInvoicesResponse?.verificationQRCode,
        "journal": esirInvoicesResponse?.journal,
        "totalCounter": esirInvoicesResponse?.totalCounter,
        "transactionTypeCounter": esirInvoicesResponse?.transactionTypeCounter,
        "totalAmount": esirInvoicesResponse?.totalAmount,
        "encryptedInternalData": esirInvoicesResponse?.encryptedInternalData,
        "signature": esirInvoicesResponse?.signature,
        "taxItems": esirInvoicesResponse?.taxItems,
        "businessName": esirInvoicesResponse?.businessName,
        "locationName": esirInvoicesResponse?.locationName,
        "address": esirInvoicesResponse?.address,
        "tin": esirInvoicesResponse?.tin,
        "district": esirInvoicesResponse?.district,
        "taxGroupRevision": esirInvoicesResponse?.taxGroupRevision,
        "mrc": esirInvoicesResponse?.mrc,
        "messages": esirInvoicesResponse?.messages,
        "invoiceImagePngBase64": esirInvoicesResponse?.invoiceImagePngBase64,
        "invoiceImagePdfBase64": esirInvoicesResponse?.invoiceImagePdfBase64,
        "invoiceImageHtml": esirInvoicesResponse?.invoiceImageHtml
    };
};

export default {assembleEsirInvoicesRequestBody, assembleEsirInvoicesResponse};