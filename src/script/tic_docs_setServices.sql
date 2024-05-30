--DROP FUNCTION IF EXISTS tic_docs_setservices;

CREATE OR REPLACE FUNCTION tic_docs_setservices(
    u_id numeric(20),
    u_site numeric(20),
    u_docvr numeric(20),
    u_date varchar(10),
    u_tm varchar(20),
    u_curr numeric(20),
    u_currrate numeric(16,5),
    u_usr numeric(20),
    u_status varchar(20),
    u_docobj numeric(20),
    u_broj numeric(20),
    u_obj2 numeric(20),
    u_opis varchar(2000),
    u_timecreation varchar(20),
    u_storno numeric(1),
    u_year numeric(4),
    u_channel numeric(20),
    u_usersys numeric(20),
    u_endtm varchar(25),
    u_reservation numeric(2),
    u_delivery numeric(2),
    u_paymenttp numeric(20), 
    action_tp varchar
) RETURNS void AS $$
DECLARE 
    tic_docs_row tic_docs %ROWTYPE;
    tic_art_row tic_art %ROWTYPE;
    pId numeric(20);
    tic_docs_record1 RECORD;
	tic_docs_record2 RECORD;  
    tic_docs_record3 RECORD;
	tic_docs_record4 RECORD; 
	tic_docs_record5 RECORD;

    pValue varchar;
    pText varchar;
    pTextIznos numeric(15, 2);
    pProcent varchar;
    pMinfee varchar;

    pArt numeric(20);
    pNart varchar;
    pTgp numeric(20);
    pTax numeric(15, 2);
    pPrice numeric(15, 2);
   	pBroj numeric(10);
   
   pCountry numeric(20) = null;

BEGIN 
    pValue = 0;
       
    -- Brisanje veza između karte i naknade
    DELETE FROM tic_docslink
    WHERE docs2 IN (
        SELECT s.id
        FROM tic_docs s
        WHERE s.doc = u_id
    );
    
    -- Brisanje svih naknada
    DELETE FROM tic_docs
    WHERE doc = u_id
    AND art IN (
        SELECT a.id
        FROM tic_art a
        JOIN tic_arttp t ON t.id = a.tp AND t.code = 'Н'
    );
       
    -- Dodavanje naknade za ONLINE plaćanje Н1
    IF u_paymenttp = 1726939201251184640 THEN
        -- Uzimam vrednosti naziva naknade, tarifne grupe i stope za Н1
        SELECT a.id, a.text, t.id, sum(tr.rate) AS rate 
        INTO pArt, pNart, pTgp, pTax
        FROM tic_artx_v a
        JOIN cmn_tgpx_v t ON a.tgp = t.id
        JOIN cmn_tgptax tgx ON t.id = tgx.tgp
        JOIN cmn_tax tx ON tgx.tax = tx.id
        JOIN cmn_taxrate tr ON tx.id = tr.tax
        WHERE a.code = 'Н1'
        AND to_date(tgx.begda, 'YYYYMMDD') <= current_date
        AND to_date(tgx.endda, 'YYYYMMDD') > current_date
        AND to_date(tr.begda, 'YYYYMMDD') <= current_date
        AND to_date(tr.endda, 'YYYYMMDD') > current_date
        GROUP BY a.id, a.text, t.id;
       
   

    
        -- Za svaku stavku/kartu transakcije
        FOR tic_docs_record1 IN
            SELECT s.*
            FROM tic_docs s
            WHERE s.doc = u_id 
        loop
	        
	        -- Za naknadu dovlačim postavke iz eventa - procenat i minimalnu naknadu po karti
	        SELECT s.value, s.text, substring(s.condition, 1, length(s.condition) - 1) AS procent, s.minfee 
	        INTO pValue, pText, pProcent, pMinfee
	        FROM tic_eventatts s
	        JOIN tic_eventatt t ON t.id = s.att
	        where s.text = pArt::varchar
	        and s.event = tic_docs_record1.event 
	       	and t.code = '08.00.'; 	        
            -- Novi ID za tic_docs i tic_docslink
            pId = nextval('tic_table_id_seq');
        
            -- Iznos naknade
            pPrice = tic_docs_record1.price * (CAST(pProcent AS numeric) * 0.01);
        
            IF pPrice < CAST(pMinfee AS numeric) THEN 
                pPrice = CAST(pMinfee AS numeric);
            END IF;
--            pTextIznos = pText * 0.01 * pPrice;
           	pTextIznos = (pTax * 0.01 * pPrice)/(1 + pTax * 0.01);
        
            INSERT INTO tic_docs 
            VALUES (pId, null, tic_docs_record1.doc, tic_docs_record1.event, tic_docs_record1.loc, pArt, pTgp, pTax, pPrice, 0, 
                    tic_docs_record1.output, 0, tic_docs_record1.curr, tic_docs_record1.currrate, pTextIznos, 
                    tic_docs_record1.duguje, pPrice, tic_docs_record1.leftcurr, tic_docs_record1.output * pPrice, tic_docs_record1.begtm, 
                    tic_docs_record1.endtm, tic_docs_record1.status, tic_docs_record1.fee, tic_docs_record1.par, tic_docs_record1.descript, 
                    tic_docs_record1.cena, tic_docs_record1.reztm, tic_docs_record1.storno, pNart, tic_docs_record1.row, 
                    tic_docs_record1.label, tic_docs_record1.seat, tic_docs_record1.vreme, null, null, 
                    null, tic_docs_record1.delivery );
            
            INSERT INTO tic_docslink 
            VALUES (pId, null, pId, tic_docs_record1.id, CURRENT_TIMESTAMP);
        
        END LOOP;
    END IF;
   
    -- Dodavanje naknade za NAKNADE ZA STAMPU plaćanje Н2, 
    -- !!!! Samo razdvajam kod jer se ovo uvek izvrsava
    IF '08.00.00.' = '08.00.00.' THEN
        -- Uzimam vrednosti naziva naknade, tarifne grupe i stope za Н2
        SELECT a.id, a.text, t.id, sum(tr.rate) AS rate 
        INTO pArt, pNart, pTgp, pTax
        FROM tic_artx_v a
        JOIN cmn_tgpx_v t ON a.tgp = t.id
        JOIN cmn_tgptax tgx ON t.id = tgx.tgp
        JOIN cmn_tax tx ON tgx.tax = tx.id
        JOIN cmn_taxrate tr ON tx.id = tr.tax
        WHERE a.code = 'Н2'
        AND to_date(tgx.begda, 'YYYYMMDD') <= current_date
        AND to_date(tgx.endda, 'YYYYMMDD') > current_date
        AND to_date(tr.begda, 'YYYYMMDD') <= current_date
        AND to_date(tr.endda, 'YYYYMMDD') > current_date
        GROUP BY a.id, a.text, t.id;
    
        -- Za svaku stavku/kartu transakcije, koja ima tip karte REGULAR - TCTP1 
        FOR tic_docs_record2 IN
            SELECT s.*
            FROM tic_docs s, cmn_obj o
            WHERE s.doc = u_id 
            and o.code = 'TCTP1'
            and s.tickettp = o.id
        loop
	        
	        -- Za naknadu dovlačim postavke iz eventa - procenat i minimalnu naknadu po karti
	        SELECT s.value::numeric, s.text, substring(s.condition, 1, length(s.condition) - 1) AS procent, s.minfee 
	        INTO pValue, pText, pProcent, pMinfee
	        FROM tic_eventatts s
	        JOIN tic_eventatt t ON t.id = s.att
	        where s.text = pArt::varchar
	        and s.event = tic_docs_record2.event 
	       	and t.code = '08.00.00.'; 	
	       
            -- Novi ID za tic_docs i tic_docslink
            pId = nextval('tic_table_id_seq');
        
            -- Iznos naknade
            pPrice = tic_docs_record2.price * (CAST(pProcent AS numeric) * 0.01);
        
            IF pPrice < CAST(pMinfee AS numeric) THEN 
                pPrice = CAST(pMinfee AS numeric);
            END IF;
--            pTextIznos = pText * 0.01 * pPrice;
           pTextIznos = (pTax * 0.01 * pPrice)/(1 + pTax * 0.01);
        
            INSERT INTO tic_docs 
            VALUES (pId, null, tic_docs_record2.doc, tic_docs_record2.event, tic_docs_record2.loc, pArt, pTgp, pTax, pPrice, 0, 
                    tic_docs_record2.output, 0, tic_docs_record2.curr, tic_docs_record2.currrate, pTextIznos, 
                    tic_docs_record2.duguje, pPrice, tic_docs_record2.leftcurr, tic_docs_record2.output * pPrice, tic_docs_record2.begtm, 
                    tic_docs_record2.endtm, tic_docs_record2.status, tic_docs_record2.fee, tic_docs_record2.par, tic_docs_record2.descript, 
                    tic_docs_record2.cena, tic_docs_record2.reztm, tic_docs_record2.storno, pNart, tic_docs_record2.row, 
                    tic_docs_record2.label, tic_docs_record2.seat, tic_docs_record2.vreme, tic_docs_record2.ticket, tic_docs_record2.services, 
                    tic_docs_record2.tickettp, tic_docs_record2.delivery );
            
            INSERT INTO tic_docslink 
            VALUES (pId, null, pId, tic_docs_record2.id, CURRENT_TIMESTAMP);
        
        END LOOP;
    END IF;
   
-- Dodavanje naknade za NAPLATU NA PRODAJNOM MESTU  Н3  
    IF u_paymenttp = 1 or u_paymenttp = 2  THEN
        -- Uzimam vrednosti naziva naknade, tarifne grupe i stope za Н1
        SELECT a.id, a.text, t.id, sum(tr.rate) AS rate 
        INTO pArt, pNart, pTgp, pTax
        FROM tic_artx_v a
        JOIN cmn_tgpx_v t ON a.tgp = t.id
        JOIN cmn_tgptax tgx ON t.id = tgx.tgp
        JOIN cmn_tax tx ON tgx.tax = tx.id
        JOIN cmn_taxrate tr ON tx.id = tr.tax
        WHERE a.code = 'Н3'
        AND to_date(tgx.begda, 'YYYYMMDD') <= current_date
        AND to_date(tgx.endda, 'YYYYMMDD') > current_date
        AND to_date(tr.begda, 'YYYYMMDD') <= current_date
        AND to_date(tr.endda, 'YYYYMMDD') > current_date
        GROUP BY a.id, a.text, t.id;
       
   

    
        -- Za svaku stavku/kartu transakcije
        FOR tic_docs_record3 IN
            SELECT s.*
            FROM tic_docs s
            WHERE s.doc = u_id 
        loop
	        
	        -- Za naknadu dovlačim postavke iz eventa - procenat i minimalnu naknadu po karti
	        SELECT s.value, s.text, substring(s.condition, 1, length(s.condition) - 1) AS procent, s.minfee 
	        INTO pValue, pText, pProcent, pMinfee
	        FROM tic_eventatts s
	        JOIN tic_eventatt t ON t.id = s.att
	        WHERE s.text = pArt::varchar
	        and s.event = tic_docs_record3.event 
	       	and t.code = '08.00.'; 	        
            -- Novi ID za tic_docs i tic_docslink
            pId = nextval('tic_table_id_seq');
        
            -- Iznos naknade
            pPrice = tic_docs_record3.price * (CAST(pProcent AS numeric) * 0.01);
        
            IF pPrice < CAST(pMinfee AS numeric) THEN 
                pPrice = CAST(pMinfee AS numeric);
            END IF;
--            pTextIznos = pText * 0.01 * pPrice;
           pTextIznos = (pTax * 0.01 * pPrice)/(1 + pTax * 0.01);
        
            INSERT INTO tic_docs 
            VALUES (pId, null, tic_docs_record3.doc, tic_docs_record3.event, tic_docs_record3.loc, pArt, pTgp, pTax, pPrice, 0, 
                    tic_docs_record3.output, 0, tic_docs_record3.curr, tic_docs_record3.currrate, pTextIznos, 
                    tic_docs_record3.duguje, pPrice, tic_docs_record3.leftcurr, tic_docs_record3.output * pPrice, tic_docs_record3.begtm, 
                    tic_docs_record3.endtm, tic_docs_record3.status, tic_docs_record3.fee, tic_docs_record3.par, tic_docs_record3.descript, 
                    tic_docs_record3.cena, tic_docs_record3.reztm, tic_docs_record3.storno, pNart, tic_docs_record3.row, 
                    tic_docs_record3.label, tic_docs_record3.seat, tic_docs_record3.vreme, null, null, 
                    null, tic_docs_record3.delivery );
            
            INSERT INTO tic_docslink 
            VALUES (pId, null, pId, tic_docs_record3.id, CURRENT_TIMESTAMP);
        
        END LOOP;
    END IF; 
-- Dodavanje naknade za REZERVACIJU  Н4  
    IF u_reservation = 1  THEN
        -- Uzimam vrednosti naziva naknade, tarifne grupe i stope za Н1
        SELECT a.id, a.text, t.id, sum(tr.rate) AS rate 
        INTO pArt, pNart, pTgp, pTax
        FROM tic_artx_v a
        JOIN cmn_tgpx_v t ON a.tgp = t.id
        JOIN cmn_tgptax tgx ON t.id = tgx.tgp
        JOIN cmn_tax tx ON tgx.tax = tx.id
        JOIN cmn_taxrate tr ON tx.id = tr.tax
        WHERE a.code = 'Н4'
        AND to_date(tgx.begda, 'YYYYMMDD') <= current_date
        AND to_date(tgx.endda, 'YYYYMMDD') > current_date
        AND to_date(tr.begda, 'YYYYMMDD') <= current_date
        AND to_date(tr.endda, 'YYYYMMDD') > current_date
        GROUP BY a.id, a.text, t.id;
          
        -- Za svaku stavku/kartu transakcije
        FOR tic_docs_record4 IN
            SELECT s.*
            FROM tic_docs s
            join tic_art a on  a.id = s.art
            join tic_arttp t on t.id = a.tp and t.code in ('K', 'CK')
            WHERE s.doc = u_id 
        loop
	        
	        -- Za naknadu dovlačim postavke iz eventa - procenat i minimalnu naknadu po karti
	        SELECT s.value, s.text, substring(s.condition, 1, length(s.condition) - 1) AS procent, s.minfee 
	        INTO pValue, pText, pProcent, pMinfee
	        FROM tic_eventatts s
	        JOIN tic_eventatt t ON t.id = s.att
	        WHERE s.text = pArt::varchar
	        and s.event = tic_docs_record4.event 
	       	and t.code = '08.00.'; 
	       	       
            -- Novi ID za tic_docs i tic_docslink
            pId = nextval('tic_table_id_seq');
     
            -- Iznos naknade
            pPrice = tic_docs_record4.price * CAST(pProcent AS numeric) * 0.01; -- (pProcent * 0.01);
        
            IF pPrice < CAST(pMinfee AS numeric) THEN 
                pPrice = CAST(pMinfee AS numeric);
            END IF;

          	pTextIznos := (pTax * 0.01 / (1 + pTax * 0.01)) * pPrice ;
    
 RAISE NOTICE 'H4 03 --';          
            INSERT INTO tic_docs 
            VALUES (pId, null, tic_docs_record4.doc, tic_docs_record4.event, tic_docs_record4.loc, pArt, pTgp, pTax, pPrice, 0, 
                    tic_docs_record4.output, 0, tic_docs_record4.curr, tic_docs_record4.currrate, pTextIznos, 
                    tic_docs_record4.duguje, pPrice, tic_docs_record4.leftcurr, tic_docs_record4.output * pPrice, tic_docs_record4.begtm, 
                    tic_docs_record4.endtm, tic_docs_record4.status, tic_docs_record4.fee, tic_docs_record4.par, tic_docs_record4.descript, 
                    tic_docs_record4.cena, tic_docs_record4.reztm, tic_docs_record4.storno, pNart, tic_docs_record4.row, 
                    tic_docs_record4.label, tic_docs_record4.seat, tic_docs_record4.vreme, null, null, 
                    null, tic_docs_record4.delivery );
            
            INSERT INTO tic_docslink 
            VALUES (pId, null, pId, tic_docs_record4.id, CURRENT_TIMESTAMP);
        
        END LOOP;
    END IF;
   

    -- Dodavanje naknade za NAKNADE ZA DOSTAVU plaćanje Н5, 
    IF u_delivery = 1  THEN
        -- Uzimam vrednosti naziva naknade, tarifne grupe i stope za Н2
        SELECT a.id, a.text, t.id, sum(tr.rate) AS rate 
        INTO pArt, pNart, pTgp, pTax
        FROM tic_artx_v a
        JOIN cmn_tgpx_v t ON a.tgp = t.id
        JOIN cmn_tgptax tgx ON t.id = tgx.tgp
        JOIN cmn_tax tx ON tgx.tax = tx.id
        JOIN cmn_taxrate tr ON tx.id = tr.tax
        WHERE a.code = 'Н5'
        AND to_date(tgx.begda, 'YYYYMMDD') <= current_date
        AND to_date(tgx.endda, 'YYYYMMDD') > current_date
        AND to_date(tr.begda, 'YYYYMMDD') <= current_date
        AND to_date(tr.endda, 'YYYYMMDD') > current_date
        GROUP BY a.id, a.text, t.id;
       
       select d.country
       into pCountry
       from	tic_docdelivery d
       where d.doc = u_id;
       
       IF pCountry IS NOT NULL THEN    
               -- Za svaku stavku/kartu transakcije
       		pBroj = 0;
	        FOR tic_docs_record5 IN
	            SELECT distinct s.event
	            FROM tic_docs s
	            join tic_art a on  a.id = s.art
	            join tic_arttp t on t.id = a.tp and t.code in ('K', 'CK')
	            WHERE s.doc = u_id 
	        loop
		        if pBrpj = 0 then
			        -- Za naknadu dovlačim postavke iz eventa - procenat i minimalnu naknadu po karti
			        SELECT s.value::numeric, s.text, s.condition::numeric, s.minfee 
			        INTO pValue, pText, pPrice, pMinfee
			        FROM tic_eventatts s
			        JOIN tic_eventatt t ON t.id = s.att
			        WHERE s.text = pArt::varchar
			        AND s.event = tic_docs_record5.event 
			        and s.value = pCountry::varchar
			       	and t.code = '08.04.'; 	
			       
		            -- Novi ID za tic_docs i tic_docslink
		            pId = nextval('tic_table_id_seq');
		        
		            -- Iznos naknade
		--            pPrice = pIznos;
		        
		            pTextIznos = (pTax * 0.01 * CAST(pPrice AS numeric))/(1 + pTax * 0.01);
		        
		            INSERT INTO tic_docs 
		            VALUES (pId, null, tic_docs_record5.doc, tic_docs_record5.event, tic_docs_record5.loc, pArt, pTgp, pTax, pPrice, 0, 
		                    tic_docs_record5.output, 0, tic_docs_record5.curr, tic_docs_record5.currrate, pTextIznos, 
		                    tic_docs_record5.duguje, pPrice, tic_docs_record5.leftcurr, tic_docs_record5.output * pPrice, tic_docs_record5.begtm, 
		                    tic_docs_record5.endtm, tic_docs_record5.status, tic_docs_record5.fee, tic_docs_record5.par, tic_docs_record5.descript, 
		                    tic_docs_record5.cena, tic_docs_record5.reztm, tic_docs_record5.storno, pNart, tic_docs_record5.row, 
		                    tic_docs_record5.label, tic_docs_record5.seat, tic_docs_record5.vreme, tic_docs_record5.ticket, tic_docs_record5.services, 
		                    tic_docs_record5.tickettp, tic_docs_record5.delivery );
		            
		            INSERT INTO tic_docslink 
		            VALUES (pId, null, pId, tic_docs_record5.id, CURRENT_TIMESTAMP);
	           pBroj=pBroj+1;
	          end if;
           	END LOOP;
       end if;
    END IF;
   
   
   

    EXCEPTION
        WHEN OTHERS THEN -- U slučaju greške, poništavanje transakcije
            RAISE;
END;
$$ LANGUAGE plpgsql;
