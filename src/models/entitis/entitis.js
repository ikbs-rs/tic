const entitiesInfo = 
{
	"tic_agenda": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tg": "number",
		"begtm": "string",
		"endtm": "string",
		"valid": "number"
	  }
	},
	"tic_agendatp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_agendatpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_agendax": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_art": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tp": "number",
		"um": "number",
		"tgp": "number",
		"eancode": "string",
		"qrcode": "string",
		"valid": "number",
		"grp": "number",
		"color": "string",
    	"icon": "string",
    	"amount": "number"
	  }
	},
	"tic_artcena": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"event": "number",
		"art": "number",
		"cena": "number",
		"value": "number",
		"terr": "number",
		"begda": "string",
		"endda": "string",
		"curr": "number"
	  }
	},
	"tic_eventartcena": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"event": "number",
		"art": "number",
		"cena": "number",
		"value": "number",
		"terr": "number",
		"begda": "string",
		"endda": "string",
		"curr": "number",
		"eventart": "number"
	  }
	},
	"tic_artgrp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_artgrpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_artlink": {
		"attributes": {
			"id": "number",
			"site": "number",
			"art1": "number",
			"art2": "number",
			"tp": "string"
		}
	},
	"tic_eventartlink": {
		"attributes": {
			"id": "number",
			"site": "number",
			"eventart1": "number",
			"eventart2": "number",
			"tp": "string"
		}
	},
	"tic_artprivilege": {
		"attributes": {
		  "id": "number",
		  "site": "number",
		  "art": "number",
		  "privilege": "number",
		  "begda": "string",
		  "endda": "string",
		  "value": "string"
	   }
	},
	"tic_artloc": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"art": "number",
		"loc": "number",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_eventartloc": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"eventart": "number",
		"loc": "number",
		"begda": "string",
		"endda": "string"
	  }
	},

	"tic_eventobj": {
		"attributes": {
		  "id": "number",
		  "site": "number",
		  "event": "number",
		  "objtp": "number",
		  "obj": "number",
		  "begda": "string",
		  "endda": "string",
		  "begtm": "string",
		  "endtm": "string",
		  "color": "string",
		  "icon": "string"
		}
	  },	
	"tic_arttax": {
	  "attributes": {
		"id": "number",
		"art": "number",
		"tax": "number",
		"value": "string",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_arttp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_arttpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_artx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_cena": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tp": "number",
		"valid": "number",
		"color": "string",
    	"icon": "string"
	  }
	},
	"tic_cenatp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_cenatpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_cenax": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_chanellseatloc": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"chanell": "number",
		"seatloc": "number",
		"count": "number",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_channel": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_channeleventpar": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"channel": "number",
		"event": "number",
		"par": "number"
	  }
	},
	"tic_channelx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_condtp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_condtpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_discount": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tp": "number",
		"valid": "number"
	  }
	},
	"tic_discounttp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_discounttpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_discountx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_doc": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"docvr": "number",
		"date": "string",
		"tm": "string",
		"curr": "number",
		"currrate": "number",
		"usr": "number",
		"status": "string",
		"docobj": "number",
		"broj": "number",
		"obj2": "number",
		"opis": "string",
		"timecreation": "string",
		"storno": "number",
		"year": "number"
	  }
	},
	"tic_docb": {
		"attributes": {
			"id": "number",
			"site": "number",
			"doc": "number",
			"tp": "string",
			"bcontent": "number"
		}
	},	
	"tic_docdocslink": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"doc": "number",
		"docs": "number"
	  }
	},
	"tic_doclink": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"doc1": "number",
		"doc2": "number",
		"time": "string"
	  }
	},
	"tic_docdelivery": {
		"attributes": {
			"id": "number",
			"site": "number",
			"doc": "number",
			"courier": "number",
			"delivery_adress": "string",
			"amount": "number",
			"dat": "string",
			"datdelivery": "string",
			"status": "string",
			"note": "string",
			"parent": "number"
		}
	},	
	"tic_docpayment": {
		"attributes": {
			"id": "number",
			"site": "number",
			"doc": "number",
			"paymenttp": "number",
			"amount": "number",
			"bcontent": "number",
			"ccard": "number"
		}
	},	
	"tic_docs": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"doc": "number",
		"event": "number",
		"loc": "number",
		"art": "number",
		"tgp": "number",
		"taxrate": "number",
		"price": "number",
		"input": "number",
		"output": "number",
		"discount": "number",
		"curr": "number",
		"currrate": "number",
		"duguje": "number",
		"potrazuje": "number",
		"leftcurr": "number",
		"rightcurr": "number",
		"begtm": "string",
		"endtm": "string",
		"status": "string",
		"fee": "number",
		"par": "number",
		"descript": "string"
	  }
	},
	"tic_docslink": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"docs1": "number",
		"docs2": "number",
		"time": "string"
	  }
	},
	"tic_doctp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number",
		"duguje": "number",
		"znak": "string"
	  }
	},
	"tic_doctpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_docvr": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tp": "number",
		"valid": "number"
	  }
	},
	"tic_docvrx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_event": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tp": "number",
		"begda": "string",
		"endda": "string",
		"begtm": "string",
		"endtm": "string",
		"status": "number",
		"descript": "string",
		"note": "string",
		"event": "number",
		"ctg": "number",
		"loc": "number",
		"par": "number",
		"tmp": "number",
		"season": "number"
	  }
	},
	"tic_eventagenda": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"event": "number",
		"agenda": "number",
		"date": "string"
	  }
	},
	"tic_eventart": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"event": "number",
		"art": "number",
		"descript": "string",
		"begda": "string",
		"endda":  "string",
		"nart": "string",
		"discount":  "number",
		"color": "string",
    	"icon": "string"
	  }
	},
	"tic_eventatttp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_eventatttpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},	
	"tic_eventatt": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number",
		"inputtp": "number",
		"ddlist": "string",
		"tp": "number"
	  }
	},
	"tic_eventatts": {
		"attributes": {
		  "id": "number",
		  "site": "number",
		  "event": "number",
		  "att": "number",
		  "value": "string",
		  "valid": "number",
		  "text": "string",
		  "color": "string",
		  "icon": "string",
		  "condition": "string"
		}
	  },
	"tic_eventattx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_eventcenatp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"event": "number",
		"cenatp": "number",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_eventctg": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_eventctgx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_eventlink": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"event1": "number",
		"event2": "number",
		"note": "string"
	  }
	},
	"tic_eventloc": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"event": "number",
		"loc": "number",
		"begda": "string",
		"endda": "string",
		"color": "string",
    	"icon": "string"
	  }
	},
	"tic_events": {
	  "attributes": {
		"id": "number",
		"selection_duration": "string",
		"payment_duration": "string",
		"booking_duration": "string",
		"max_ticket": "number",
		"online_payment": "number",
		"cash_payment": "number",
		"delivery_payment": "number",
		"presale_enabled": "number",
		"presale_until": "string",
		"presale_discount": "number",
		"presale_discount_absolute": "number"
	  }
	},
	"tic_eventtp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_eventtps": {
		"attributes": {
		  "id": "number",
		  "site": "number",
		  "eventtp": "number",
		  "att": "number",
		  "value": "string",
		  "begda": "string",
		  "endda": "string"
		}
	  },	
	"tic_eventtpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_eventx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_parprivilege": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"par": "number",
		"privilege": "number",
		"begda": "string",
		"endda": "string",
		"maxprc": "number",
		"maxval": "number"
	  }
	},
	"tic_privilege": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tp": "number",
		"limitirano": "number",
		"valid": "number"
	  }
	},
	"tic_privilegecond": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"privilege": "number",
		"begcondtp": "number",
		"begcondition": "string",
		"begvalue": "string",
		"endcondtp": "number",
		"endcondition": "string",
		"endvalue": "string",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_privilegediscount": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"privilege": "number",
		"discount": "number",
		"value": "number",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_privilegelink": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"privilege1": "number",
		"privilege2": "number",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_privilegetp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_privilegetpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_privilegex": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_paycard": {
		"attributes": {
			"id": "number",
			"site": "number",
			"docpayment": "number",
			"ccard": "number",
			"owner": "number",
			"cardnum": "string",
			"code": "string",
			"dat": "string",
			"amount": "number",
			"status": "number"
		}
	},
	"tic_season": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_seasonx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},	
	"tic_seat": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"tp": "number",
		"valid": "number"
	  }
	},
	"tic_seatloc": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"loc": "number",
		"seat": "number",
		"count": "string",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_seattp": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_seattpatt": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"code": "string",
		"text": "string",
		"valid": "number"
	  }
	},
	"tic_seattpatts": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"seattp": "number",
		"att": "number",
		"value": "string",
		"begda": "string",
		"endda": "string"
	  }
	},
	"tic_seattpattx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_seattpx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_seatx": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"tableid": "number",
		"lang": "string",
		"grammcase": "number",
		"text": "string"
	  }
	},
	"tic_speccheck": {
		"attributes": {
			"id": "number",
			"site": "number",
			"docpayment": "number",
			"bank": "number",
			"code1": "string",
			"code2": "string",
			"code3": "string",
			"amount": "number"
	}
  },	
	"tic_stampa": {
	  "attributes": {
		"id": "number",
		"site": "number",
		"docs": "number",
		"time": "string"
	  }
	}
  }
export default {
  entitiesInfo,
}
