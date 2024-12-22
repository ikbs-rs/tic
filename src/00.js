
async function getEventAtts(eventId) {
    try {
        if (eventId === 'undefined' || eventId === undefined || eventId === null) {
            return null;
        }
        // TODO PROVERITI BAZU
        --cmn,obj,XPK,cmn,obj,XTCTP
        const eventStylesQueryCl = `select att.text att_text, att.code att_code, att.ddlist, att.inputtp, atts.* 
                from iis.tic_eventatts atts, iis.tic_eventatt att
                where atts.att = att.id
                and atts.valid = 1
                and atts.event = $1
        `;

        const res = await pool.query({
            name: 'all-atts-for-event-clanska',
            text: eventStylesQueryCl,
            values: [eventId]
        });


        for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows[i];
            if (row.inputtp === '3' && row.ddlist && row.ddlist !== '') {
                const [modul, tabela, code] = row.ddlist.split(',');
                let apsTabela = `${modul}_${tabela}`;
                // if (code) {
                //     apsTabela = `${apsTabela}_${code}`;
                // }

                // const additionalDataQuery = `SELECT * FROM ${apsTabela} WHERE ID = '${row.value}'`;
                let additionalDataQuery = `SELECT * FROM ${apsTabela}`;
                if (row.value) {
                    additionalDataQuery = `SELECT * FROM ${apsTabela} WHERE ID = '${row.value}'`;
                }
                let paymentData;
                let chanelData;

                try {
                    if (row.link && row.link !== '') {
                        let paymantDataTp = `SELECT * FROM cmn_paymenttp WHERE ID = '${row.link}'`;
                        let chanelDataTp = `SELECT * FROM cmn_obj WHERE ID = '${row.link}'`;

                        const paymentDataRes = await pool.query({
                            text: paymantDataTp,
                        });

                        const chanelDataRes = await pool.query({
                            text: chanelDataTp,
                        });

                        if (paymentDataRes.rows) {
                            paymentData = paymentDataRes.rows;
                        }
                        if (chanelDataRes) {
                            chanelData = chanelDataRes.rows;
                        }
                    }
                } catch (error) {
                }

                try {
                    const additionalDataRes = await pool.query({
                        text: additionalDataQuery,
                    });

                    // logger.info('additionalData:======================', additionalDataRes.rows);
                    // Add the additional data to the corresponding row
                    res.rows[i] = {
                        ...row,
                        additionalData: additionalDataRes.rows,
                        paymentData: paymentData,
                        chanelData: chanelData
                    };
                } catch (error) {
                    console.error(`Error querying table ${apsTabela}:`, error);
                    // You can handle the error here, for example by setting additionalData to an empty array
                    res.rows[i] = {
                        ...row,
                        additionalData: [],
                        paymentData: [],
                        chanelData: []
                    };
                }
            }
            if (row.inputtp === '6' && row.ddlist && row.ddlist !== '') {
                // const [modul, tabela, code] = row.ddlist.split(',');
                const [modul, tabela, code, modul1, table1, code1] = row.ddlist.split(',');
                let apsTabela = `${modul}_${tabela}`;
                // if (code) {
                //     apsTabela = `${apsTabela}_${code}`;
                // }

                // const additionalDataQuery = `SELECT * FROM ${apsTabela} WHERE ID = '${row.value}'`;
                let additionalDataQuery = `SELECT * FROM ${apsTabela}`;
                if (row.value) {
                    additionalDataQuery = `SELECT * FROM ${apsTabela} WHERE ID = '${row.value}'`;
                }
                let linkedRowsData;
                if (row.link && row.link !== '') {
                    let linkedRows = res.rows.find(a => a.value === row.link);

                    if (linkedRows) {
                        linkedRowsData = linkedRows;
                    }
                }
                try {
                    const additionalDataRes = await pool.query({
                        text: additionalDataQuery,
                    });

                    let additionalDataRes2;

                    if (modul1) {
                        let apsTabela1 = modul1 + `_` + table1;
                        // if (code1) {
                        //     apsTabela1 = apsTabela1 + `_${code1}`
                        // }
                        let additionalDataQuery2 = `SELECT * FROM ${apsTabela1}`;
                        if (row.text) {
                            additionalDataQuery2 = `SELECT * FROM ${apsTabela1} WHERE ID = '${row.text}'`;
                        }
                        // console.log('additionalDataQuery2:', additionalDataQuery2);

                        additionalDataRes2 = await pool.query({
                            text: additionalDataQuery2,
                        });
                    }

                    let paymentData;
                    let chanelData;

                    try {
                        if (row.link && row.link !== '') {
                            let paymantDataTp = `SELECT * FROM cmn_paymenttp WHERE ID = '${row.link}'`;
                            let chanelDataTp = `SELECT * FROM cmn_obj WHERE ID = '${row.link}'`;

                            const paymentDataRes = await pool.query({
                                text: paymantDataTp,
                            });

                            const chanelDataRes = await pool.query({
                                text: chanelDataTp,
                            });

                            if (paymentDataRes.rows) {
                                paymentData = paymentDataRes.rows;
                            }
                            if (chanelDataRes.rows) {
                                chanelData = chanelDataRes.rows;
                            }
                        }
                    } catch (error) {
                    }

                    // logger.info('additionalData:======================', additionalDataRes.rows);
                    // Add the additional data to the corresponding row
                    res.rows[i] = {
                        ...row,
                        additionalData: additionalDataRes.rows,
                        additionalData2: additionalDataRes2.rows,
                        paymentData: paymentData,
                        chanelData: chanelData
                    };
                } catch (error) {
                    console.error(`Error querying table ${apsTabela}:`, error);
                    // You can handle the error here, for example by setting additionalData to an empty array
                    res.rows[i] = {
                        ...row,
                        additionalData: [],
                        additionalData2: [],
                        paymentData: [],
                        chanelData: []
                    };
                }
            }
        }

        return res.rows;

    } catch (error) {
        logger.error(`Error fetching styles clanska: ${error}`);
        throw new Error('Database error');
    }
}
                      