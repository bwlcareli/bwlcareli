var SM_PAGEURL_DATA_ENTRY_VERIFY = SMOMAbsoluteRootURL + "/pg17.html";
var SM_PAGEURL_DATA_ENTRY_PAYMENT = SMOMAbsoluteRootURL + "/pg16.html";

function SMOrderForm(){
	this.redirError = '';
	this.formAction = SMBrokerURL;
	this.cancelOrder = false;
	this.renderForm = SMOrderForm_renderForm;
	this.printForm = SMOrderForm_printForm;
	this.setQueryParams = SMOrderForm_setQueryParams;
	this.removePluginFormFields = SMOrderForm_removePluginFormFields;
	this.beforeSendOrder = SMOrderForm_beforeSendOrder;
	this.submitted = false;
};

function SMOrderForm_setQueryParams(paymethodFormName){
	var oForm = SMShop.basket.payMethodInfo.xml.selectSingleNode("form");
	var sPayMethodFunction = paymethodFormName + '_setResponseQueryCaptions';
	var oElem = null, sCaption = '';

	if(oForm!=null){

		for(var param in $_GET){
			if(_.isBlank(param)) continue;
			oElem = oForm.appendChild(oForm.ownerDocument.createNode("element"));
			try{
				sCaption = window[sPayMethodFunction](param);
			} catch(e){
				sCaption = param;
			};
			sCaption += ':';
			with(oElem){
				setAttribute("type", "text");
				setAttribute("name", param);
				setAttribute("caption", sCaption);
				text = $_GET[param];
			};
		};

		/*
		_.each($_GET, function(val, key) {
			param = key;
			if(_.isBlank(param)) return true;
			oElem = oForm.appendChild(oForm.ownerDocument.createNode("element"));
			try{
				sCaption = window[sPayMethodFunction](param);
			} catch(e){
				sCaption = param;
			};
			sCaption += ':';
			with(oElem){
				setAttribute("type", "text");
				setAttribute("name", param);
				setAttribute("caption", sCaption);
				text = val;
			};
		});
		*/
	};
};

function SMOrderForm_beforeSendOrder(paymethodFormName){
	var sPayMethodFunction = paymethodFormName + '_beforeSendOrder';
	try{
		this.cancelOrder = window[sPayMethodFunction]($_GET, false);
	} catch(e){
		this.cancelOrder = false;
	};
};

function SMOrderForm_removePluginFormFields(paymethodFormName){
	var oForm = SMShop.basket.payMethodInfo.xml.selectSingleNode("form");
	var oElement = null, sFields = sName = sValue = '';
	var sForwardFields = ''; arrForwardFields = null, bForward = false;
	var bRemove = false;

	try{
		bRemove = window[paymethodFormName + '_removePayFormFields']();
	} catch(e){
		bRemove = false;
	};

	if(!bRemove) return;

	try{
		var sPayMethodFunction = paymethodFormName + '_setForwardPayformFieldNames';
		sForwardFields = window[sPayMethodFunction]();
		arrForwardFields = sForwardFields.split(';');
	} catch(e){
		arrForwardFields = new Array();
	};

	for(var i=oForm.childNodes.length()-1;i>=0;i--){
		oElement = oForm.childNodes.item(i);
		sName = oElement.getAttribute("name");
		bForward = false;
		for(var j=0;j<arrForwardFields.length;j++){
			if(arrForwardFields[j].toLowerCase() == sName.toLowerCase()){
				bForward = true;
				break;
			};
		};
		if(!bForward) oForm.removeChild(oElement);
	};
};

function SMOrderForm_renderForm(){
var sSuccessPage = SMShop.getAttribute('sarurl') + "/pg18.html";var sErrorPage = SMOMAbsoluteRootURL + "/pg19.html";
	var sLogo = 'images/company_logo.png';
	var sTarget = ' target="RED_ORDER" ';
	var sTopRedir = "0";
	if(sLogo.length > 0){
		if(sLogo.substring(0,5) == 'http:'){
			sLogo = '<img src="' + sLogo + '" width="150" height="39" border="0">';
		} else {
			sLogo = '<img src="' + SMOMAbsoluteRootURL + '/' + sLogo + '" width="150" height="39" border="0">';
		};
	};

	var oPayMethodForm = SMShop.basket.payMethodInfo.xml.selectSingleNode("form");
	var sPayMethodFormName = "";
	if(oPayMethodForm)
		sPayMethodFormName = oPayMethodForm.getAttribute("name").toUpperCase();

	var sPayId = SMShop.basket.payMethodInfo.xml.getAttribute("uid").toString();

	sPayMethodFormName = sPayMethodFormName.toString().replace(sPayId, '');

	this.redirError = sErrorPage;
	this.beforeSendOrder(sPayMethodFormName);
	this.setQueryParams(sPayMethodFormName);
	this.removePluginFormFields(sPayMethodFormName);
	

	if(navigator.userAgent.toLowerCase().indexOf("safari") > 0){
		sTopRedir = '1';
		sTarget = ' ';
	};

	/*
	 * Verify Country (Office Compatibility)
	 */
	(function(){
		if(SMShop.getFormElement("BILLTO", "BILLTO_COUNTRY")==null) {
			var len = SMShop.xml.childNodes.length(),
					nde = el = null;
			for(var i=0; i<len; i++){
				nde = SMShop.xml.childNodes.item(i);
				if(nde.baseName=="form"&&nde.getAttribute("name")=="BILLTO"){
					el = SMShop.xml.ownerDocument.createNode("element");
					el.setAttribute("name", "BILLTO_COUNTRY");
					el.setAttribute("type", "select-one");
					el.setAttribute("caption", "-");
					el.setAttribute("value", "-");
					el.text = "-";
					nde.appendChild(el);
					break;
				}
			}
		}
	})();
	/* Complete */

	var sForm = '<iframe name="RED_ORDER" id="RED_ORDER" src="./redirect.html"';
		if(!SMShop.debug){
			sForm += ' width="1" height="1" style="visibility:hidden;display:inline;width:1px;height:1px"';
		} else {
			sForm += ' width="600" height="400"';
		};
		sForm += '></iframe>'
		+ '<form name="orderform" id="orderform" action="' + this.formAction + '" method="post"' + sTarget + 'onsubmit="return(verifyOrder(this))">'
		+ '<input type="hidden" name="SMDatastring" value="' + SX_esc(SMShop.xml.sys_xml(true)) + '">'
		+ '<input type="hidden" name="SMProviderAddresses" value="' + SX_esc(SMProviderAddresses.documentElement.sys_xml(true)) + '">'
		+ '<input type="hidden" name="SMFonts" value="' + SX_esc(SMFonts.documentElement.sys_xml(true)) + '">'
		+ '<input type="hidden" name="SMColors" value="' + SX_esc(SMColors.documentElement.sys_xml(true)) + '">'
		+ '<input type="hidden" name="SMBasketXML" value="' + SMSession.getSession("SMBasketXML") + '">'
		+ '<input type="hidden" name="SMResItems" value="_3CSMResItems_3E_3CSMResItem_20id_3D_22disclaimer_22_3E_X53Cp_X53E_X53Cfont_X520color_X53D_X522_X523ff0000_X522_X53E_X53Cstrong_X53EDies_X520ist_X520ein_X520Muster_X5X2Text!_X520Bitte_X520vor_X520der_X520Ver_X5C3_X5B6ffentlichung_X520Ihres_X520Shops_X52C_X520entsprechend_X520bearbeiten_X5X3_X53C_X52Fstrong_X53E_X53C_X52Ffont_X53E_X526nbsp_X53B_X53C_X52Fp_X53E_X53Ch4_X53EWiderrufsrecht_X53C_X52Fh4_X53E_X53Cp_X53ESie_X520haben_X520das_X520Recht_X52C_X520binnen_X520vierzehn_X520Tagen_X520ohne_X520Angabe_X520von_X520Gr_X5C3_X5BCnden_X520diesen_X520Vertrag_X520zu_X520widerrufen_X5X3_X520Die_X520Widerrufsfrist_X520betr_X5C3_X5A4gt_X520vierzehn_X520Tage_X520ab_X520dem_X520Tag_X5X3_X520Um_X520Ihr_X520Widerrufsrecht_X520auszu_X5C3_X5BCben_X52C_X520m_X5C3_X5BCssen_X520Sie_X520uns_X520mittels_X520einer_X520eindeutigen_X520Erkl_X5C3_X5A4rung_X520(z_X5X3B_X5X3_X520ein_X520mit_X520der_X520Post_X520versandter_X520Brief_X52C_X520Telefax_X520oder_X520E_X5X2Mail)_X520_X5C3_X5BCber_X520Ihren_X520Entschluss_X52C_X520diesen_X520Vertrag_X520zu_X520widerrufen_X52C_X520informieren_X5X3_X520Sie_X520k_X5C3_X5B6nnen_X520daf_X5C3_X5BCr_X520das_X520beigef_X5C3_X5BCgte_X520Muster_X5X2Widerrufsformular_X520verwenden_X52C_X520das_X520jedoch_X520nicht_X520vorgeschrieben_X520ist_X5X3_X520Zur_X520Wahrung_X520der_X520Widerrufsfrist_X520reicht_X520es_X520aus_X52C_X520dass_X520Sie_X520die_X520Mitteilung_X520_X5C3_X5BCber_X520die_X520Aus_X5C3_X5BCbung_X520des_X520Widerrufsrechts_X520vor_X520Ablauf_X520der_X520Widerrufsfrist_X520absenden_X5X3_X53C_X52Fp_X53E_X53Ch4_X53EFolgen_X520des_X520Widerrufs_X53C_X52Fh4_X53E_X53Cp_X53EWenn_X520Sie_X520diesen_X520Vertrag_X520widerrufen_X52C_X520haben_X520wir_X520Ihnen_X520alle_X520Zahlungen_X52C_X520die_X520wir_X520von_X520Ihnen_X520erhalten_X520haben_X52C_X520einschlie_X5C3_X59Flich_X520der_X520Lieferkosten_X520(mit_X520Ausnahme_X520der_X520zus_X5C3_X5A4tzlichen_X520Kosten_X52C_X520die_X520sich_X520daraus_X520ergeben_X52C_X520dass_X520Sie_X520eine_X520andere_X520Art_X520der_X520Lieferung_X520als_X520die_X520von_X520uns_X520angebotene_X52C_X520g_X5C3_X5BCnstigste_X520Standardlieferung_X520gew_X5C3_X5A4hlt_X520haben)_X52C_X520unverz_X5C3_X5BCglich_X520und_X520sp_X5C3_X5A4testens_X520binnen_X520vierzehn_X520Tagen_X520ab_X520dem_X520Tag_X520zur_X5C3_X5BCckzuzahlen_X52C_X520an_X520dem_X520die_X520Mitteilung_X520_X5C3_X5BCber_X520Ihren_X520Widerruf_X520dieses_X520Vertrags_X520bei_X520uns_X520eingegangen_X520ist_X5X3_X520F_X5C3_X5BCr_X520diese_X520R_X5C3_X5BCckzahlung_X520verwenden_X520wir_X520dasselbe_X520Zahlungsmittel_X52C_X520das_X520Sie_X520bei_X520der_X520urspr_X5C3_X5BCnglichen_X520Transaktion_X520eingesetzt_X520haben_X52C_X520es_X520sei_X520denn_X52C_X520mit_X520Ihnen_X520wurde_X520ausdr_X5C3_X5BCcklich_X520etwas_X520anderes_X520vereinbart_X53B_X520in_X520keinem_X520Fall_X520werden_X520Ihnen_X520wegen_X520dieser_X520R_X5C3_X5BCckzahlung_X520Entgelte_X520berechnet_X5X3_X53C_X52Fp_X53E_X53Cp_X53E_X53Ca_X520class_X53D_X522btn_X520special_X522_X520href_X53D_X522_X5X3_X5X3_X52F_X5X3_X5X3_X52Fpg40_X5X3html_X522_X53EZum_X520Widerrufsformular_X53C_X52Fa_X53E_X53C_X52Fp_X53E_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22gtb_22_3E_X53CDIV_X53E_X53CEM_X53EAGB_X520(sofern_X520verwendet)_X52C_X520z_X5X3B_X5X3_X520Regelungen_X520zu_X53C_X52FEM_X53E_X53C_X52FDIV_X53E_X53CDIV_X53E_X53CBR_X53E_X53CEM_X53E_X5X2_X526nbsp_X53BGeltungsbereich_X53CBR_X53E_X5X2_X526nbsp_X53BVertragspartner_X53CBR_X53E_X5X2_X526nbsp_X53BAngebot_X520und_X520Vertragsschluss_X53CBR_X53E_X5X2_X526nbsp_X53BWiderrufsrecht_X53CBR_X53E_X5X2_X526nbsp_X53BPreise_X520und_X520Versandkosten_X53CBR_X53E_X5X2_X526nbsp_X53BLieferung_X53CBR_X53E_X5X2_X526nbsp_X53BZahlung_X53CBR_X53E_X5X2_X526nbsp_X53BEigentumsvorbehalt_X53CBR_X53E_X5X2_X526nbsp_X53BGew_X5C3_X5A4hrleistung_X53C_X52FEM_X53E_X53C_X52FDIV_X53E_X53CDIV_X53E_X53CEM_X53E_X53C_X52FEM_X53E_X526nbsp_X53B_X53C_X52FDIV_X53E_X53CDIV_X53E_X53CEM_X53EWeitere_X520Informationen_X52C_X520z_X5X3B_X5X3_X520zu_X53C_X52FEM_X53E_X53C_X52FDIV_X53E_X53CDIV_X53E_X53CBR_X53E_X53CEM_X53E_X5X2_X526nbsp_X53BBestellvorgang_X53CBR_X53E_X5X2_X526nbsp_X53BVertragstext_X53CBR_X53E_X5X2_X526nbsp_X53BDatenschutz_X53C_X52FEM_X53E_X53C_X52FDIV_X53E_X53CDIV_X53E_X53CEM_X53E_X53C_X52FEM_X53E_X526nbsp_X53B_X53C_X52FDIV_X53E_X53CDIV_X53E_X526nbsp_X53B_X53C_X52FDIV_X53E_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3bank_X5X2account_X5X2bic_22_3EBIC_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3bank_X5X2account_X5X2iban_22_3EIBAN_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3bank_X5X2account_X5X2number_22_3EKontonr_X5X3_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3bank_X5X2account_X5X2owner_22_3EKontoinh_X5X3_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3bank_X5X2code_22_3EBLZ_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3billto_22_3ERechnungsadresse_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3email_22_3EE_X5X2Mail_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3email1_22_3EE_X5X2Mail_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3fax_22_3EFax_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3order_X5X2date_22_3EBestellungsdatum_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3order_X5X2id_22_3EBestellungsnr_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3paymethod_22_3EZahlart_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3phone_22_3EFon_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3shipmethod_22_3EVersandart_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3shipto_22_3EAbweichende_X520Lieferadresse_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22lbl_X5X3weburl_22_3EUrl_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3cust_X5X3disclaimer_22_3E_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3cust_X5X3footer_22_3EVielen_X520Dank_X520und_X520besuchen_X520Sie_X520uns_X520bald_X520wieder!_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3cust_X5X3header_22_3E_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3cust_X5X3imprint_22_3E_X53Cstrong_X53EAnbieter_X53C_X52Fstrong_X53E_X53Cbr_X53ECareli_X53Cbr_X53E_X520_X53Cbr_X53E_X520_X53Cbr_X53E_X53Cbr_X53EGesch_X5C3_X5A4ftsf_X5C3_X5BChrer_X53A_X520_X53Cbr_X53EVerantwortlich_X520f_X5C3_X5BCr_X520den_X520Inhalt_X520der_X520Website_X53A_X520_X520_X53Cbr_X53E_X53Cbr_X53ETelefon_X53A_X520_X53Cbr_X53EFax_X53A_X520_X53Cbr_X53EE_X5X2Mail_X53A_X520_X53Cbr_X53E_X53Cbr_X53ESteuerNr_X5X3_X53A_X520_X53Cbr_X53EUSt_X5X3_X5X2IdNr_X5X3_X53A_X520_X53Cbr_X53E_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3cust_X5X3prolog_22_3EVielen_X520Dank_X520f_X5C3_X5BCr_X520Ihre_X520Bestellung_X52C_X520die_X520wir_X520wie_X520folgt_X520entgegengenommen_X520haben_X53A_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3cust_X5X3subject_22_3EIhre_X520Bestellung_X520Nr_X5X3_X520MAILOID_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3prov_X5X3footer_22_3E_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3prov_X5X3header_22_3ENeuer_X520Bestelleingang!_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3prov_X5X3prolog_22_3E_3C_2FSMResItem_3E_3CSMResItem_20id_3D_22txt_X5X3prov_X5X3subject_22_3ENeuer_X520Bestelleingang_X520Nr_X5X3_X520MAILOID_X5X3_X5X3_X5X3_3C_2FSMResItem_3E_3C_2FSMResItems_3E">'
		+ '<input type="hidden" name="SMCfgItems" value="_3CSMCfgItems_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2bic_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2iban_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2account_X5X2owner_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2code_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2bank_X5X2name_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2city_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2company_X5X2director_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2company_X5X2director_X5X2label_22_3EGesch_X5C3_X5A4ftsf_X5C3_X5BChrer_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2company_X5X2name_22_3ECareli_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2country_X5X2name_22_3EDeutschland_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2fax_X5X2business_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2fax_X5X2hotline_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2firstname_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2lastname_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2contact_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2default_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2orders_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2support_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2mail_X5X2webmaster_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2phone_X5X2business_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2phone_X5X2hotline_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2phone_X5X2mobile_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2region_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2salutation_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2street_X5X2name_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2street_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2tax_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2title_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2trade_X5X2number_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2url_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2vat_X5X2id_22_3E_3C_2FSMCfgItem_3E_3CSMCfgItem_20key_3D_22provider_X5X2zip_X5X2code_22_3E_3C_2FSMCfgItem_3E_3C_2FSMCfgItems_3E">'
		+ '<input type="hidden" name="SMSuccessPage" value="' + SX_esc(sSuccessPage) + '">'
		+ '<input type="hidden" name="SMErrorPage" value="' + SX_esc(sErrorPage) + '">'
		+ '<input type="hidden" name="SMLogo" value="' + SX_esc(sLogo) + '">'
		+ '<input type="hidden" name="SMPHPRedir" value="' + sTopRedir + '">'
		+ '</form>';
		return(sForm);
};

function SMOrderForm_printForm(){
	document.write(this.renderForm());
};

function redirTimeout(){
	location.replace(oSMOrderForm.redirError);
};

function verifyOrder(oForm){
	var bVerify = true;

	for(var oField in oForm.elements){
		if(oField.value.length == 0){
			bVerify = false;
			break;
		};
	};

	if(bVerify){
		SMSession.removeSession("SMBasketXML");
		return(true);
	} else {
		location.replace(oSMOrderForm.redirError);
		return(false);
	};
};

var oSMOrderForm = new SMOrderForm();
SMShop.base.addMember("SMSubmitOrder");
function SMSubmitOrder_windowOnLoad(args){
	SMShop.base.removeMember("SMSubmitOrder");
	if(SMShop.getAttribute(_SMAOComplete)!="true"){
		if(!oSMOrderForm.submitted){
			oSMOrderForm.submitted = true;
			window.setTimeout("redirTimeout()", 30000);
			if(!oSMOrderForm.cancelOrder){
				_.delay(function () {
					var orderForm = document.getElementById('orderform');
					if(orderForm){
						orderForm.action = SMBrokerURL;
						window.setTimeout("document.getElementById('orderform').submit()", 100);
					}
				} , 2000, '');
			};
		};
	} else {
		history.forward();
	};
};