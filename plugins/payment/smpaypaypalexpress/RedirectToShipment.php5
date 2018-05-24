<!DOCTYPE html>
<html>
<head>
<title>Redirect</title>
<meta http-equiv="content-type" content="text/html; charset=windows-1252">
<meta name="robots" content="noindex,follow">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="pragma" content="no-cache">
<script type="text/javascript">
	var SMOMAbsoluteBasePath = "../../../";
	var SMOMCurrentPath = "plugins/payment/smpaypaypalexpress";
	var SMOMAbsoluteRootURL = location.href.substring(0, location.href.lastIndexOf("/") - SMOMCurrentPath.length);
	if(SMOMAbsoluteRootURL.charAt(SMOMAbsoluteRootURL.length - 1)=="/") SMOMAbsoluteRootURL = SMOMAbsoluteRootURL.substring(0, SMOMAbsoluteRootURL.length - 1);
	var SMOMIsCheckout = true;
</script>
<script src="../../../js/modernizr-latest.js?v=6.4.5" type="text/javascript"></script>
<script src="../../../js/jquery-latest.js?v=6" type="text/javascript"></script>
<script src="../../../js/smartstore.base.js?v=6" type="text/javascript"></script>
<script src="../../../js/smjslib.js?v=6" type="text/javascript"></script>
<script src="../../../js/eSMOMEvents.js?v=6" type="text/javascript"></script>
<script src="../../../js/smartstore.checkout.js?v=6" type="text/javascript"></script>
</head>
<body>
<script type="text/javascript">
function parseQueryString(fullHref) {
	try {
		var hrefParts = fullHref.split('?');
		//  [0] is the URL, [1] is the query string
		var query = hrefParts[1];
		var valuePairs = query.split('&');
		var getArray = new Array();
		for (var i = 0; i < valuePairs.length; i++) {
			// [0] = key, [1] = value
	  		var tempPair = valuePairs[i].split('='); 
			// Unescape converts the text back from URL encoding
			getArray[tempPair[0]] = unescape(tempPair[1]);
		}
		return getArray;
	}
	catch (e) {}
}

var getArray = parseQueryString(location.search);

if (getArray["token"].toString() != ""){
	var params = "TOKEN: " + getArray["token"].toString() + "\n";
	params += "PayerID: " + getArray["PayerID"].toString() + "\n";
	//alert(params);
	jQuery.ajax({
		type:'POST',
		url: "../../../plugins/payment/smpaypaypalexpress/GetExpressCheckoutDetails.php5",
		data: {
			token:getArray["token"].toString(), 
			PayerID:getArray["PayerID"].toString()
		},
		success: function(data, textStatus, jqXHR){
			//alert(transport.responseText);
			var response = new Array();
			response = parseQueryString("?" + data);
			var token = response["TOKEN"],
				email = response["EMAIL"],
				payerID = response["PAYERID"],
				payerStatus = response["PAYERSTATUS"],
				salutation = response["SALUTATION"],
				firstname = response["FIRSTNAME"],
				middlename = response["MIDDLENAME"],
				lastname = response["LASTNAME"],
				suffix = response["SUFFIX"],
				countrycode = response["COUNTRYCODE"],
				business = response["BUSINESS"],
				shipToName = response["SHIPTONAME"],
				shipToStreet = response["SHIPTOSTREET"],
				shipToStreet2 = response["SHIPTOSTREET2"],
				shipToCity = response["SHIPTOCITY"],
				shipToState = response["SHIPTOSTATE"],
				shipToCountry = response["SHIPTOCOUNTRYCODE"],
				shipToZip = response["SHIPTOZIP"],
				addressStatus = response["ADDRESSSTATUS"],
				custom = response["CUSTOM"],
				invum = response["INVNUM"],
				phoneNum = response["PHONENUM"],
				redirectRequired = response["REDIRECTREQUIRED"];

			//SMShop.setAttribute("sRedirectRequired", response["REDIRECTREQUIRED"]);

			var shipToFirstName = shipToName.substr(0, shipToName.lastIndexOf(" "));
			var shipToLastName = shipToName.substr(shipToName.lastIndexOf(" "), shipToName.length);

			var sReturnMessage = "Zurückkommende Parameter: \n\n";
			sReturnMessage += "TOKEN: " + token + "\n";
			sReturnMessage += "EMAIL: " + email + "\n";
			sReturnMessage += "PAYERID: " + payerID + "\n";
			sReturnMessage += "PAYERSTATUS: " + payerStatus + "\n";
			sReturnMessage += "SALUTATION: " + salutation + "\n";
			sReturnMessage += "FIRSTNAME: " + firstname + "\n";
			sReturnMessage += "MIDDLENAME: " + middlename + "\n";
			sReturnMessage += "LASTNAME: " + lastname + "\n";
			sReturnMessage += "SUFFIX: " + suffix + "\n";
			sReturnMessage += "COUNTRYCODE: " + countrycode + "\n";
			sReturnMessage += "BUSINESS: " + business + "\n";
			sReturnMessage += "SHIPTONAME: " + shipToName + "\n";
			sReturnMessage += "SHIPTOSTREET: " + shipToStreet + "\n";
			sReturnMessage += "SHIPTOSTREET2: " + shipToStreet2 + "\n";
			sReturnMessage += "SHIPTOCITY: " + shipToCity + "\n";
			sReturnMessage += "SHIPTOSTATE: " + shipToState + "\n";
			sReturnMessage += "SHIPTOCOUNTRY: " + shipToCountry + "\n";
			sReturnMessage += "SHIPTOZIP: " + shipToZip + "\n";			
			sReturnMessage += "ADDRESSSTATUS: " + addressStatus + "\n";
			sReturnMessage += "CUSTOM: " + custom + "\n";
			sReturnMessage += "INVNUM: " + invum + "\n";
			sReturnMessage += "PHONENUM: " + phoneNum + "\n";
			sReturnMessage += "REDIRECTREQUIRED: " + redirectRequired + "\n";
			//alert(sReturnMessage);

			var xnlForms = SMShop.xml.getElementsByTagName("form");
			var xmlFormShipTo = null, xmlFormBillTo = null;

			for(var i=0; i<xnlForms.length(); i++)
			{
				if(xnlForms.item(i).getAttribute("name")=="SHIPTO") xmlFormShipTo = xnlForms.item(i);
				if(xnlForms.item(i).getAttribute("name")=="BILLTO") xmlFormBillTo = xnlForms.item(i);
			}

			var element = null,
			xmlElement = null, attributeValue = "value", attributeName = "name", attributeElement = "element", attributeType = "type", caption = "caption";

			if (xmlFormBillTo != null)
			{
				if (xmlFormShipTo == null)
				{
					//Lieferadresse anlegen
					xmlFormShipTo = SMShop.xml.ownerDocument.createNode("form");
					xmlFormShipTo.setAttribute("name", "SHIPTO");
					SMShop.xml.appendChild(xmlFormShipTo);
				} 

				if (business != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_COMPANY", business);
				if (salutation != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_SALUTATION", salutation);
				if (shipToFirstName != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_FIRSTNAME", shipToFirstName);
				if (shipToLastName != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_LASTNAME", shipToLastName);
				if (shipToStreet != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_STREET_1", shipToStreet);
				if (shipToStreet2 != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_STREET_2", shipToStreet2);
				if (shipToZip != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_POSTCODE", shipToZip);
				if (shipToCity != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_CITY", shipToCity);
				if (shipToCountry != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_COUNTRY", shipToCountry);
				if (email != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_EMAIL", email);
				if ((phoneNum != undefined) && (phoneNum != "")) UpdateElement(xmlFormShipTo, "SHIPTO_PHONE_NUMBER", phoneNum);
			}

			if (xmlFormBillTo == null && xmlFormShipTo == null)
			{
				xmlFormShipTo = SMShop.xml.ownerDocument.createNode("form");
				xmlFormShipTo.setAttribute("name", "BILLTO");
				SMShop.xml.appendChild(xmlFormShipTo);

				if (business != undefined) UpdateElement(xmlFormShipTo, "BILLTO_COMPANY", business);
				if (salutation != undefined) UpdateElement(xmlFormShipTo, "BILLTO_SALUTATION", salutation);
				if (shipToFirstName != undefined) UpdateElement(xmlFormShipTo, "BILLTO_FIRSTNAME", shipToFirstName);
				if (shipToLastName != undefined) UpdateElement(xmlFormShipTo, "BILLTO_LASTNAME", shipToLastName);
				if (shipToStreet != undefined) UpdateElement(xmlFormShipTo, "BILLTO_STREET_1", shipToStreet);
				if (shipToStreet2 != undefined) UpdateElement(xmlFormShipTo, "BILLTO_STREET_2", shipToStreet2);
				if (shipToZip != undefined) UpdateElement(xmlFormShipTo, "BILLTO_POSTCODE", shipToZip);
				if (shipToCity != undefined) UpdateElement(xmlFormShipTo, "BILLTO_CITY", shipToCity);
				if (shipToCountry != undefined) UpdateElement(xmlFormShipTo, "BILLTO_COUNTRY", shipToCountry);
				if (email != undefined) UpdateElement(xmlFormShipTo, "BILLTO_EMAIL", email);
				if (phoneNum != undefined || phoneNum != "") UpdateElement(xmlFormShipTo, "BILLTO_PHONE_NUMBER", phoneNum);

				xmlFormShipTo = SMShop.xml.ownerDocument.createNode("form");
				xmlFormShipTo.setAttribute("name", "SHIPTO");
				SMShop.xml.appendChild(xmlFormShipTo);

				if (business != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_COMPANY", business);
				if (salutation != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_SALUTATION", salutation);
				if (shipToFirstName != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_FIRSTNAME", shipToFirstName);
				if (shipToLastName != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_LASTNAME", shipToLastName);
				if (shipToStreet != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_STREET_1", shipToStreet);
				if (shipToStreet2 != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_STREET_2", shipToStreet2);
				if (shipToZip != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_POSTCODE", shipToZip);
				if (shipToCity != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_CITY", shipToCity);
				if (shipToCountry != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_COUNTRY", shipToCountry);
				if (email != undefined) UpdateElement(xmlFormShipTo, "SHIPTO_EMAIL", email);
				if (phoneNum != undefined || phoneNum != "") UpdateElement(xmlFormShipTo, "SHIPTO_PHONE_NUMBER", phoneNum);

				SMShop.update();
			}

			function UpdateElement(xmlForm, key, value)
			{
				var xmlElement = null;
				for(var i=0; i<xmlForm.childNodes.length(); i++)
				{
					if(xmlForm.childNodes.item(i).getAttribute(attributeName) == key)
					{
						xmlElement = xmlForm.childNodes.item(i);
						break;
					}
				}
				if(xmlElement==null)
				{
					xmlElement = SMShop.xml.ownerDocument.createNode("element");
					xmlElement.setAttribute(attributeName, key);
					xmlForm.appendChild(xmlElement);
				}
				if(xmlElement!=null) xmlElement.text = value;
			}

			var objPayForm = SMShop.xml.ownerDocument.createNode("form");objPayForm.setAttribute("name", "PAYPALEXPRESS12");var objPayElement = SMShop.xml.ownerDocument.createNode("element");objPayElement.setAttribute("name", "SMPAYMETHOD_SELECTOR");objPayElement.setAttribute("type", "radio");objPayElement.setAttribute("value", "12");objPayForm.appendChild(objPayElement);var objPayMethod = {id: 12, publicId: "P-01011",taxkey: 1, name: "PayPal", desc: "PayPal ist der Online-Zahlungsservice, mit dem Sie in Online-Shops sicher, einfach und schnell bezahlen - und das kostenlos.", chargeType: 0, chargeValue: 0, payForm: null};SMShop.basket.payMethodInfo.setPayMethod(objPayMethod);SMShop.basket.payMethodInfo.xml.appendChild(objPayForm);

			/* Express Parameter */
			if (token != undefined) SMShop.setAttribute("EXPRESS_TOKEN", token);
			if (payerID != undefined) SMShop.setAttribute("EXPRESS_PAYER_ID", payerID);
			if (payerStatus != undefined) SMShop.setAttribute("EXPRESS_PAYER_STATUS", payerStatus);
			if (countrycode != undefined) SMShop.setAttribute("EXPRESS_COUNTRY_CODE", countrycode);
			if (redirectRequired != undefined) SMShop.setAttribute("REDIRECTREQUIRED", redirectRequired);

			/* Add PayPal-address via Parameter */
			var xml = SMShop.basket.payMethodInfo.xml;
			var xelForm = xml.selectSingleNode("form");

			UpdateElement(xelForm, "PPE_SHIPTO_CAPTION", "<br><b>Bei PayPal hinterlegte Lieferadresse</b>");
			if (business != undefined) UpdateElement(xelForm, "PPE_SHIPTO_COMPANY", "Firma: " + business);
			if (salutation != undefined) UpdateElement(xelForm, "PPE_SHIPTO_SALUTATION", "Anrede: " + salutation);
			if (shipToFirstName != undefined) UpdateElement(xelForm, "PPE_SHIPTO_FIRSTNAME", "Vorname: " + shipToFirstName);
			if (shipToLastName != undefined) UpdateElement(xelForm, "PPE_SHIPTO_LASTNAME", "Nachname: " + shipToLastName);
			if (shipToStreet != undefined) UpdateElement(xelForm, "PPE_SHIPTO_STREET_1", "Strasse: " + shipToStreet);
			if (shipToStreet2 != undefined) UpdateElement(xelForm, "PPE_SHIPTO_STREET_2", "Strasse 2: " + shipToStreet2);
			if (shipToZip != undefined) UpdateElement(xelForm, "PPE_SHIPTO_POSTCODE", "PLZ: " + shipToZip);
			if (shipToCity != undefined) UpdateElement(xelForm, "PPE_SHIPTO_CITY", "Stadt: " + shipToCity);
			if (shipToCountry != undefined) UpdateElement(xelForm, "PPE_SHIPTO_COUNTRY", "Land: " + shipToCountry);
			if (email != undefined) UpdateElement(xelForm, "PPE_SHIPTO_EMAIL", "Email: " + email);
			if ((phoneNum != undefined) && (phoneNum != "")) UpdateElement(xelForm, "PPE_SHIPTO_PHONE_NUMBER", "Telefon: " + phoneNum);

			SMShop.update();

			<?php
				$redirect_location = $_GET['redirect-location'];
				echo 'var redirectLocation = "'.$redirect_location.'"';
			?>

			if (redirectLocation != "verify")			
				location.replace("../../../" + "pg15.html");
			else 
				location.replace("../../../" + "pg17.html");
		}
	});
}
</script>
</body>
</html>
