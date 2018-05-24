function SMOrderNotice(){
	this.redirError = '';
	this.formAction = SMBrokerURL;
	this.cancelOrder = false;
	this.renderForm = SMOrderNotice_renderForm;
	this.printForm = SMOrderNotice_printForm;
	this.removePluginFormFields = SMOrderNotice_removePluginFormFields;
	this.submitted = false;
};

function SMOrderNotice_removePluginFormFields(){
	var oForm = SMShop.basket.payMethodInfo.xml.selectSingleNode("form");
	var oElement = null;

	if(oForm){
		for(var i=oForm.childNodes.length()-1;i>=0;i--){
			oElement = oForm.childNodes.item(i);
			oForm.removeChild(oElement);
		}
	}
};

function SMOrderNotice_renderForm(){

	//this.removePluginFormFields();

	var sForm = '<iframe name="ORDER_NOTICE" id="RED_ORDER" src="about:blank"';
		if(!SMShop.debug){
			sForm += ' width="1" height="1" style="visibility:hidden;display:inline;width:1px;height:1px"';
		} else {
			sForm += ' width="600" height="400"';
		};
		sForm += '></iframe>'
		+ '<form name="ordernotice" id="ordernotice" action="' + this.formAction + '" method="post" target="ORDER_NOTICE" onsubmit="return(verifyOrderNotice(this))">'
		+ '<input type="hidden" name="SMDatastring" value="' + SX_esc(SMShop.xml.sys_xml(true)) + '">'
		+ '<input type="hidden" name="SMProviderAddresses" value="' + SX_esc(SMProviderAddresses.documentElement.sys_xml(true)) + '">'
		+ '<input type="hidden" name="call" value="ordernotice">'
		+ '</form>';
		return(sForm);
};

function SMOrderNotice_printForm(selector){
	//jQuery('#' + id).html(this.renderForm());
	jQuery(selector).html(this.renderForm());

	SMShop.base.removeMember("SMSubmitOrdernotice");
	
		if(!oSMOrderNotice.submitted){
			oSMOrderNotice.submitted = true;
			_.defer(function(){
				document.getElementById('ordernotice').submit();
			});
		};
	
};

function verifyOrderNotice(oForm){
	return(true);
};

var oSMOrderNotice = new SMOrderNotice();
SMShop.base.addMember("SMSubmitOrdernotice");
var SM_PAGEURL_SEND_ORDER_INFO = SMOMAbsoluteRootURL + "/pg38.html";
var SM_PAGEURL_DATA_ENTRY_VERIFY = SMOMAbsoluteRootURL + "/pg17.html";
var SM_PAGEURL_PURCHASE_ERROR = SMOMAbsoluteRootURL + "/pg19.html";
var SM_PAGEURL_PAY_SUCCESS = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_pay_success.html';
var SM_PAGEURL_PAY_CANCEL = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_pay_cancel.html';
var SM_PAGEURL_PAY_ERROR = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_pay_error.html';
var SM_PAGEURL_POPPAY_SUCCESS = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_poppay_success.html';
var SM_PAGEURL_POPPAY_CANCEL = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_poppay_cancel.html';
var SM_PAGEURL_POPPAY_ERROR = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_poppay_error.html';
var SM_PAGEURL_FRAMEPAY_SUCCESS = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_framepay_success.html';
var SM_PAGEURL_FRAMEPAY_CANCEL = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_framepay_cancel.html';
var SM_PAGEURL_FRAMEPAY_ERROR = SMOMAbsoluteRootURL + '/modules/verify-order/redirect_framepay_error.html';


var isOnlinePaymethod = true;

function verifyOrder(oForm){
	var sPayMethodId = sPayMethodFormName = sPayMethodFunction = '';
	var oPayForm = document.getElementById('SMPayMethodPluginForm');
	var sTargetURL = "";

	switch(SMShop.validateDataForCheckout()){
		case 1:

			jQuery.createDialog("Hinweis", "Ihr Warenkorb enthält keine Einträge, bitte legen Sie mindestens einen Artikel in den Warenkorb.", { 
				modal: 			true,
				draggable: 		false,
				buttons: {
					"OK": function(){ 
						jQuery.hideDialog(); 
						sTargetURL = "index.html";
						
							sBasketURL = SMShop.getAttribute('sarurl') + "/" + sTargetURL;
						
						location.href = sTargetURL;
					}
				}
			});

			return(false);
			break;
		case 2:

			jQuery.createDialog("Hinweis", "Der Mindestbestellwert wurde unterschritten. Der Mindestbestellwert beträgt " + cprimary.format(SMShop.getAttribute(_SMAMinAmount), SM_CSYMBOL + SM_CGROUP), { 
				modal: 			true,
				draggable: 		false,
				buttons: {
					"OK": function(){ 
						jQuery.hideDialog(); 
						sTargetURL = "pg21.html";
						
							sTargetURL = SMShop.getAttribute('sarurl') + "/" + sTargetURL;
						
						location.href = sTargetURL;
					}
				}
			});

			return(false);
			break;
		};

	if(oForm.cust_accept_gtb){
		if(!oForm.cust_accept_gtb.checked) {

			jQuery.createDialog("Hinweis", SX_uEsc('Bitte_20best_C3_A4tigen_20Sie_20unsere_20AGB_20als_20gelesen_X3'), { 
				modal: 			true,
				draggable: 		false,
				buttons: {
					"OK": function(){ 
						jQuery.hideDialog(); 
						oForm.cust_accept_gtb.focus();
					}
				}
			});
			return(false);
		};
	};
	if(oForm.cust_accept_info){
		if(!oForm.cust_accept_info.checked){

			jQuery.createDialog("Hinweis", SX_uEsc('Bitte_20best_C3_A4tigen_20Sie_20die_20Kundeninformationen_20als_20gelesen_X3'), { 
				modal: 			true,
				draggable: 		false,
				buttons: {
					"OK": function(){ 
						jQuery.hideDialog(); 
						oForm.cust_accept_info.focus();
					}
				}
			});
			return(false);
		};
	};
	if(oForm.cust_newsletter_abo){
		SMShop.setAttribute('newsletter-abo', (oForm.cust_newsletter_abo.checked?'1':''));
	};
	if(oForm.cust_send_copy){
		SMShop.setAttribute('send-order-copy', (oForm.cust_send_copy.checked?'1':''));
	};

	try{oForm.disabled = "disabled"}
	catch(e){};

	setPayMethodFormFields();

	if(isOnlinePaymethod){
		oSMOrderNotice.printForm(".verify-order");
	}

	_.delay(function(){
		try{
			sPayMethodFormName = SMShop.basket.payMethodInfo.xml.selectSingleNode("form").getAttribute("name").toUpperCase();
			sPayMethodId = SMShop.basket.payMethodInfo.xml.getAttribute("uid").toString();
			sPayMethodFormName = sPayMethodFormName.toString().replace(sPayMethodId, '');
			if(window[sPayMethodFormName + '_doPay'](oPayForm, true)){
				location.href = SM_PAGEURL_WAIT_FOR_PAY_INFO;
			};
		} catch(e){
			location.href = SM_PAGEURL_SEND_ORDER_INFO;
			//location.href = SM_PAGEURL_PURCHASE_ERROR + "?" + e.message;
		};
	}, 200);

	return(false);
};

function setPayMethodFormFields(){
	var oPayForm = document.getElementById('SMPayMethodPluginForm');
	var oForm = SMShop.basket.payMethodInfo.xml.selectSingleNode("form");
	var sPayId = SMShop.basket.payMethodInfo.xml.getAttribute("uid").toString();
	//var sFunction = oForm.getAttribute("name").toUpperCase().replace(sPayId, '') + '_setFieldValue';
	var sFunction = oForm.getAttribute("name").toUpperCase().replace(sPayId, '').replace('-', '') + '_setFieldValue';
	var oElement = null, sFields = sName = sValue = '';

	if (typeof sFunction == 'string' && eval('typeof ' + sFunction) != 'function') {
		isOnlinePaymethod = false;
	}

	for(var i=0;i<oForm.childNodes.length();i++){
		oElement = oForm.childNodes.item(i);
		sName = oElement.getAttribute("name");

		if(sName.indexOf('SMPAYMETHOD') > -1) continue;

		if(oElement.getAttribute("value")){
			sValue = oElement.getAttribute("value");
		} else {
			sValue = oElement.text;
		};

		try{
			sValue = window[sFunction](sName, sValue)
		} catch(e){ };

		if(oElement.getAttribute("value")){
			oElement.setAttribute(sName, sValue);
		} else {
			oElement.text = sValue;
		};

		sFields += '<input type="hidden" name="' + sName + '" value="' + sValue + '">';
	};

	SMShop.update();

	oPayForm.innerHTML = sFields;
};

function hideFrame() {
	jQuery("#InlinePayment").attr("width", "1").attr("height", "1").css("display", "none");
};

function showPayTerminalFrame(width, height){

	if (width && height)
		jQuery("#InlinePayment").attr("width", width).attr("height", height).css("display", "block");
	else 
		jQuery("#InlinePayment").attr("width", "800").attr("height", "400").css("display", "block");

	jQuery.colorbox({
		inline: true,
		href: "#InlinePayment",
		onClosed: function(){
			hideFrame();
		}
	});
};
