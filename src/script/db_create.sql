/*==============================================================*/
/* Table: tic_agenda                                            */
/*==============================================================*/
create table tic_agenda (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   tg                   numeric(20)          not null,
   begtm                varchar(5)           not null,
   endtm                varchar(5)           not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_cmn_seattpatt1 check (valid in (1,0)),
   constraint pk_tic_agenda primary key (id)
);

/*==============================================================*/
/* Table: tic_agendatp                                          */
/*==============================================================*/
create table tic_agendatp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_agendatp1 check (valid in (1,0)),
   constraint pk_tic_agendatp primary key (id)
);

/*==============================================================*/
/* Table: tic_art                                               */
/*==============================================================*/
create table tic_art (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   event                numeric(20)          not null,
   tp                   numeric(20)          not null,
   eancode              varchar(100)         null,
   qrcode               varchar(100)         null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_tic1 check (valid in (1,0)),
   constraint pk_tic_art primary key (id)
);

comment on table tic_art is
'Artikal, karta numerisana vezana za dogadjaj, odredjenog tipa 
Artikal moze da bue vezan za sediste a i ne mora, kao na primer za dostavu
Ako je vezan oda se odnosi na broj sedista na toj lokaciji';

/*==============================================================*/
/* Table: tic_artcena                                           */
/*==============================================================*/
create table tic_artcena (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   event                numeric(20)          not null,
   art                  numeric(20)          not null,
   cena                 numeric(20)          not null,
   value                numeric(16,5)        not null,
   terr                 numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_artcena primary key (id)
);

/*==============================================================*/
/* Table: tic_artseat                                           */
/*==============================================================*/
create table tic_artseat (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   art                  numeric(20)          not null,
   seatloc              numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_artseat primary key (id)
);

/*==============================================================*/
/* Table: tic_arttp                                             */
/*==============================================================*/
create table tic_arttp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_tictp1 check (valid in (1,0)),
   constraint pk_tic_arttp primary key (id)
);

/*==============================================================*/
/* Table: tic_cena                                              */
/*==============================================================*/
create table tic_cena (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   tp                   numeric(20)          null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_cena1 check (valid in (1,0)),
   constraint pk_tic_cena primary key (id)
);

/*==============================================================*/
/* Table: tic_cenatp                                            */
/*==============================================================*/
create table tic_cenatp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_cenatp1 check (valid in (1,0)),
   constraint pk_tic_cenatp primary key (id)
);

/*==============================================================*/
/* Table: tic_chanellseatloc                                    */
/*==============================================================*/
create table tic_chanellseatloc (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   chanell              numeric(20)          not null,
   seatloc              numeric(20)          not null,
   count                numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_chanellseatloc primary key (id)
);

/*==============================================================*/
/* Table: tic_channel                                           */
/*==============================================================*/
create table tic_channel (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_channel1 check (valid in (1,0)),
   constraint pk_tic_channel primary key (id)
);

/*==============================================================*/
/* Table: tic_channeleventpar                                   */
/*==============================================================*/
create table tic_channeleventpar (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   channel              numeric(20)          not null,
   event                numeric(20)          not null,
   par                  numeric(20)          null,
   constraint pk_tic_channeleventpar primary key (id)
);

/*==============================================================*/
/* Table: tic_condtp                                            */
/*==============================================================*/
create table tic_condtp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_condtp1 check (valid in (1,0)),
   constraint pk_tic_condtp primary key (id)
);

comment on table tic_condtp is
'Uslov ya primenu privilegije koja moye biti povezana sa popustom
vremenskii,  brojni,  iznos
';

/*==============================================================*/
/* Table: tic_discount                                          */
/*==============================================================*/
create table tic_discount (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   tp                   numeric(20)          not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_discount1 check (valid in (1,0)),
   constraint pk_tic_discount primary key (id)
);

comment on table tic_discount is
'Popust, staticki';

/*==============================================================*/
/* Table: tic_discounttp                                        */
/*==============================================================*/
create table tic_discounttp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_discounttp1 check (valid in (1,0)),
   constraint pk_tic_discounttp primary key (id)
);

comment on table tic_discounttp is
'Tip popusta';

/*==============================================================*/
/* Table: tic_doc                                               */
/*==============================================================*/
create table tic_doc (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   event                numeric(20)          not null,
   docvr                numeric(20)          not null,
   date                 varchar(10)          not null,
   begtm                varchar(20)          not null,
   ecptm                varchar(20)          null,
   par                  numeric(20)          not null,
   curr                 numeric(20)          null,
   currrate             numeric(16,5)        null,
   "user"               numeric(20)          not null,
   constraint pk_tic_doc primary key (id)
);

/*==============================================================*/
/* Table: tic_docdocslink                                       */
/*==============================================================*/
create table tic_docdocslink (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   doc                  numeric(20)          not null,
   docs                 numeric(20)          not null,
   constraint pk_tic_docdocslink primary key (id)
);

/*==============================================================*/
/* Table: tic_doclink                                           */
/*==============================================================*/
create table tic_doclink (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   doc1                 numeric(20)          not null,
   doc2                 numeric(20)          not null,
   "time"               date                 not null,
   constraint pk_tic_doclink primary key (id)
);

comment on table tic_doclink is
'Reyervacije mogu biti povezane';

/*==============================================================*/
/* Table: tic_docs                                              */
/*==============================================================*/
create table tic_docs (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   doc                  numeric(20)          null,
   art                  numeric(20)          null,
   tgp                  numeric(20)          null,
   taxrate              numeric(16,5)        null,
   price                numeric(16,5)        null,
   input                numeric(16,5)        null,
   output               numeric(16,5)        null,
   discount             numeric(16,5)        null,
   curr                 numeric(20)          null,
   currrate             numeric(16,5)        null,
   "left"               numeric(16,5)        null,
   "right"              numeric(16,5)        null,
   leftcurr             numeric(16,5)        null,
   rightcurr            numeric(16,5)        null,
   begtm                varchar(20)          null,
   endtm                varchar(20)          null,
   constraint pk_tic_docs primary key (id)
);

/*==============================================================*/
/* Table: tic_docslink                                          */
/*==============================================================*/
create table tic_docslink (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   docs1                numeric(20)          null,
   docs2                numeric(20)          null,
   "time"               date                 null,
   constraint pk_tic_docslink primary key (id)
);

/*==============================================================*/
/* Table: tic_doctp                                             */
/*==============================================================*/
create table tic_doctp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_doctg1 check (valid in (1,0)),
   "left"               numeric(1)           not null default 1 
      constraint ckc_tic_doctg2 check ("left" in (1,0)),
   sign                 varchar(1)           not null,
   constraint pk_tic_doctp primary key (id)
);

/*==============================================================*/
/* Table: tic_docvr                                             */
/*==============================================================*/
create table tic_docvr (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   tp                   numeric(20)          not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_docvr1 check (valid in (1,0)),
   constraint pk_tic_docvr primary key (id)
);

comment on table tic_docvr is
'Vrsta dokumenta
-- ulaz
-- rezervacija
-- rezervacija storno
-- kupovina
-- storno kupovina
-- storno kupovina pojedinacna
-- aktivacija
-- aktivacija sa rezervacijom
I sve to preko web-a';

/*==============================================================*/
/* Table: tic_event                                             */
/*==============================================================*/
create table tic_event (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   tp                   numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   begtm                varchar(5)           not null,
   endtm                varchar(5)           not null,
   status               numeric(1)           not null default 1 
      constraint ckc_tic_event1 check (status in (1,0)),
   constraint pk_tic_event primary key (id)
);

/*==============================================================*/
/* Table: tic_eventagenda                                       */
/*==============================================================*/
create table tic_eventagenda (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   event                numeric(20)          not null,
   agenda               numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_eventagenda primary key (id)
);

/*==============================================================*/
/* Table: tic_eventatt                                          */
/*==============================================================*/
create table tic_eventatt (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_eventatt1 check (valid in (1,0)),
   constraint pk_tic_eventatt primary key (id)
);

/*==============================================================*/
/* Table: tic_eventatts                                         */
/*==============================================================*/
create table tic_eventatts (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   event                numeric(20)          not null,
   att                  numeric(20)          not null,
   value                varchar(1000)        null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_eventatts primary key (id)
);

/*==============================================================*/
/* Table: tic_eventcenatp                                       */
/*==============================================================*/
create table tic_eventcenatp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   event                numeric(20)          not null,
   cenatp               numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_eventcenatp primary key (id)
);

/*==============================================================*/
/* Table: tic_eventlink                                         */
/*==============================================================*/
create table tic_eventlink (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   event1               numeric(20)          not null,
   event2               numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   begtm                varchar(5)           not null,
   endtm                varchar(5)           not null,
   constraint pk_tic_eventlink primary key (id)
);

comment on table tic_eventlink is
'Ovde treba obezbediti funkcionalnost
Otkaz
Odloženo';

/*==============================================================*/
/* Table: tic_eventloc                                          */
/*==============================================================*/
create table tic_eventloc (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   event                numeric(20)          not null,
   loc                  numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_eventloc primary key (id)
);

/*==============================================================*/
/* Table: tic_eventtp                                           */
/*==============================================================*/
create table tic_eventtp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_eventtp1 check (valid in (1,0)),
   constraint pk_tic_eventtp primary key (id)
);

/*==============================================================*/
/* Table: tic_naime                                             */
/*==============================================================*/
create table tic_naime (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   par                  numeric(20)          not null,
   docs                 numeric(20)          not null,
   constraint pk_tic_naime primary key (id)
);

comment on table tic_naime is
'Personalizacija karte.
Na ;ije se vodi ime karta
osnovni mati;ni podaci i kontakt';

/*==============================================================*/
/* Table: tic_parprivilege                                      */
/*==============================================================*/
create table tic_parprivilege (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   par                  numeric(20)          not null,
   privilege            numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_parprivilege primary key (id)
);

/*==============================================================*/
/* Table: tic_privilege                                         */
/*==============================================================*/
create table tic_privilege (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   tp                   numeric(20)          not null,
   "limit"              numeric(1)           null default 1 
      constraint ckc_tic_privilege2 check ("limit" is null or ("limit" in (1,2))),
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_privilege1 check (valid in (1,0)),
   constraint pk_tic_privilege primary key (id)
);

comment on column tic_privilege."limit" is
'Da li se primenjuju limiti';

/*==============================================================*/
/* Table: tic_privilegecond                                     */
/*==============================================================*/
create table tic_privilegecond (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   privilege            numeric(20)          not null,
   begcondtp            numeric(20)          not null,
   begcondition         varchar(20)          not null,
   begvalue             varchar(20)          not null,
   endcondtp            numeric(20)          not null,
   endcondition         varchar(20)          not null,
   endvalue             varchar(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_privilegecond primary key (id)
);

comment on table tic_privilegecond is
'Uslov ya primenu privilegije
Na osnovu tipa uslova 
da li je > vremenskii, > brojni,  < ili > iznos
koliko
i do koliko vazi
da li je > vremenskii, > brojni,  < ili > iznos
koliko
';

/*==============================================================*/
/* Table: tic_privilegediscount                                 */
/*==============================================================*/
create table tic_privilegediscount (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   privilege            numeric(20)          not null,
   discount             numeric(20)          not null,
   value                numeric(15,2)        not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_privilegediscount primary key (id)
);

comment on table tic_privilegediscount is
'Popust vezan za neku privilegiju';

/*==============================================================*/
/* Table: tic_privilegelink                                     */
/*==============================================================*/
create table tic_privilegelink (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   privilege1           numeric(20)          not null,
   privilege2           numeric(20)          not null,
   begda                varchar(10)          not null,
   datumod2             varchar(10)          not null,
   constraint pk_tic_privilegelink primary key (id)
);

/*==============================================================*/
/* Table: tic_privilegetp                                       */
/*==============================================================*/
create table tic_privilegetp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_tic_privilegetp1 check (valid in (1,0)),
   constraint pk_tic_privilegetp primary key (id)
);

/*==============================================================*/
/* Table: tic_seat                                              */
/*==============================================================*/
create table tic_seat (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   tp                   numeric(20)          not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_cmn_loc1 check (valid in (1,0)),
   constraint pk_tic_seat primary key (id)
);

comment on table tic_seat is
'Konkretno sediste ili pozicija
Mora imati svoj ID
Grupa sedista ako je parter, onda je kolicina veca od jedan';

/*==============================================================*/
/* Table: tic_seatloc                                           */
/*==============================================================*/
create table tic_seatloc (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   loc                  numeric(20)          not null,
   seat                 numeric(20)          not null,
   count                varchar(500)         not null,
   begda                varchar(10)          not null,
   endda                varchar(10)          not null,
   constraint pk_tic_seatloc primary key (id)
);

comment on table tic_seatloc is
'Ovde treba napraviti funkcionalnost
-- pojedinacnog unosa sedišta za iyabranu lokaciju što je difoltna vrednost
-- ya iyabranu lokaviju unesi sva sedista.';

/*==============================================================*/
/* Table: tic_seattp                                            */
/*==============================================================*/
create table tic_seattp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_cmn_seattp1 check (valid in (1,0)),
   constraint pk_tic_seattp primary key (id)
);

comment on table tic_seattp is
'tip stolice,
tapacirana, 
sklapanje,
fiksna,
montazna,
stajanje';

/*==============================================================*/
/* Table: tic_seattpatt                                         */
/*==============================================================*/
create table tic_seattpatt (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_cmn_seattpatt1 check (valid in (1,0)),
   constraint pk_tic_seattpatt primary key (id)
);

/*==============================================================*/
/* Table: tic_seattpatts                                        */
/*==============================================================*/
create table tic_seattpatts (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   seattp               numeric(20)          not null,
   att                  numeric(20)          not null,
   value                varchar(500)         not null,
   begda                varchar(10)          not null,
   endda                varchar(10)          not null,
   constraint pk_cmn_seattpatts primary key (id)
);

/*==============================================================*/
/* Table: tic_stampa                                            */
/*==============================================================*/
create table tic_stampa (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   docs                 numeric(20)          not null,
   "time"               varchar(20)          null,
   constraint pk_tic_stampa primary key (id)
);

alter table tic_agenda
   add constraint fk_tic_agenda1 foreign key (tg)
      references tic_agendatp (id)
      on delete restrict on update restrict;

alter table tic_art
   add constraint fk_tic_art1 foreign key (tp)
      references tic_arttp (id)
      on delete restrict on update restrict;

alter table tic_art
   add constraint fk_tic_art2 foreign key (event)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_artcena
   add constraint fk_tic_artcena1 foreign key (art)
      references tic_art (id)
      on delete restrict on update restrict;

alter table tic_artcena
   add constraint fk_tic_artcena2 foreign key (cena)
      references tic_cena (id)
      on delete restrict on update restrict;

alter table tic_artseat
   add constraint fk_tic_artseat1 foreign key (art)
      references tic_art (id)
      on delete restrict on update restrict;

alter table tic_artseat
   add constraint fk_tic_artseat2 foreign key (seatloc)
      references tic_seatloc (id)
      on delete restrict on update restrict;

alter table tic_cena
   add constraint fk_tic_cena1 foreign key (tp)
      references tic_cenatp (id)
      on delete restrict on update restrict;

alter table tic_chanellseatloc
   add constraint fk_tic_chanellseatloc1 foreign key (chanell)
      references tic_channel (id)
      on delete restrict on update restrict;

alter table tic_chanellseatloc
   add constraint fk_tic_chanellseatloc2 foreign key (seatloc)
      references tic_seatloc (id)
      on delete restrict on update restrict;

alter table tic_channeleventpar
   add constraint fk_tic_channeleventpar1 foreign key (channel)
      references tic_channel (id)
      on delete restrict on update restrict;

alter table tic_channeleventpar
   add constraint fk_tic_channeleventpar2 foreign key (event)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_channeleventpar
   add constraint fk_tic_channeleventpar3 foreign key (par)
      references cmn_par (id)
      on delete restrict on update restrict;

alter table tic_discount
   add constraint fk_tic_discount1 foreign key (tp)
      references tic_discounttp (id)
      on delete restrict on update restrict;

alter table tic_doc
   add constraint fk_tic_doc1 foreign key (docvr)
      references tic_docvr (id)
      on delete restrict on update restrict;

alter table tic_docdocslink
   add constraint fk_tic_docdocslink1 foreign key (doc)
      references tic_doclink (id)
      on delete restrict on update restrict;

alter table tic_docdocslink
   add constraint fk_tic_docdocslink2 foreign key (docs)
      references tic_docslink (id)
      on delete restrict on update restrict;

alter table tic_doclink
   add constraint fk_tc_doclink1 foreign key (doc1)
      references tic_doc (id)
      on delete restrict on update restrict;

alter table tic_doclink
   add constraint fk_tc_doclink2 foreign key (doc2)
      references tic_doc (id)
      on delete restrict on update restrict;

alter table tic_docs
   add constraint fk_tic_docs1 foreign key (id)
      references tic_doc (id)
      on delete restrict on update restrict;

alter table tic_docs
   add constraint fk_tic_docs2 foreign key (art)
      references tic_art (id)
      on delete restrict on update restrict;

alter table tic_docslink
   add constraint fk_tc_docslink2 foreign key (docs1)
      references tic_docs (id)
      on delete restrict on update restrict;

alter table tic_docslink
   add constraint fk_tc_docslink3 foreign key (docs2)
      references tic_docs (id)
      on delete restrict on update restrict;

alter table tic_docvr
   add constraint fk_tic_docvr1 foreign key (tp)
      references tic_doctp (id)
      on delete restrict on update restrict;

alter table tic_event
   add constraint fk_tic_event1 foreign key (tp)
      references tic_eventtp (id)
      on delete restrict on update restrict;

alter table tic_eventagenda
   add constraint fk_tic_eventagenda1 foreign key (event)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_eventagenda
   add constraint fk_tic_eventagenda2 foreign key (agenda)
      references tic_agenda (id)
      on delete restrict on update restrict;

alter table tic_eventatts
   add constraint fk_tic_eventatts1 foreign key (event)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_eventatts
   add constraint fk_tic_eventatts2 foreign key (att)
      references tic_eventatt (id)
      on delete restrict on update restrict;

alter table tic_eventcenatp
   add constraint fk_tic_eventcenatp1 foreign key (event)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_eventcenatp
   add constraint fk_tic_eventcenatp2 foreign key (cenatp)
      references tic_cenatp (id)
      on delete restrict on update restrict;

alter table tic_eventlink
   add constraint fk_tic_eventlink1 foreign key (event1)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_eventlink
   add constraint fk_tic_eventlink2 foreign key (event2)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_eventloc
   add constraint fk_tic_eventloc1 foreign key (event)
      references tic_event (id)
      on delete restrict on update restrict;

alter table tic_naime
   add constraint fk_tc_naime1 foreign key (docs)
      references tic_docs (id)
      on delete restrict on update restrict;

alter table tic_parprivilege
   add constraint fk_tic_parprivilege1 foreign key (privilege)
      references tic_privilege (id)
      on delete restrict on update restrict;

alter table tic_privilege
   add constraint fk_tic_privilege1 foreign key (tp)
      references tic_privilegetp (id)
      on delete restrict on update restrict;

alter table tic_privilegecond
   add constraint fk_tic_privilegecond1 foreign key (privilege)
      references tic_privilege (id)
      on delete restrict on update restrict;

alter table tic_privilegecond
   add constraint fk_tic_privilegecond2 foreign key (begcondtp)
      references tic_condtp (id)
      on delete restrict on update restrict;

alter table tic_privilegecond
   add constraint fk_tic_privilegecond3 foreign key (endcondtp)
      references tic_condtp (id)
      on delete restrict on update restrict;

alter table tic_privilegediscount
   add constraint fk_tic_privilegediscount1 foreign key (privilege)
      references tic_privilege (id)
      on delete restrict on update restrict;

alter table tic_privilegediscount
   add constraint fk_tic_privilegediscount2 foreign key (discount)
      references tic_discount (id)
      on delete restrict on update restrict;

alter table tic_privilegelink
   add constraint fk_tic_privilegelink1 foreign key (privilege1)
      references tic_privilege (id)
      on delete restrict on update restrict;

alter table tic_privilegelink
   add constraint fk_tic_privilegelink2 foreign key (privilege2)
      references tic_privilege (id)
      on delete restrict on update restrict;

alter table tic_seat
   add constraint fk_cmn_seat1 foreign key (tp)
      references tic_seattp (id)
      on delete restrict on update restrict;

alter table tic_seatloc
   add constraint fk_cmn_seatloc2 foreign key (seat)
      references tic_seat (id)
      on delete restrict on update restrict;

alter table tic_seattpatts
   add constraint fk_cmn_seattpatts1 foreign key (seattp)
      references tic_seattp (id)
      on delete restrict on update restrict;

alter table tic_seattpatts
   add constraint fk_cmn_seattpatts2 foreign key (att)
      references tic_seattpatt (id)
      on delete restrict on update restrict;

alter table tic_stampa
   add constraint fk_tic_stampa1 foreign key (docs)
      references tic_docs (id)
      on delete restrict on update restrict;

--*****************************************************--    
     
SELECT
  '"'||table_name||'": { "attributes":'||
  json_object_agg(column_name, 
    CASE data_type
      WHEN 'numeric' THEN 'number'
      ELSE 'string'
    END
  )||'},' AS attributes
FROM
  (
select *
 FROM
  information_schema.columns
 WHERE
  table_schema LIKE 'iis'
 order by
  table_name, ordinal_position  
  ) a
WHERE
  table_schema LIKE 'iis'
  and table_name like 'tic_%'
GROUP BY
  table_name; 

--*****************************************************--
 SELECT
  '"'||table_name||'": '||
  json_object_agg(column_name, 
    CASE data_type
      WHEN 'numeric' 
      THEN (
      	coalesce(column_default, null )
      	)
      ELSE (
      coalesce(column_default, '' )
      )
    END
  )||',' AS attributes
FROM
  (
select *
 FROM
  information_schema.columns
 WHERE
  table_schema LIKE 'iis'
 order by
  table_name, ordinal_position  
  ) a
WHERE
  table_schema LIKE 'iis'
  and table_name like 'tic_%'
GROUP BY
  table_name; 

--*****************************************************--

 
 select 'router.use('||chr(39)||'/'||(replace (a.table_name, '_', '/'))||chr(39)||', checkPermissions(), abstruct)'
 		col 
 from (
select distinct table_name 
 FROM
  information_schema.columns 
 WHERE
  table_schema LIKE 'iis'
  and table_name like 'tic_%'  
 order by
  table_name
  ) a;

