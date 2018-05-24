
jQuery(function() {
	jQuery('#SMPAYMETHOD_SELECTOR12 .paymethod-thumb').click(function(e){
		openWindow(e);
	});
	jQuery('#SMPAYMETHOD12 .paymethod-thumb').click(function(e){
		openWindow(e);
	});
});

function openWindow(event) {
	window.open('https://www.paypal.com/de/cgi-bin/webscr?cmd=xpt/Marketing/popup/OLCWhatIsPayPal-outside','olcwhatispaypal','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=400, height=500');
	/*
	$.colorbox({
		href:	'https://www.paypal.com/de/cgi-bin/webscr?cmd=xpt/Marketing/popup/OLCWhatIsPayPal-outside',
		title:	'Was ist PayPal',
		width: 	400,
		height: 500,
		iframe:	true
	});
	*/
}

var xnlForms = SMShop.xml.getElementsByTagName("form"), xmlForm = null, xmlShipToForm = null, xmlElement = null;

for(var i=0; i<xnlForms.length(); i++)
{
	if(xnlForms.item(i).getAttribute("name")=="BILLTO") xmlForm = xnlForms.item(i);
	if(xnlForms.item(i).getAttribute("name")=="SHIPTO")	xmlShipToForm = xnlForms.item(i);
}

var shipToName, shipToStreet, shipToStreet2, shipToCity, shipToState, shipToCountry, shipToPhoneNum, shipToZip;

if (xmlShipToForm == null){

	if (xmlForm != null){
		for(var i=0; i<xmlForm.childNodes.length(); i++) {

			xmlElement = xmlForm.childNodes.item(i);

			if (xmlElement.getAttribute("name") == "BILLTO_FIRSTNAME") shipToName = xmlElement.text;
			if (xmlElement.getAttribute("name") == "BILLTO_LASTNAME") shipToName += " " + xmlElement.text;
			if (xmlElement.getAttribute("name") == "BILLTO_STREET_1") shipToStreet = xmlElement.text;
			if (xmlElement.getAttribute("name") == "BILLTO_STREET_2") shipToStreet2 = xmlElement.text;
			if (xmlElement.getAttribute("name") == "BILLTO_CITY") shipToCity = xmlElement.text;
			if (xmlElement.getAttribute("name") == "BILLTO_COUNTRY") shipToCountry = xmlElement.getAttribute("value");
			if (xmlElement.getAttribute("name") == "BILLTO_PHONE_NUMBER") shipToPhoneNum = xmlElement.text;
			if (xmlElement.getAttribute("name") == "BILLTO_POSTCODE") shipToZip = xmlElement.text; 
		}
	}

} else {

	for(var i=0; i<xmlShipToForm.childNodes.length(); i++) {

		xmlElement = xmlShipToForm.childNodes.item(i);

		if (xmlElement.getAttribute("name") == "SHIPTO_FIRSTNAME") shipToName = xmlElement.text;
		if (xmlElement.getAttribute("name") == "SHIPTO_LASTNAME") shipToName += " " + xmlElement.text;
		if (xmlElement.getAttribute("name") == "SHIPTO_STREET_1") shipToStreet = xmlElement.text;
		if (xmlElement.getAttribute("name") == "SHIPTO_STREET_2") shipToStreet2 = xmlElement.text;
		if (xmlElement.getAttribute("name") == "SHIPTO_CITY") shipToCity = xmlElement.text;
		if (xmlElement.getAttribute("name") == "SHIPTO_COUNTRY") shipToCountry = xmlElement.getAttribute("value");
		if (xmlElement.getAttribute("name") == "SHIPTO_PHONE_NUMBER") shipToPhoneNum = xmlElement.text;
		if (xmlElement.getAttribute("name") == "SHIPTO_POSTCODE") shipToZip = xmlElement.text;
	}
}

var SM_PAGEURL_BASKET = SMOMAbsoluteRootURL + "/pg21.html";
var SM_PAGEURL_SHIPMENT = SMOMAbsoluteRootURL + "/plugins/payment/smpaypaypalexpress/RedirectToShipment.php5";
var SM_RECOURCEURL_LOGO = SMOMAbsoluteRootURL + "/../../../images/company_logo.png";

var SM_PAGEURL_VERIFY = SMOMAbsoluteRootURL + "/plugins/payment/smpaypaypalexpress/RedirectToShipment.php5?redirect-location=verify";
var SM_PAGEURL_PAYMENT = SMOMAbsoluteRootURL + "/pg16.html";

var oAmount = new cSMPrice();
oAmount.decode(SMShop.basket.getAttribute(_SMAFinalSum));

function SMPayMethods_saveRedirect(){
	var oSelectedForm = null, sId = '';
	var oActiveMethod = null, sVerify = '';

	for(var i=0;i<document.forms.length;i++){
		if(isPayform(document.forms[i])){
			if(document.forms[i].SMPAYMETHOD_SELECTOR.checked){
				oSelectedForm = document.forms[i];
				sId = document.forms[i].SMPAYMETHOD_SELECTOR.value;
				oActiveMethod = oSMPayMethods.payMethods[sId];
				oActiveMethod.payForm = oSelectedForm;
				break;
			}
		}
	};

	/*
	// OLD
	sVerify = 'SMFRMVerify_' + oSelectedForm.name;
	if(window[sVerify] != null){
		if(window[sVerify]() == false){
			return(false);
		};
	};
	*/

	// NEW
	if(jQuery('form#' + oSelectedForm.name).validate().form() == false ){
		return(false);
	};

	if(SMShop.setPayMethod(oActiveMethod)){
		if
		(
			SMShop.getAttribute("EXPRESS_TOKEN") == ""
			&& SMShop.basket.payMethodInfo.xml.xml().indexOf("PAYPALEXPRESS")>0
		)
		{
			setExpressCheckout();
		}
		else SMGetCheckoutStep('SM_RESERVED_DATA_ENTRY_PAYMENT', false);
	};
	return(false);
};

function setExpressCheckout(){

	jQuery.ajax({
		type:'POST',
		url:'./plugins/payment/smpaypaypalexpress/callerservice.php5',
		data: {
			method:"SetExpressCheckout",
			amt:cprimary.format(oAmount.gross, SM_CNOFORMAT),
			returnurl:SM_PAGEURL_VERIFY,
			cancelurl:SM_PAGEURL_PAYMENT,
			currencycode:"EUR",
			maxamt:"",
			paymentaction:"Sale",
			email:"",
			desc:"",
			custom:"",
			invnum:SMShop.getAttribute("sid"),
			reconfirmshipping:"0",
			noshipping:"0",
			addroverride:"",
			token:"",
			localecode:"DE",
			pagestyle:"0",
			hdrimg:SM_RECOURCEURL_LOGO,
			hdrbordercolor:"ffffff",
			hdrbackcolor:"ffffff",
			payflowcolor:"ffffff",
			giropaysuccessurl:"",
			giropaycancelurl:"",
			banktxnpendingurl:"",
			addroverride:"1",
			shiptoname:shipToName,
			shiptostreet:shipToStreet,
			shiptostreet2:shipToStreet2,
			shiptocity:shipToCity,
			shiptocountry:shipToCountry,
			shiptozip:shipToZip,
			buttonsource:"CART_SMARTSTORE_ECM_DE"
		},
		success: function(data, textStatus, jqXHR){
			var response = new Array();
			response = parseQueryString(unescape(data));
			var timestamp = response["TIMESTAMP"],
				correlationId = response["CORRELATIONID"],
				ack = response["ACK"],
				version = response["VERSION"],
				build = response["BUILD"],
				token = response["TOKEN"];

			//SMShop.setAttribute("sRedirectRequired", response["REDIRECTREQUIRED"]);

			var sReturnMessage = "Zurückkommende Parameter: \n\n";
			sReturnMessage += "TIMESTAMP: " + timestamp + "\n";
			sReturnMessage += "CORRELATIONID: " + correlationId + "\n";
			sReturnMessage += "ACK: " + ack + "\n";
			sReturnMessage += "VERSION: " + version + "\n";
			sReturnMessage += "BUILD: " + build + "\n";
			sReturnMessage += "TOKEN: " + token + "\n";
			expressCheckout(token);
		}
	});
}

function expressCheckout(token){
	var sCheckoutUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=" + token;
	window.open(sCheckoutUrl, "_self");
}

(function()
{
	var filename = "pg16.html";
	var loco = location.pathname;
	if(loco.substring(loco.lastIndexOf("/") + 1) == filename){
		// page: payment
		if( SMShop.basket.payMethodInfo.xml.xml().indexOf("PAYPALEXPRESS")>0 && SMShop.getAttribute("EXPRESS_TOKEN") != "" ) {
			// payment: ppe, skip payment
			if(SMShop.getAttribute("bVerifiedJustVisited") != "true"){
				// forward movement
				SMShop.setAttribute("bVerifiedJustVisited", "false");
				SMShop.update();
				SMGetCheckoutStep("SM_RESERVED_DATA_ENTRY_PAYMENT", false);
			} else {
				// backward movement
				SMShop.setAttribute("bVerifiedJustVisited", "false");
				SMShop.update();
				SMGetCheckoutStep("SM_RESERVED_DATA_ENTRY_PAYMENT", true);
			}
		}
	}

	filename = "pg17.html";
	if(loco.substring(loco.lastIndexOf("/") + 1) == filename)
	{
		// update: visited_verfied_flag 
		SMShop.setAttribute("bVerifiedJustVisited", "true");
		SMShop.update();
		// page: verifiy
		if (SMShop.getAttribute("EXPRESS_TOKEN") == "" && SMShop.basket.payMethodInfo.xml.xml().indexOf("PAYPALEXPRESS")>0){
			// payment: ppe, missing token
			setExpressCheckout();
		}
	}
	else
	{
		// update: visited_verfied_flag
		SMShop.setAttribute("bVerifiedJustVisited", "false");
		SMShop.update();
	}
})();

function parseQueryString(fullHref) {
	try {
		var valuePairs = fullHref.split('&');
		var getArray = new Array();
		for (var i = 0; i < valuePairs.length; i++) {
			// [0] = key, [1] = value
	  		var tempPair = valuePairs[i].split('='); 
			// Unescape converts the text back from URL encoding
			getArray[tempPair[0]] = tempPair[1];
		}
		return getArray;
	}
	catch (e) {}
}

function PAYPALEXPRESS_doPay(oPayForm, bShowWaitForPay){

	var sToken = SMShop.getAttribute("EXPRESS_TOKEN");
	var sPayerID = SMShop.getAttribute("EXPRESS_PAYER_ID");
	var sCountryCode = SMShop.getAttribute("EXPRESS_COUNTRY_CODE");

	var oAmount = new cSMPrice();
	oAmount.decode(SMShop.basket.getAttribute(_SMAFinalSum));

	/*
	if (SMShop.getAttribute("sRedirectRequired") == "true"){
		oWin = new SMPopup();
		with(oWin){
			targetName = "PayPalExpress";
			locationReplace = true;
			showScroll = true;
			showModal = false;
			pWidth = 800;
			pHeight = 560;
			openPage();
		};
	};
	*/

	jQuery.ajax({
		type:'POST',
		url: "./plugins/payment/smpaypaypalexpress/DoExpressCheckoutPayment.php5",
		data: {
			METHOD:"DoExpressCheckoutPayment",
			TOKEN:sToken,
			PAYMENTACTION:"Sale",
			PAYERID:sPayerID,
			AMT:cprimary.format(oAmount.gross, SM_CNOFORMAT),
			CURRENCY:"EUR",
			INVNUM:SMShop.getAttribute("sid"),
			SHIPTONAME:shipToName,
			SHIPTOSTREET:shipToStreet,
			SHIPTOSTREET2:shipToStreet2,
			SHIPTOCITY:shipToCity,
			SHIPTOCOUNTRY:sCountryCode,
			SHIPTOPHONENUM:shipToPhoneNum,
			SHIPTOZIP:shipToZip,
			BUTTONSOURCE:"CART_SMARTSTORE_ECS_DE"
		},
		success: function(data, textStatus, jqXHR){

			var response = new Array();
			response = parseQueryString("?" + data);

			var token = response["TOKEN"],
				timestamp = response["TIMESTAMP"],
				correlationId = response["CORRELATIONID"],
				ack = response["ACK"],
				version = response["VERSION"],
				build = response["BUILD"],
				transactionID = response["TRANSACTIONID"],
				transactionType = response["TRANSACTIONTYPE"],
				paymentType = response["PAYMENTTYPE"],
				orderTime = response["ORDERTIME"],
				amount = response["AMT"],
				currencyCode = response["CURRENCYCODE"],
				paymentStatus = response["PAYMENTSTATUS"],
				pendingReason = response["PENDINGREASON"],
				reasonCode = response["REASONCODE"];

			/*
			var sReturnMessage = "Zurückkommende Parameter: \n\n";
			sReturnMessage += "TIMESTAMP: " + timestamp + "\n";
			sReturnMessage += "CORRELATIONID: " + correlationId + "\n";
			sReturnMessage += "ACK: " + ack + "\n";
			sReturnMessage += "VERSION: " + version + "\n";
			sReturnMessage += "BUILD: " + build + "\n";
			sReturnMessage += "TOKEN: " + token + "\n";

			*/

			var sRedirectRequired = response["REDIRECTREQUIRED"];

			if (response["ACK"].toString() == "Success")
			{
				/*
				SMShop.xml.removeAttribute("EXPRESS_TOKEN");
				SMShop.xml.removeAttribute("EXPRESS_PAYER_ID");
				SMShop.xml.removeAttribute("EXPRESS_COUNTRY_CODE");
				SMShop.xml.removeAttribute("EXPRESS_PAYER_STATUS");
				SMShop.update();
				*/
				if (sRedirectRequired == "true"){

					/*
					with(oWin){
						targetUrl = "https://www.paypal.com/webscr?cmd=_complete-express-checkout&token=" + sToken;
						targetName = "PayPalExpress";
						locationReplace = true;
						showScroll = true;
						showModal = false;
						pWidth = 800;
						pHeight = 560;
						openPage();
					};
					*/

					//window.setTimeout(function(){location.href = SM_PAGEURL_SEND_ORDER_INFO + "?" + data;}, 500);

					SMShop.setAttribute("sRedirectRequired", sRedirectRequired);
					SMShop.update();
					location.href = SM_PAGEURL_SEND_ORDER_INFO + "?" + data;
				} else {
					location.href = SM_PAGEURL_SEND_ORDER_INFO + "?" + data;
				}
			} else {
				location.href = SM_PAGEURL_PURCHASE_ERROR;
			}
		}
	});
};

function PAYPALEXPRESS_setFieldValue(fieldName, fieldValue){
	switch(fieldName){
		//
	};
	return(fieldValue);
};

function PAYPALEXPRESS_beforeSendOrder(params, cancel){
	return(cancel);
};

function PAYPALEXPRESS_removePayFormFields(){
	return(true);
};

function PAYPALEXPRESS_setForwardPayformFieldNames(){
	var sFields = 'TOKEN;TIMESTAMP;CORRELATIONID;ACK;VERSION;BUILD;TRANSACTIONID;TRANSACTIONTYPE;PAYMENTTYPE;ORDERTIME;AMT;CURRENCYCODE;PAYMENTSTATUS;PENDINGREASON;REASONCODE;PPE_SHIPTO_CAPTION;PPE_SHIPTO_COMPANY;PPE_SHIPTO_SALUTATION;PPE_SHIPTO_FIRSTNAME;PPE_SHIPTO_LASTNAME;PPE_SHIPTO_STREET_1;PPE_SHIPTO_STREET_2;PPE_SHIPTO_POSTCODE;PPE_SHIPTO_CITY;PPE_SHIPTO_COUNTRY;PPE_SHIPTO_EMAIL;PPE_SHIPTO_PHONE_NUMBER';
	return(sFields);
};

function PAYPALEXPRESS_setResponseQueryCaptions(param){
	var sCaption = '';
	switch(param.toLowerCase()){
		case 'token': 
			sCaption = '<br><br>TOKEN '; 
			break;
		case 'ack': 
			sCaption = 'RESPONSE STATE'; 
			break;
		default: sCaption = param;
	};
	return(sCaption);
};