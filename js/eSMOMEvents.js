

function SMShop_noDataAvailable(args){
var $SMS = args[0], _id = $SMS.id, _xml = null;
	// no data available during init
	_xml = SMSession.getSession(_id);
	if(_xml==null) _xml = SMSession.xml.createNode(_id);
	if(_xml!=null) $SMS.xml = _xml;
};

function SMBasket_noDataAvailable(args){
var $SMB = args[0], $SMS = $SMB.parent,
	_doc = $SMS.xml.ownerDocument, _id = $SMB.id, _xml = null;
	// no data available during init
	_xml = $SMS.xml.appendChild(_doc.createNode(_id));
	if(_xml!=null) $SMB.xml = _xml;
};

function SMShipMethodInfo_noDataAvailable(args){
var _SMShipMethodInfo = args[0], $SMB = _SMShipMethodInfo.parent,
	_doc = $SMB.xml.ownerDocument, _id = _SMShipMethodInfo.id, _xml = null;
	// no data available during init
	_xml = $SMB.xml.appendChild(_doc.createNode(_id));
	if(_xml!=null) _SMShipMethodInfo.xml = _xml;
};

function SMPayMethodInfo_noDataAvailable(args){
var _SMPayMethodInfo = args[0], $SMB = _SMPayMethodInfo.parent,
	_doc = $SMB.xml.ownerDocument, _id = _SMPayMethodInfo.id, _xml = null;
	// no data available during init
	_xml = $SMB.xml.appendChild(_doc.createNode(_id));
	if(_xml!=null) _SMPayMethodInfo.xml = _xml;
};

function SMGDiscounts_noDataAvailable(args){
var _SMGDiscounts = args[0], $SMB = _SMGDiscounts.parent,
	_doc = $SMB.xml.ownerDocument, _id = _SMGDiscounts.id, _xml = null;
	// no data available during init
	_xml = $SMB.xml.appendChild(_doc.createNode(_id));
	if(_xml!=null) _SMGDiscounts.xml = _xml;
	};

function SMProduct_noDataAvailable(args){
var $SMP = args[0], $SMS = $SMP.shop, _id = $SMP.id, _xml = null;
	// no data available during init
	_xml = $SMS.xml.ownerDocument.createNode(_id);
	if(_xml!=null){
		$SMP.xml = _xml;
	};
};

function SMDiscounts_noDataAvailable(args){
var _SMDiscounts = args[0], $SMP = _SMDiscounts.parent,
	_doc = $SMP.xml.ownerDocument, _id = _SMDiscounts.id, _xml = null;
	// no data available during init
	_xml = $SMP.xml.appendChild(_doc.createNode(_id));
	if(_xml!=null) _SMDiscounts.xml = _xml;
};

function SMVariants_noDataAvailable(args){
var _SMVariants = args[0], $SMP = _SMVariants.parent,
	_doc = $SMP.xml.ownerDocument, _id = _SMVariants.id, _xml = null;
	// no data available during init
	_xml = $SMP.xml.appendChild(_doc.createNode(_id));
	if(_xml!=null) _SMVariants.xml = _xml;
};

function SMShop_onAfterUpdate(args){
var $SMS = args[0], _id = $SMS.id, _xml = $SMS.xml;
	// after shop update update and save session object
	SMSession.setSession(_id, "xmlnode", _xml);
	SMSession.save();
};

function SMProduct_onBeforeUpdate(args){
var $SMP = args[0], _index = 0, _frm = _elem = _params = null;
	_frm = document.forms["PD" + $SMP.getAttribute(_SMAUniqueID) + "variants"];
	if(_frm!=null&&($SMP.variants.xml.childNodes.length()==0||$SMP.getAttribute("s-var")=="1")){
		_params = new Array();
		for(var i=0; i<_frm.elements.length; i++){
			_index = _frm.elements[i].selectedIndex;
			if(_index<0) _index = 0;
			_elem = _frm.elements[i].options[_index];
			_params[_params.length] = _elem.text;
			_params[_params.length] = _elem.value;
			};
		$SMP.variants.newSimpleVariant.apply($SMP.variants, _params);
	};
	return(true);
};

function SMProduct_onAfterUpdate(args){
	var $SMP = args[0], $min = $max = $amnt = 0, $update = false;
	$min = parseInt($SMP.getAttribute(_SMAMinAmount));
	$max = parseInt($SMP.getAttribute(_SMAMaxAmount));
	$amnt = parseFloat($SMP.getAttribute(_SMAAmount));
	if($amnt < $min){
		$amnt = $min; $update = true;
		} else if($max > 0 && $amnt > $max){
		$amnt = $max; $update = true;
		};
	if($update){
		$SMP.setAttribute(_SMAAmount, $amnt);
		$SMP.update();
		};
};

function SMBasket_onBeforeReset(args){
	// before resetting basket confirm
	jQuery.confirm(
		T["msg.basket-delete"],
		function() { SMShop.basket.reset(true); }, /* yes */
		null, /* no */
		{ modal: true, draggable: false } /* args */
	);
	return false;
};

function SMBasket_onAfterReset(args){
	// after resetting basket reload
	location.replace(location.href);
};

function SMBasket_onBeforeAdd(args){

	SMShop.basket.bProductUpdated = false;

	var $SMB = args[0], $SMP = args[1], $SMS = $SMB.parent, _frm = null,
		_elem = null, _params = new Array(), _msg = "";
	// before adding a product, check whether another order
	// has been completed earlier

	if($SMS.getAttribute(_SMAOComplete)=="true"){
		$SMS.reinitOrder();
	};

	return(true);
};

function SMBasket_onAfterAdd(args){

	var $SMB = args[0], $SMP = args[1];

	if(!SMShop.basket.bProductUpdated){
		jQuery.createDialog(T['lbl.hint'], T['msg.basket-after-add'], { 
			modal: 			true,
			draggable: 		false,
            buttons: [
            	{
            		text: T["dlg.ok"],
            		click: function() { jQuery.destroyDialog(this); }
            	},
            	{
            		text: T["dlg.go-to-basket"],
            		"class": 'special',
                	click: function() { location.href = SMOMAbsoluteRootURL + "/pg21.html"; }
            	}
            ]
		});
	}	
};

function SMBasket_onItemExists(args){
	var $SMB = args[0], _SMNewProduct = args[1], _SMExistingProduct = args[2];
	// item exists in basket, return action flag
	// * _eSMReplace	: replace existing item 
	// * _eSMAdd			: add to basket
	// * _eSMCancel		: cancel action

	SMShop.basket.bProductUpdated = true;

	//JQuery
	

		jQuery.createDialog(T['lbl.hint'], T['msg.basket-item-exists'], { 
			modal: 			true,
			draggable: 		false,
			buttons: [
				{
					text: T["dlg.ok"],
					click : function(){ jQuery.destroyDialog(this); }
				},
				{
					text: T["dlg.go-to-basket"],
            		"class": 'special',
					click: function(){ location.href = SMOMAbsoluteRootURL + "/pg21.html"; }
				}
			]
		});
	

	return(_eSMReplace);
};

function SMBasket_onBeforeRemove(args){
	var $SMB = args[0], $SMP = args[1], $SMI = args[2], $msg = "Sind Sie sicher, dass Sie das Produkt '%d' mit der Artikelnummer '%n' aus dem Warenkorb entfernen möchten?";
	// before removing a product confirm
	$msg = $msg.replace("%d", $SMP.name);
	$msg = $msg.replace("%n", $SMP.getAttribute(_SMACode));

	//jQuery
	jQuery.createDialog("Bestätigen", $msg, { 
		modal: 			true,
		draggable: 		false,
		buttons: {
			"OK": function(){ 
	        	//remove product
				SMShop.basket.remove($SMI, true);
				jQuery.destroyDialog(this); 
			},
			"Abbrechen": function(){ 
				jQuery.destroyDialog(this);
			}
		}
	});
	return false;
};

function SMBasket_onAfterRemove(args){
	// reload page after deleting a product;
	var $SMP = args[1];
};

function SMShipMethodInfo_onAfterUpdate(args){
	// update SMShop after recalculating the shipment costs
	SMShop.update();
};

function SMPayMethodInfo_onAfterUpdate(args){
	// update SMShop after recalculating the payment costs
	SMShop.update();
};

function SMShop_variantSelectionChanged(args){
var $SMP = args[0], _form = args[1], _varset = _vartext = "", _index = 0, _elem = null;
	_elem = document.getElementById("variant_not_found");
	if(_elem!=null) _elem.style.display = "none";
	// update product variant properties after changes occured in
	// the variants html form
	if($SMP.variants.xml.childNodes.length()!=0){
		for(var i=0; i<_form.elements.length; i++){
			_elem = _form.elements[i];
			_index = _elem.options.selectedIndex;
			if(_index<0) _index = 0;
			if(_varset!="") _varset += ";";
			if(_vartext!="") _vartext += ",";
			_varset += _elem.options[_index].value;
			_vartext += (_elem.options[_index].text).replace(/,/g, "&comma;");
			};
		$SMP.variants.activateByValues(_varset, _vartext);
		$SMP.update();
		displayProductProperties($SMP);
	};
};

function SMShop_onBasketGUIElemChanged(args){
	var $SMS = args[0], _elem = args[1], index = args[2], _form = null, _name = "", $SMP = null, _uniqueID = "", _variantID = "";
	// update product amount after changes occured in the
	// basket graphical user interface
	if(_elem!=null){
		_name = _elem.id.replace("PD", "");
		_name = _name.replace("Amount", "");
		if(_name.indexOf("-")){
			_uniqueID = _name.split("-")[0];
			_variantID = _name.split("-")[1];
			}
		else _uniqueID = _name;
		if(index>=0){
			$SMP = $SMS.basket.getProductByIndex(index);
			}
		else if(_variantID!=""){
			$SMP = $SMS.basket.getProductById(_uniqueID, _variantID);
			}
		else $SMP = $SMS.basket.getProductById(_uniqueID);
		if($SMP!=null){
			$SMP.setAttribute(_SMAAmount, _elem.value);
			$SMP.update();
			$SMS.basket.update();
			};
	};
};

function SMVariants_onAfterActivate(args){
	var _SMVariants = args[0];
	// update form controls, if any
	_SMVariants.refreshFormControls();
};

		/* sm:broker-ssl begin-edit */
		var useSSLForCheckout = false;
		var sharedSSLURL = "";
		/* sm:broker-ssl end-edit */

		var sPHPSessionUrl = "";
		
		sPHPSessionUrl = (sharedSSLURL==""?SMOMAbsoluteRootURL + "/phpsession.php":"");
		

		var SMFirstInit = false;
		var SMSession = new SXMLSessionManager(sPHPSessionUrl);
		SMFirstInit = SMSession.init("", useSSLForCheckout, sharedSSLURL);

		var SMShop = new cSMShop("SMShop");
		SMShop.init();

		SMShop.basket.bProductUpdated = false;

		// 5.5.7 Surcharge Calculator Options
		SMShop.calculateSurchargePerAmount = 0; // (0,1)
		//
		with(SMShop){
		// set basic data
			setAttribute(_SMAInGross, 1); // Gross Prices Entered (0,1)
			setAttribute(_SMAOutGross, 1); // Display Gross Prices (0,1)
			setAttribute(_SMARoundTo, 0); // Round Final Amount (100,50,10,5,0)
			setAttribute(_SMAMinAmount, 0);
			regions[0] = new Array(0, "DE", "Deutschland", 19, 7, 0, 0, true, false, 2, "^DE[ ]{0,1}[0-9]{9}$");
			regions[1] = new Array(1, "AT", "Österreich", 20, 10, 0, 0, false, false, 2, "^AT[ ]{0,1}U[0-9]{8}$");
			regions[2] = new Array(2, "CH", "Schweiz", 8, 2.5, 3.8, 0, false, false, 0, "");
			regions[3] = new Array(3, "AF", "Afghanistan", 0, 0, 0, 0, false, false, 0, "");
			regions[4] = new Array(4, "AX", "Åland", 0, 0, 0, 0, false, false, 0, "");
			regions[5] = new Array(5, "AL", "Albania", 0, 0, 0, 0, false, false, 0, "");
			regions[6] = new Array(6, "DZ", "Algeria", 0, 0, 0, 0, false, false, 0, "");
			regions[7] = new Array(7, "AS", "American Samoa", 0, 0, 0, 0, false, false, 0, "");
			regions[8] = new Array(8, "AD", "Andorra", 0, 0, 0, 0, false, false, 0, "");
			regions[9] = new Array(9, "AO", "Angola", 0, 0, 0, 0, false, false, 0, "");
			regions[10] = new Array(10, "AI", "Anguilla", 0, 0, 0, 0, false, false, 0, "");
			regions[11] = new Array(11, "AQ", "Antarctica", 0, 0, 0, 0, false, false, 0, "");
			regions[12] = new Array(12, "AG", "Antigua and Barbuda", 0, 0, 0, 0, false, false, 0, "");
			regions[13] = new Array(13, "AR", "Argentina", 0, 0, 0, 0, false, false, 0, "");
			regions[14] = new Array(14, "AM", "Armenia", 0, 0, 0, 0, false, false, 0, "");
			regions[15] = new Array(15, "AW", "Aruba", 0, 0, 0, 0, false, false, 0, "");
			regions[16] = new Array(16, "AU", "Australia", 10, 0, 0, 0, false, false, 0, "");
			regions[17] = new Array(17, "AZ", "Azerbaijan", 0, 0, 0, 0, false, false, 0, "");
			regions[18] = new Array(18, "BS", "Bahamas", 0, 0, 0, 0, false, false, 0, "");
			regions[19] = new Array(19, "BH", "Bahrain", 0, 0, 0, 0, false, false, 0, "");
			regions[20] = new Array(20, "BD", "Bangladesh", 0, 0, 0, 0, false, false, 0, "");
			regions[21] = new Array(21, "BB", "Barbados", 0, 0, 0, 0, false, false, 0, "");
			regions[22] = new Array(22, "BY", "Belarus", 0, 0, 0, 0, false, false, 0, "");
			regions[23] = new Array(23, "BE", "Belgium", 21, 12, 0, 0, false, false, 2, "^BE[ ]{0,1}[0-9]{10}$");
			regions[24] = new Array(24, "BZ", "Belize", 0, 0, 0, 0, false, false, 0, "");
			regions[25] = new Array(25, "BJ", "Benin", 0, 0, 0, 0, false, false, 0, "");
			regions[26] = new Array(26, "BM", "Bermuda", 0, 0, 0, 0, false, false, 0, "");
			regions[27] = new Array(27, "BT", "Bhutan", 0, 0, 0, 0, false, false, 0, "");
			regions[28] = new Array(28, "BO", "Bolivia", 0, 0, 0, 0, false, false, 0, "");
			regions[29] = new Array(29, "BA", "Bosnia and Herzegovina", 0, 0, 0, 0, false, false, 0, "");
			regions[30] = new Array(30, "BW", "Botswana", 0, 0, 0, 0, false, false, 0, "");
			regions[31] = new Array(31, "BV", "Bouvet Island", 0, 0, 0, 0, false, false, 0, "");
			regions[32] = new Array(32, "BR", "Brazil", 0, 0, 0, 0, false, false, 0, "");
			regions[33] = new Array(33, "IO", "British Indian Ocean Territory", 0, 0, 0, 0, false, false, 0, "");
			regions[34] = new Array(34, "BN", "Brunei Darussalam", 0, 0, 0, 0, false, false, 0, "");
			regions[35] = new Array(35, "BF", "Burkina Faso", 0, 0, 0, 0, false, false, 0, "");
			regions[36] = new Array(36, "BI", "Burundi", 0, 0, 0, 0, false, false, 0, "");
			regions[37] = new Array(37, "KH", "Cambodia", 0, 0, 0, 0, false, false, 0, "");
			regions[38] = new Array(38, "CM", "Cameroon", 0, 0, 0, 0, false, false, 0, "");
			regions[39] = new Array(39, "CA", "Canada", 0, 0, 0, 0, false, false, 0, "");
			regions[40] = new Array(40, "CV", "Cape Verde", 0, 0, 0, 0, false, false, 0, "");
			regions[41] = new Array(41, "KY", "Cayman Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[42] = new Array(42, "CF", "Central African Republic", 0, 0, 0, 0, false, false, 0, "");
			regions[43] = new Array(43, "TD", "Chad", 0, 0, 0, 0, false, false, 0, "");
			regions[44] = new Array(44, "CL", "Chile", 0, 0, 0, 0, false, false, 0, "");
			regions[45] = new Array(45, "CN", "China", 0, 0, 0, 0, false, false, 0, "");
			regions[46] = new Array(46, "CX", "Christmas Island", 0, 0, 0, 0, false, false, 0, "");
			regions[47] = new Array(47, "CC", "Cocos (Keeling) Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[48] = new Array(48, "CO", "Colombia", 0, 0, 0, 0, false, false, 0, "");
			regions[49] = new Array(49, "KM", "Comoros", 0, 0, 0, 0, false, false, 0, "");
			regions[50] = new Array(50, "CG", "Congo (Brazzaville)", 0, 0, 0, 0, false, false, 0, "");
			regions[51] = new Array(51, "CD", "Congo (Kinshasa)", 0, 0, 0, 0, false, false, 0, "");
			regions[52] = new Array(52, "CK", "Cook Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[53] = new Array(53, "CR", "Costa Rica", 0, 0, 0, 0, false, false, 0, "");
			regions[54] = new Array(54, "CI", "Côte d'Ivoire", 0, 0, 0, 0, false, false, 0, "");
			regions[55] = new Array(55, "HR", "Croatia", 25, 10, 0, 0, false, false, 0, "^HR[ ]{0,1}[0-9]{11}$");
			regions[56] = new Array(56, "CU", "Cuba", 0, 0, 0, 0, false, false, 0, "");
			regions[57] = new Array(57, "CY", "Cyprus", 15, 5, 0, 0, false, false, 2, "^CY[ ]{0,1}[0-9]{9}$");
			regions[58] = new Array(58, "CZ", "Czech Republic", 19, 5, 0, 0, false, false, 2, "^CZ[ ]{0,1}([0-9]{8}|[0-9]{9}|[0-9]{10})$");
			regions[59] = new Array(59, "DK", "Denmark", 25, 0, 0, 0, false, false, 2, "^DK[ ]{0,1}[0-9]{8}$");
			regions[60] = new Array(60, "DJ", "Djibouti", 0, 0, 0, 0, false, false, 0, "");
			regions[61] = new Array(61, "DM", "Dominica", 0, 0, 0, 0, false, false, 0, "");
			regions[62] = new Array(62, "DO", "Dominican Republic", 0, 0, 0, 0, false, false, 0, "");
			regions[63] = new Array(63, "EC", "Ecuador", 0, 0, 0, 0, false, false, 0, "");
			regions[64] = new Array(64, "EG", "Egypt", 0, 0, 0, 0, false, false, 0, "");
			regions[65] = new Array(65, "SV", "El Salvador", 0, 0, 0, 0, false, false, 0, "");
			regions[66] = new Array(66, "GQ", "Equatorial Guinea", 0, 0, 0, 0, false, false, 0, "");
			regions[67] = new Array(67, "ER", "Eritrea", 0, 0, 0, 0, false, false, 0, "");
			regions[68] = new Array(68, "EE", "Estonia", 18, 1, 3, 5, false, false, 2, "^EE[ ]{0,1}[0-9]{9}$");
			regions[69] = new Array(69, "ET", "Ethiopia", 0, 0, 0, 0, false, false, 0, "");
			regions[70] = new Array(70, "FK", "Falkland Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[71] = new Array(71, "FO", "Faroe Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[72] = new Array(72, "FJ", "Fiji", 0, 0, 0, 0, false, false, 0, "");
			regions[73] = new Array(73, "FI", "Finland", 22, 17, 0, 0, false, false, 2, "^FI[ ]{0,1}[0-9]{8}$");
			regions[74] = new Array(74, "FR", "France", 19.6, 5.5, 0, 0, false, false, 2, "^FR[ ]{0,1}[a-zA-Z0-9]{2}[0-9]{9}$");
			regions[75] = new Array(75, "GF", "French Guiana", 0, 0, 0, 0, false, false, 0, "");
			regions[76] = new Array(76, "PF", "French Polynesia", 0, 0, 0, 0, false, false, 0, "");
			regions[77] = new Array(77, "TF", "French Southern Lands", 0, 0, 0, 0, false, false, 0, "");
			regions[78] = new Array(78, "GA", "Gabon", 0, 0, 0, 0, false, false, 0, "");
			regions[79] = new Array(79, "GM", "Gambia", 0, 0, 0, 0, false, false, 0, "");
			regions[80] = new Array(80, "GE", "Georgia", 0, 0, 0, 0, false, false, 0, "");
			regions[81] = new Array(81, "GH", "Ghana", 0, 0, 0, 0, false, false, 0, "");
			regions[82] = new Array(82, "GI", "Gibraltar", 0, 0, 0, 0, false, false, 0, "");
			regions[83] = new Array(83, "EL", "Greece", 18, 8, 0, 0, false, false, 2, "^EL[ ]{0,1}[0-9]{9}$");
			regions[84] = new Array(84, "GL", "Greenland", 0, 0, 0, 0, false, false, 0, "");
			regions[85] = new Array(85, "GD", "Grenada", 0, 0, 0, 0, false, false, 0, "");
			regions[86] = new Array(86, "GP", "Guadeloupe", 0, 0, 0, 0, false, false, 0, "");
			regions[87] = new Array(87, "GU", "Guam", 0, 0, 0, 0, false, false, 0, "");
			regions[88] = new Array(88, "GT", "Guatemala", 0, 0, 0, 0, false, false, 0, "");
			regions[89] = new Array(89, "GN", "Guinea", 0, 0, 0, 0, false, false, 0, "");
			regions[90] = new Array(90, "GW", "Guinea-Bissau", 0, 0, 0, 0, false, false, 0, "");
			regions[91] = new Array(91, "GY", "Guyana", 0, 0, 0, 0, false, false, 0, "");
			regions[92] = new Array(92, "HT", "Haiti", 0, 0, 0, 0, false, false, 0, "");
			regions[93] = new Array(93, "HM", "Heard and McDonald Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[94] = new Array(94, "HN", "Honduras", 0, 0, 0, 0, false, false, 0, "");
			regions[95] = new Array(95, "HK", "Hong Kong", 0, 0, 0, 0, false, false, 0, "");
			regions[96] = new Array(96, "HU", "Hungary", 25, 12, 0, 0, false, false, 2, "^HU[ ]{0,1}[0-9]{8}$");
			regions[97] = new Array(97, "IS", "Iceland", 24.5, 0, 0, 0, false, false, 0, "");
			regions[98] = new Array(98, "IN", "India", 0, 0, 0, 0, false, false, 0, "");
			regions[99] = new Array(99, "ID", "Indonesia", 0, 0, 0, 0, false, false, 0, "");
			regions[100] = new Array(100, "IR", "Iran", 0, 0, 0, 0, false, false, 0, "");
			regions[101] = new Array(101, "IQ", "Iraq", 0, 0, 0, 0, false, false, 0, "");
			regions[102] = new Array(102, "IE", "Ireland", 21, 10, 0, 0, false, false, 2, "^IE[ ]{0,1}[0-9][0-9a-zA-Z][0-9]{5}[a-zA-Z]$");
			regions[103] = new Array(103, "IL", "Israel", 0, 0, 0, 0, false, false, 0, "");
			regions[104] = new Array(104, "IT", "Italy", 20, 9, 0, 0, false, false, 2, "^IT[ ]{0,1}[0-9]{11}$");
			regions[105] = new Array(105, "JM", "Jamaica", 0, 0, 0, 0, false, false, 0, "");
			regions[106] = new Array(106, "JP", "Japan", 0, 0, 0, 0, false, false, 0, "");
			regions[107] = new Array(107, "JO", "Jordan", 0, 0, 0, 0, false, false, 0, "");
			regions[108] = new Array(108, "KZ", "Kazakhstan", 0, 0, 0, 0, false, false, 0, "");
			regions[109] = new Array(109, "KE", "Kenya", 0, 0, 0, 0, false, false, 0, "");
			regions[110] = new Array(110, "KI", "Kiribati", 0, 0, 0, 0, false, false, 0, "");
			regions[111] = new Array(111, "KP", "Korea North", 0, 0, 0, 0, false, false, 0, "");
			regions[112] = new Array(112, "KR", "Korea South", 0, 0, 0, 0, false, false, 0, "");
			regions[113] = new Array(113, "KW", "Kuwait", 0, 0, 0, 0, false, false, 0, "");
			regions[114] = new Array(114, "KG", "Kyrgyzstan", 0, 0, 0, 0, false, false, 0, "");
			regions[115] = new Array(115, "LA", "Laos", 0, 0, 0, 0, false, false, 0, "");
			regions[116] = new Array(116, "LV", "Latvia", 18, 1, 5, 9, false, false, 2, "^LV[ ]{0,1}[0-9]{11}$");
			regions[117] = new Array(117, "LB", "Lebanon", 0, 0, 0, 0, false, false, 0, "");
			regions[118] = new Array(118, "LS", "Lesotho", 0, 0, 0, 0, false, false, 0, "");
			regions[119] = new Array(119, "LR", "Liberia", 0, 0, 0, 0, false, false, 0, "");
			regions[120] = new Array(120, "LY", "Libya", 0, 0, 0, 0, false, false, 0, "");
			regions[121] = new Array(121, "LI", "Liechtenstein", 0, 0, 0, 0, false, false, 0, "");
			regions[122] = new Array(122, "LT", "Lithuania", 18, 5, 7, 9, false, false, 2, "^LT[ ]{0,1}([0-9]{9}|[0-9]{12})$");
			regions[123] = new Array(123, "LU", "Luxembourg", 15, 6, 0, 0, false, false, 2, "^LU[ ]{0,1}[0-9]{8}$");
			regions[124] = new Array(124, "MO", "Macau", 0, 0, 0, 0, false, false, 0, "");
			regions[125] = new Array(125, "MK", "Macedonia", 0, 0, 0, 0, false, false, 0, "");
			regions[126] = new Array(126, "MG", "Madagascar", 0, 0, 0, 0, false, false, 0, "");
			regions[127] = new Array(127, "MW", "Malawi", 0, 0, 0, 0, false, false, 0, "");
			regions[128] = new Array(128, "MY", "Malaysia", 0, 0, 0, 0, false, false, 0, "");
			regions[129] = new Array(129, "MV", "Maldives", 0, 0, 0, 0, false, false, 0, "");
			regions[130] = new Array(130, "ML", "Mali", 0, 0, 0, 0, false, false, 0, "");
			regions[131] = new Array(131, "MT", "Malta", 18, 0, 0, 0, false, false, 2, "^MT[ ]{0,1}[0-9]{8}$");
			regions[132] = new Array(132, "MH", "Marshall Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[133] = new Array(133, "MQ", "Martinique", 0, 0, 0, 0, false, false, 0, "");
			regions[134] = new Array(134, "MR", "Mauritania", 0, 0, 0, 0, false, false, 0, "");
			regions[135] = new Array(135, "MU", "Mauritius", 0, 0, 0, 0, false, false, 0, "");
			regions[136] = new Array(136, "YT", "Mayotte", 0, 0, 0, 0, false, false, 0, "");
			regions[137] = new Array(137, "MX", "Mexico", 0, 0, 0, 0, false, false, 0, "");
			regions[138] = new Array(138, "FM", "Micronesia", 0, 0, 0, 0, false, false, 0, "");
			regions[139] = new Array(139, "MD", "Moldova", 0, 0, 0, 0, false, false, 0, "");
			regions[140] = new Array(140, "MC", "Monaco", 0, 0, 0, 0, false, false, 0, "");
			regions[141] = new Array(141, "MN", "Mongolia", 0, 0, 0, 0, false, false, 0, "");
			regions[142] = new Array(142, "MS", "Montserrat", 0, 0, 0, 0, false, false, 0, "");
			regions[143] = new Array(143, "MA", "Morocco", 0, 0, 0, 0, false, false, 0, "");
			regions[144] = new Array(144, "MZ", "Mozambique", 0, 0, 0, 0, false, false, 0, "");
			regions[145] = new Array(145, "MM", "Myanmar", 0, 0, 0, 0, false, false, 0, "");
			regions[146] = new Array(146, "NA", "Namibia", 0, 0, 0, 0, false, false, 0, "");
			regions[147] = new Array(147, "NR", "Nauru", 0, 0, 0, 0, false, false, 0, "");
			regions[148] = new Array(148, "NP", "Nepal", 0, 0, 0, 0, false, false, 0, "");
			regions[149] = new Array(149, "NL", "Netherlands", 19, 6, 0, 0, false, false, 2, "^NL[ ]{0,1}[0-9]{9}B[0-9]{2}$");
			regions[150] = new Array(150, "AN", "Netherlands Antilles", 0, 0, 0, 0, false, false, 0, "");
			regions[151] = new Array(151, "NC", "New Caledonia", 0, 0, 0, 0, false, false, 0, "");
			regions[152] = new Array(152, "NZ", "New Zealand", 0, 0, 0, 0, false, false, 0, "");
			regions[153] = new Array(153, "NI", "Nicaragua", 0, 0, 0, 0, false, false, 0, "");
			regions[154] = new Array(154, "NE", "Niger", 0, 0, 0, 0, false, false, 0, "");
			regions[155] = new Array(155, "NG", "Nigeria", 0, 0, 0, 0, false, false, 0, "");
			regions[156] = new Array(156, "NU", "Niue", 0, 0, 0, 0, false, false, 0, "");
			regions[157] = new Array(157, "NF", "Norfolk Island", 0, 0, 0, 0, false, false, 0, "");
			regions[158] = new Array(158, "MP", "Northern Mariana Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[159] = new Array(159, "NO", "Norway", 24, 0, 0, 0, false, false, 0, "");
			regions[160] = new Array(160, "OM", "Oman", 0, 0, 0, 0, false, false, 0, "");
			regions[161] = new Array(161, "PK", "Pakistan", 0, 0, 0, 0, false, false, 0, "");
			regions[162] = new Array(162, "PW", "Palau", 0, 0, 0, 0, false, false, 0, "");
			regions[163] = new Array(163, "PS", "Palestine", 0, 0, 0, 0, false, false, 0, "");
			regions[164] = new Array(164, "PA", "Panama", 0, 0, 0, 0, false, false, 0, "");
			regions[165] = new Array(165, "PG", "Papua New Guinea", 0, 0, 0, 0, false, false, 0, "");
			regions[166] = new Array(166, "PY", "Paraguay", 0, 0, 0, 0, false, false, 0, "");
			regions[167] = new Array(167, "PE", "Peru", 0, 0, 0, 0, false, false, 0, "");
			regions[168] = new Array(168, "PH", "Philippines", 0, 0, 0, 0, false, false, 0, "");
			regions[169] = new Array(169, "PN", "Pitcairn", 0, 0, 0, 0, false, false, 0, "");
			regions[170] = new Array(170, "PL", "Poland", 22, 7, 0, 0, false, false, 2, "^PL[ ]{0,1}[0-9]{10}$");
			regions[171] = new Array(171, "PT", "Portugal", 19, 4, 5, 0, false, false, 2, "^PT[ ]{0,1}[0-9]{9}$");
			regions[172] = new Array(172, "PR", "Puerto Rico", 0, 0, 0, 0, false, false, 0, "");
			regions[173] = new Array(173, "QA", "Qatar", 0, 0, 0, 0, false, false, 0, "");
			regions[174] = new Array(174, "RE", "Reunion", 0, 0, 0, 0, false, false, 0, "");
			regions[175] = new Array(175, "RU", "Russian Federation", 0, 0, 0, 0, false, false, 0, "");
			regions[176] = new Array(176, "RW", "Rwanda", 0, 0, 0, 0, false, false, 0, "");
			regions[177] = new Array(177, "SH", "Saint Helena", 0, 0, 0, 0, false, false, 0, "");
			regions[178] = new Array(178, "KN", "Saint Kitts and Nevis", 0, 0, 0, 0, false, false, 0, "");
			regions[179] = new Array(179, "LC", "Saint Lucia", 0, 0, 0, 0, false, false, 0, "");
			regions[180] = new Array(180, "PM", "Saint Pierre and Miquelon", 0, 0, 0, 0, false, false, 0, "");
			regions[181] = new Array(181, "VC", "Saint Vincent and the Grenadines", 0, 0, 0, 0, false, false, 0, "");
			regions[182] = new Array(182, "WS", "Samoa", 0, 0, 0, 0, false, false, 0, "");
			regions[183] = new Array(183, "SM", "San Marino", 0, 0, 0, 0, false, false, 0, "");
			regions[184] = new Array(184, "ST", "Sao Tome and Principe", 0, 0, 0, 0, false, false, 0, "");
			regions[185] = new Array(185, "SA", "Saudi Arabia", 0, 0, 0, 0, false, false, 0, "");
			regions[186] = new Array(186, "SN", "Senegal", 0, 0, 0, 0, false, false, 0, "");
			regions[187] = new Array(187, "CS", "Serbia and Montenegro", 0, 0, 0, 0, false, false, 0, "");
			regions[188] = new Array(188, "SC", "Seychelles", 0, 0, 0, 0, false, false, 0, "");
			regions[189] = new Array(189, "SL", "Sierra Leone", 0, 0, 0, 0, false, false, 0, "");
			regions[190] = new Array(190, "SG", "Singapore", 0, 0, 0, 0, false, false, 0, "");
			regions[191] = new Array(191, "SK", "Slovakia", 19, 10, 0, 0, false, false, 2, "^SK[ ]{0,1}[0-9]{10}$");
			regions[192] = new Array(192, "SI", "Slovenia", 20, 8.5, 0, 0, false, false, 2, "^SI[ ]{0,1}[0-9]{8}$");
			regions[193] = new Array(193, "SB", "Solomon Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[194] = new Array(194, "SO", "Somalia", 0, 0, 0, 0, false, false, 0, "");
			regions[195] = new Array(195, "ZA", "South Africa", 0, 0, 0, 0, false, false, 0, "");
			regions[196] = new Array(196, "GS", "South Georgia and South Sandwich Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[197] = new Array(197, "ES", "Spain", 16, 7, 0, 0, false, false, 2, "^ES[ ]{0,1}[a-zA-Z0-9][0-9]{7}[a-zA-Z0-9]$");
			regions[198] = new Array(198, "LK", "Sri Lanka", 0, 0, 0, 0, false, false, 0, "");
			regions[199] = new Array(199, "SD", "Sudan", 0, 0, 0, 0, false, false, 0, "");
			regions[200] = new Array(200, "SR", "Suriname", 0, 0, 0, 0, false, false, 0, "");
			regions[201] = new Array(201, "SJ", "Svalbard and Jan Mayen Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[202] = new Array(202, "SZ", "Swaziland", 0, 0, 0, 0, false, false, 0, "");
			regions[203] = new Array(203, "SE", "Sweden", 25, 12, 0, 0, false, false, 2, "^SE[ ]{0,1}[0-9]{10}01$");
			regions[204] = new Array(204, "SY", "Syria", 0, 0, 0, 0, false, false, 0, "");
			regions[205] = new Array(205, "TW", "Taiwan", 0, 0, 0, 0, false, false, 0, "");
			regions[206] = new Array(206, "TJ", "Tajikistan", 0, 0, 0, 0, false, false, 0, "");
			regions[207] = new Array(207, "TZ", "Tanzania", 0, 0, 0, 0, false, false, 0, "");
			regions[208] = new Array(208, "TH", "Thailand", 0, 0, 0, 0, false, false, 0, "");
			regions[209] = new Array(209, "TL", "Timor-Leste", 0, 0, 0, 0, false, false, 0, "");
			regions[210] = new Array(210, "TG", "Togo", 0, 0, 0, 0, false, false, 0, "");
			regions[211] = new Array(211, "TK", "Tokelau", 0, 0, 0, 0, false, false, 0, "");
			regions[212] = new Array(212, "TO", "Tonga", 0, 0, 0, 0, false, false, 0, "");
			regions[213] = new Array(213, "TT", "Trinidad and Tobago", 0, 0, 0, 0, false, false, 0, "");
			regions[214] = new Array(214, "TN", "Tunisia", 0, 0, 0, 0, false, false, 0, "");
			regions[215] = new Array(215, "TR", "Turkey", 0, 0, 0, 0, false, false, 0, "");
			regions[216] = new Array(216, "TM", "Turkmenistan", 0, 0, 0, 0, false, false, 0, "");
			regions[217] = new Array(217, "TC", "Turks and Caicos Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[218] = new Array(218, "TV", "Tuvalu", 0, 0, 0, 0, false, false, 0, "");
			regions[219] = new Array(219, "UG", "Uganda", 0, 0, 0, 0, false, false, 0, "");
			regions[220] = new Array(220, "UA", "Ukraine", 0, 0, 0, 0, false, false, 0, "");
			regions[221] = new Array(221, "AE", "United Arab Emirates", 0, 0, 0, 0, false, false, 0, "");
			regions[222] = new Array(222, "GB", "United Kingdom", 17.5, 1, 3, 5, false, false, 2, "^GB[ ]{0,1}([0-9]{9}|[0-9]{12})$");
			regions[223] = new Array(223, "UM", "United States Minor Outlying Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[224] = new Array(224, "US", "United States of America", 0, 0, 0, 0, false, false, 0, "");
			regions[225] = new Array(225, "UY", "Uruguay", 0, 0, 0, 0, false, false, 0, "");
			regions[226] = new Array(226, "UZ", "Uzbekistan", 0, 0, 0, 0, false, false, 0, "");
			regions[227] = new Array(227, "VU", "Vanuatu", 0, 0, 0, 0, false, false, 0, "");
			regions[228] = new Array(228, "VA", "Vatican City", 0, 0, 0, 0, false, false, 0, "");
			regions[229] = new Array(229, "VE", "Venezuela", 0, 0, 0, 0, false, false, 0, "");
			regions[230] = new Array(230, "VN", "Viet Nam", 0, 0, 0, 0, false, false, 0, "");
			regions[231] = new Array(231, "VG", "Virgin Islands British", 0, 0, 0, 0, false, false, 0, "");
			regions[232] = new Array(232, "VI", "Virgin Islands U.S.", 0, 0, 0, 0, false, false, 0, "");
			regions[233] = new Array(233, "WF", "Wallis and Futuna Islands", 0, 0, 0, 0, false, false, 0, "");
			regions[234] = new Array(234, "EH", "Western Sahara", 0, 0, 0, 0, false, false, 0, "");
			regions[235] = new Array(235, "YE", "Yemen", 0, 0, 0, 0, false, false, 0, "");
			regions[236] = new Array(236, "ZM", "Zambia", 0, 0, 0, 0, false, false, 0, "");
			regions[237] = new Array(237, "ZW", "Zimbabwe", 0, 0, 0, 0, false, false, 0, "");
			
			};
		// executed on first session init only
		if(SMFirstInit){
			var SMReferrer = SMSession.xml.documentElement.getAttribute("referrer");
			var SMQuery = SMSession.xml.documentElement.getAttribute("query");
			SMShop.setAttribute("id", SMSession.xml.documentElement.getAttribute("id"));
			SMShop.setAttribute("finit", "1");
			SMShop.setAttribute("session-marker", "knVNw8ifN+M91p9kI0BJPwS2NfCtG5jEbFAGYbKtB+YkVg==");
			SMShop.setAttribute("build", "6.5.2");
			SMShop.setAttribute("sarurl", SMOMAbsoluteRootURL);
			if(SMReferrer!="") SMShop.setAttribute("referrer", SX_uEsc(SMReferrer));
			if(SMQuery!="") SMShop.setAttribute("query", SX_uEsc(SMQuery));
			SMShop.setAttribute("sid", fnSMRandStr(10));
			
			SMShop.setAttribute("finit", "0");
			};

		
		var SMColors = new SXMLDom();with(SMColors){documentElement = createNode("SMColors");with(documentElement){with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "main");setAttribute("value", "#5D5D5D");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "main.light");setAttribute("value", "#E0E0E0");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "main.dark");setAttribute("value", "#000000");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "alt");setAttribute("value", "#63C7DC");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "alt.light");setAttribute("value", "#E9F7FA");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "alt.dark");setAttribute("value", "#228195");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "background");setAttribute("value", "#FFFFFF");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "foreground");setAttribute("value", "#646464");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "hyperlink");setAttribute("value", "#178EA8");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "main.tint");setAttribute("value", "#9E9E9E");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "alt.tint");setAttribute("value", "#A6DFEB");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "main.light.tint");setAttribute("value", "#F0F0F0");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "alt.light.tint");setAttribute("value", "#F4FBFC");};with(appendChild(ownerDocument.createNode("SMColor"))){setAttribute("key", "text.weak");setAttribute("value", "#8B8B8B");};};};
		var SMFonts = new SXMLDom();with(SMFonts){documentElement = createNode("SMFonts");with(documentElement){setAttribute("base-size","0.8");with(appendChild(ownerDocument.createNode("SMFont"))){setAttribute("key","small");text="font:normal normal normal 1em/1.4em Calibri, Helvetica, sans-serif;";};with(appendChild(ownerDocument.createNode("SMFont"))){setAttribute("key","normal");text="font:normal normal normal 1em/1.4em Calibri, Helvetica, sans-serif;";};with(appendChild(ownerDocument.createNode("SMFont"))){setAttribute("key","large");text="font:normal normal bold 1em/1.4em Calibri, Helvetica, sans-serif;";};with(appendChild(ownerDocument.createNode("SMFont"))){setAttribute("key","x-large");text="font:normal normal bold 1em/1.4em Calibri, Helvetica, sans-serif;";};with(appendChild(ownerDocument.createNode("SMFont"))){setAttribute("key","mono");text="font:normal normal normal 1em/1.4em 'andale mono', 'lucida console', monospace;";};};};

		var SMCfgItems = "_3CSMCfgItems_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2bic_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2iban_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2owner_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2code_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2name_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2city_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2company_X5X2director_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2company_X5X2director_X5X2label_22_3EGesch_X5C3_X5A4ftsf_X5C3_X5BChrer_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2company_X5X2name_22_3ECareli_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2country_X5X2name_22_3EDeutschland_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2fax_X5X2business_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2fax_X5X2hotline_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2firstname_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2lastname_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2contact_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2default_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2orders_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2support_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2webmaster_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2phone_X5X2business_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2phone_X5X2hotline_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2phone_X5X2mobile_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2region_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2salutation_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2street_X5X2name_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2street_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2tax_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2title_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2trade_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2url_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2vat_X5X2id_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2zip_X5X2code_22_3E_3C_2FSMCfgItem_3E_3C_2FSMCfgItems_3E";
		var SMBasketXML = null;

		with(SMShop){
			
			deliveryTimes[1] = new Array(1, "sofort%20lieferbar");
			deliveryTimes[2] = new Array(2, "2-5%20Werktage");
			deliveryTimes[3] = new Array(3, "muss%20f%FCr%20Sie%20bestellt%20werden");
			};

		// listen to window.onLoad & .onUnload events
		window.onload = function(){ SMShop.onLoad(); };
		window.onunload = function(){ SMShop.onUnload(); };

	function SMOMGetQtyControl(){
		var _args = SMOMGetQtyControl.arguments, oProduct = _args[0], raiseEvent = ((_args[1]!=null) ? _args[1] : false), index = ((_args[2]!=null) ? _args[2] : -1);
		if(oProduct==null){return("")};
		var sPkid = "PD" + toStr(oProduct.getAttribute(_SMAUniqueID)), iQtyType = toInt(oProduct.getAttribute(_SMAOQtyType)),
			iQtyMin = toInt(oProduct.getAttribute(_SMAMinAmount)), iQtyStep = toInt(oProduct.getAttribute(_SMAOQtyStep)),
			iQtyMax = toInt(oProduct.getAttribute(_SMAMaxAmount)), iQtyDef = toInt(oProduct.getAttribute(_SMAOQDefValue)),
			iOptCount = toInt(oProduct.getAttribute(_SMAOQDDOptCount)), sQtyUnit = "Stk", sField = "";

		if(oProduct.getAttribute(_SMAVariantID)!=null) 
			sPkid += '-' + oProduct.getAttribute(_SMAVariantID);

		sPkid += "Amount";

		iQtyDef = oProduct.getAttribute(_SMAAmount);
		iQtyDef = iQtyDef > iQtyMin ? iQtyDef : iQtyMin;

		sField += '<div class="basket-line-qty">';
		switch(iQtyType){
			case 0:
				sField += "<input class=\"addbasket-qtyfield\" id=\"" + sPkid + "\" type=\"text\" size=\"2\" value=\"" + iQtyDef + "\" onchange=\"this.value=fnSMNum(this.value);";
				if(raiseEvent) sField += "SMShop.base.raiseEvent('onBasketGUIElemChanged', false, null, SMShop, this, " + index + ");";
				sField += "\"";
				if(raiseEvent) sField += " onkeydown=\"if(window.event.keyCode==13){ this.value=fnSMNum(this.value); SMShop.base.raiseEvent('onBasketGUIElemChanged', false, null, SMShop, this, " + index + "); };\"";
				sField += "\">";
				break;
			case 1:
				if(raiseEvent) sPkid += "IDX" + index;

				sField += '<input class="addbasket-qtyfield" type="number" min="{0}"{1} step="{2}" id="{3}" size="3" value="{4}"{5}{6}>'.format( 
					iQtyMin || 1,
					(iQtyMax > 0 && iQtyMax >= iQtyMin) ? ' max="' + iQtyMax + '"' : '', 
					iQtyStep || 1,
					sPkid, 
					iQtyDef, 
					!raiseEvent ? "" : _.setAttr("onChange", 'SMShop.base.raiseEvent("onBasketGUIElemChanged", false, null, SMShop, this, ' + index + ')'),
					!raiseEvent ? "" : _.setAttr("onkeydown", 'if(window.event.keyCode==13){ this.value=fnSMNum(this.value); SMShop.base.raiseEvent("onBasketGUIElemChanged", false, null, SMShop, this, ' + index + '); }')
				);

				break;
			case 2:
				sField += "<select id=\"" + sPkid + "\" class=\"addbasket-qtyfield\"";
				if(raiseEvent){
					sField += " onchange=\"SMShop.base.raiseEvent('onBasketGUIElemChanged', false, null, SMShop, this, " + index + ");\"";
					sField += " onkeydown=\"if(window.event.keyCode==13){ this.value=fnSMNum(this.value); SMShop.base.raiseEvent('onBasketGUIElemChanged', false, null, SMShop, this, " + index + "); };\"";
				};
				sField += ">";
				for(var i=iQtyStep; i<=parseInt(iOptCount*iQtyStep);i+=iQtyStep){
					sField += '<option value="' + i + '"' + (i==iQtyDef ? ' selected' : '') + '>' + i;
				};
				sField += "</select>";
				break;
		};
		//sField += "</td></tr></table>";
		sField += "</div>";
		return(sField);
	};

	

	function SMGetCheckoutStep(){

		var backwards = arguments[1], returnId = "", usingShipToAddress = bNoCheckoutPage = false, isDialogOpen = false;

		usingShipToAddress = (SMShop.getFormElement("BILLTO", "BILLTO_SHIPTO_DIFFERS") != null);

		if(usingShipToAddress){
			usingShipToAddress = toBool(SMShop.getFormValue("BILLTO", "BILLTO_SHIPTO_DIFFERS", true));
		};

		if(!usingShipToAddress){
			var forms = SMShop.xml.selectNodes("form");

			for (i=0; i<forms.length(); i++){
			    var form = forms.item(i);
			    var nameAttr = form.getAttribute("name");

			    if(nameAttr == "SHIPTO"){
			        SMShop.xml.removeChild(form);
			        SMShop.update();
			    }
			}
		}

		switch(arguments[0]){
			case "SM_RESERVED_BASKET":
				returnId = (backwards) ? "/pg21.html" : "/pg13.html";
				if(backwards) bNoCheckoutPage = true;
				break;
			case "SM_RESERVED_DATA_ENTRY_BILLTO":
				returnId = (backwards) ? "/pg21.html" : (usingShipToAddress) ? "/pg14.html" : "/pg15.html";
				if(returnId == "/pg21.html") bNoCheckoutPage = true;
				break;
			case "SM_RESERVED_DATA_ENTRY_SHIPTO":
				returnId = (backwards) ? "/pg13.html" : "/pg15.html";
				break;
			case "SM_RESERVED_DATA_ENTRY_SHIPMENT":
				returnId = (backwards) ? (usingShipToAddress) ? "/pg14.html" : "/pg13.html" : "/pg16.html";
				break;
			case "SM_RESERVED_DATA_ENTRY_PAYMENT":
				returnId = (backwards) ? "/pg15.html" : "/pg17.html";
				break;
			case "SM_RESERVED_DATA_ENTRY_VERIFY":
				returnId = (backwards) ? "/pg16.html" : "/pg17.html";
				if(returnId == "/index.html") bNoCheckoutPage = true;
				break;
			default:
				returnId = (backwards) ? "" : "/index.html";
				if(!backwards) bNoCheckoutPage = true;
		};

		// valid for checkout?
		if(returnId!=""){
			var sMsgValidity = "", lValidationCode = SMShop.validateDataForCheckout();
			switch(lValidationCode){
				case 1:
					sMsgValidity = "Ihr Warenkorb enthält keine Einträge, bitte legen Sie mindestens einen Artikel in den Warenkorb.".replace("&nbsp;", " ");
					//jQuery
					jQuery.createDialog("Achtung", sMsgValidity, { 
						modal: 			true,
						draggable: 		false,
						buttons: {
							"OK": function(){ 
								jQuery.hideDialog(); 
								bNoCheckoutPage = true;

								
									if(bNoCheckoutPage && SMShop.getAttribute('sarurl') != '')
										location.href = SMShop.getAttribute('sarurl') + "/index.html";
									else
										location.href = SMOMAbsoluteRootURL + "/index.html";
									
							}
						}
					});

					isDialogOpen = true;

					break;
				case 2:
					sMsgValidity = ("Der Mindestbestellwert wurde unterschritten. Der Mindestbestellwert beträgt " + cprimary.format(SMShop.getAttribute(_SMAMinAmount), SM_CSYMBOL + SM_CGROUP)).replace("&nbsp;", " ");
					//jQuery
					jQuery.createDialog('Achtung', sMsgValidity, { 
						modal: 			true,
						draggable: 		false,
						buttons: {
							"OK": function(){ 
								jQuery.hideDialog(); 
								bNoCheckoutPage = true;

								
									if(bNoCheckoutPage && SMShop.getAttribute('sarurl') != '')
										location.href = SMShop.getAttribute('sarurl') + "/pg21.html";
									else 
										location.href = SMOMAbsoluteRootURL + "/pg21.html";
									
							}
						}
					});

					isDialogOpen = true;

					break;
			};
		} else {
			location.href="";
		}

		// ssl
		if(useSSLForCheckout&&SMOMAbsoluteRootURL.substring(0,7)=="http://"){
			if(sharedSSLURL!="")
				SMOMAbsoluteRootURL = sharedSSLURL;
			else 
				SMOMAbsoluteRootURL = "https://" + SMOMAbsoluteRootURL.substring(7);
		};

		if(SMOMAbsoluteRootURL.substring(SMOMAbsoluteRootURL.length - 1)=="/") 
			SMOMAbsoluteRootURL = SMOMAbsoluteRootURL.substring(0,SMOMAbsoluteRootURL.length - 1);

		
			if(bNoCheckoutPage && SMShop.getAttribute('sarurl') != ''){
				returnId = SMShop.getAttribute('sarurl') + returnId;
			} else {
				returnId = SMOMAbsoluteRootURL + returnId;
			};
		

		if(!isDialogOpen) 
			location.href = returnId;
	};

		SMCurrNoOfDecimals = 2;
	var cprimary = new cSMCurrency("EUR", "€", "Euro", ",", "1,1 x", "-1,1 x", 2, ".", 3, 1 );
	var csecondary = new cSMCurrency("USD", "$", "United States Dollars", ",", "1,1 x", "-1,1 x", 2, ".", 3, 1.4107 );

	var nprimary = new cSMCurrency("kg", "kg", "kg", ",", "1,1 x", "-1,1 x", 2, "", 3, 1);

	if(SMFirstInit){
		SMShop.basket.setAttribute("p-cur-iso", cprimary.ISO)
		SMShop.basket.setAttribute("p-cur-symbol", cprimary.symbol)
		};	

	function formatProductBasePrice(Product){
	var $basePriceTemplate = "";
		$basePriceTemplate = "Grundpreis: %bp pro %mb %mu";
		if($basePriceTemplate!=""&&(Product.bpAmount!=1||Product.bpBase!=1)){
			$basePriceTemplate = $basePriceTemplate.replace(/%ma/g, Product.bpAmount);
			$basePriceTemplate = $basePriceTemplate.replace(/%mu/g, Product.bpMUnit);
			$basePriceTemplate = $basePriceTemplate.replace(/%qu/g, Product.quantityUnit);
			$basePriceTemplate = $basePriceTemplate.replace(/%bp/g, "<strong class=\"t-em\">" + cprimary.format(Product.getPrice() / Product.bpAmount * Product.bpBase, SM_CGROUP + SM_CSYMBOL) + "</strong>");
			$basePriceTemplate = $basePriceTemplate.replace(/%mb/g, Product.bpBase);
			}
		else $basePriceTemplate = "";
		return($basePriceTemplate);
		};

	function displayProductProperties(Product){
		var $image = null, $elem = null, $basePriceTemplate = "";

		$fSetData = function(){ 
			var $elem = null; 
			try{ 
				$elem = document.getElementById(arguments[0]); 
				if($elem!=null) $elem.innerHTML = arguments[1]; 
			} catch(e){}; 
		};

		try{
			$image = new Image();
			$image.src = Product.image;
			//TODO: respect template setting wheather an placeholder image should show or not
			// 		in case no placeholder should show => display spacer
			/*
			if(Product.image == ""){
				$image.src = SMOMAbsoluteRootURL + "/images/img_nopic_small.gif";
			}
			*/
		} catch(e){
			$image = null;
		};

		with(document){

			//if($image!=null&& $image.src!=""){
			if($image != null && Product.image != ""){
				var productDetail = jQuery('#sm-product-detail').data('plugin_productDetail');
				if(productDetail && (!productDetail.isSameDetailImg( $image.src ))) {
					productDetail.refreshGalleries( $image.src );
				}
			};

			var price = Product.getPrice(),
				origPrice = Product.getOriginalPrice(),
				basePrice = Product.getPrice() / Product.bpAmount * Product.bpBase;

			$fSetData("product_name", Product.name);
			$fSetData("product_desc", Product.desc);
			$fSetData("product_id", Product.getAttribute(_SMACode));
			$fSetData("product_ean", Product.getAttribute(_SMAEAN));
			$fSetData("product_weight", nprimary.format(Product.getAttribute(_SMAWeight), SM_CGROUP) + "kg");
			$fSetData("product_original_price", cprimary.format(origPrice, SM_CGROUP + SM_CSYMBOL));
			$fSetData("product_difference", cprimary.format(origPrice - price, SM_CGROUP + SM_CSYMBOL));
			/*$fSetData("product_price", cprimary.format(price, SM_CGROUP + SM_CSYMBOL));*/
			$fSetData("product_price", cprimary.format(price, SM_CASHTML | SM_CGROUP | SM_CISO));
			$fSetData("product_price_seccur", csecondary.format(price, SM_CGROUP + SM_CSYMBOL));
			$fSetData("product_discounts", Product.discounts.renderHTML());

			//if( price != basePrice ){
			if( Product.bpAmount !=1 || Product.bpBase != 1){
				$fSetData("product_base_price", formatProductBasePrice(Product));
			} else {
				$fSetData("product_base_price", "");
			}

			if(Product.deliveryTimeFKID!=0){
				$fSetData("product_delivery_caption", unescape(SMShop.deliveryTimes[Product.deliveryTimeFKID][1]));
			};			
		};

		jQuery('.delivtime').removeClass(function(index, classes) {
			return (classes.match (/\bdelivtime-\S+/g) || []).join(' ');
		}).addClass('delivtime-' + Product.deliveryTimeFKID);		
	};

	function checkBrokerAvailibilty(url, index) {
		var d = document;
		var s = "script";
		var id = "smartbroker" + index;

		var js, sjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = url + "?AvailabilityTest=true&ServerIndex=" + index;
		sjs.parentNode.insertBefore(js, sjs);
	}

	var brokerUrls = ["http://services.smartstore-net.de/broker/smbiz_smartbroker.php","http://services.mailparser.de/broker/smbiz_smartbroker.php","https://www.smartstore.com/services/sm6/smbiz_smartbroker.php5"];

	/* sm:broker-url begin-edit */
	var SMBrokerURL = brokerUrls[0] || "https://www.smartstore.com/services/sm6/smbiz_smartbroker.php5";
	/* sm:broker-url end-edit */

	

		//
		var loc = location.href;
		var fileName = loc.substring(loc.length - (loc.length - loc.lastIndexOf("/") - 1), loc.length );

		//test if we are on the pages that send the order
		if(fileName == "pg38.html"){
		   	for (var i = 0; i < brokerUrls.length; i++) {
		         var brokerUrl = checkBrokerAvailibilty(brokerUrls[i], i);
		   	}

			var sActiveServer = "";

			var checkBrokerAnswer = function() {
				for (var i = 0; i < brokerUrls.length; i++) {
					try {
						var temp = eval("serverAvailable" + i);
						if(temp !== undefined && temp === true) {
							sActiveServer = brokerUrls[i];
							SMBrokerURL = sActiveServer;
							window.clearInterval(interval);
							console.log("Broker " + i + " available. URL:" + sActiveServer);
						}
					} catch (e) {
						console.log(e.message);
					}
				}
			}

			var interval = setInterval(function() {
				checkBrokerAnswer();
			}, 100);
		}

	