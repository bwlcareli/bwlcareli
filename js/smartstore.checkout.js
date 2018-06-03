function SMShipMethods(){
var SMPrice=new cSMPrice(),totalPrice=0,usingShipToAddress=false;
SMPrice.decode(SMShop.basket.getAttribute(_SMADSubTotal));
this.relTotalPrice=SMShop.getAttribute(_SMAInGross)!="1"?SMPrice.net:SMPrice.gross;
usingShipToAddress=(SMShop.getFormElement("BILLTO","BILLTO_SHIPTO_DIFFERS")!=null);
if(usingShipToAddress){
usingShipToAddress=toBool(SMShop.getFormValue("BILLTO","BILLTO_SHIPTO_DIFFERS",true));
};
if(usingShipToAddress){
this.relCountryCode=SMShop.getFormValue('SHIPTO','SHIPTO_COUNTRY',true).toUpperCase();
}else{
this.relCountryCode=SMShop.getFormValue('BILLTO','BILLTO_COUNTRY',true).toUpperCase();
};
this.relTotalWeight=SMShop.basket.getAttribute(_SMAWeightTotal);
this.relTotalQty=SMShop.basket.getAttribute(_SMATotalItems);
this.relSelectedItemId=SMShop.getActiveShipMethodId();
this.getSelectedShipMethod=SMShipMethods_getSelectedShipMethod;
this.setShipMethod=SMShipMethods_setShipMethod;
this.saveRedirect=SMShipMethods_saveRedirect;
this.calcDynamic=SMShipMethods_calcDynamic;
this.calcCharge=SMShipMethods_calcCharge;
this.autoSelect=SMShipMethods_autoSelect;
this.saveMethod=SMShipMethods_saveMethod;
this.printTable=SMShipMethods_printTable;
this.htmlTable=SMShipMethods_htmlTable;
this.goBack=SMShipMethods_goBack;
this.selectdItemIndex=0;
this.arrMethods=function(){
var sWeight='',fromWeight=maxWeight=0,arrWeight=null;
var dblCharge=0,arrSource=null,arrTarget=new Array();
var oCalculator=oMethod=null,sPluginRef=sPluginFunction='';
for(pkid in m_arrShipMethods){
if(isNaN(pkid))continue;
arrSource=m_arrShipMethods[pkid].split(';');
oMethod=new SMShipMethod();
oMethod.id=SX_uEsc(arrSource[0]);
oMethod.name=SX_uEsc(arrSource[1]);
oMethod.desc=SX_uEsc(arrSource[2]);
oMethod.thumb=SX_uEsc(arrSource[3]);
oMethod.exclPayMethods=arrSource[9];
oMethod.publicId=SX_uEsc(arrSource[10]);
oCalculator=new SMShipCalculator(pkid,arrSource[8],this.relCountryCode);
if(oCalculator==null||oCalculator.chargeValues==null)continue;
oMethod.calculator=oCalculator;
oMethod.calcShipSurcharge=false;
sPluginRef=arrSource[4].toString();
if(sPluginRef.length>0){
sPluginFunction='SMShipMethodPlugin_'+SX_uEsc(sPluginRef);
try{window[sPluginFunction](oMethod)}
catch(e){continue};
};
sWeight=arrSource[7].toString();
if(sWeight.length>0){
arrWeight=sWeight.split(',');
fromWeight=parseFloat(arrWeight[0]);
maxWeight=parseFloat(arrWeight[1]);
if(this.relTotalWeight<fromWeight||(maxWeight>0&&this.relTotalWeight>fromWeight
&&this.relTotalWeight>maxWeight))continue;
};
dblCharge=this.calcCharge(oCalculator);
if(dblCharge<0)continue;
oMethod.charge=parseFloat(dblCharge);
oMethod.taxkey=parseInt(arrSource[5]);
if(parseInt(arrSource[6])==1){
oMethod.calcShipSurcharge=true;
};
if(oMethod.id==this.relSelectedItemId){
this.selectdItemIndex=parseInt(arrTarget.length);
};
arrTarget[arrTarget.length]=oMethod;
};
return(arrTarget);
};
this.shipMethods=this.arrMethods();
this.selectedMethod=null;
this.doAutoSelect=false;
};
function SMShipMethod(){
this.id='';
this.publicId='';
this.name='';
this.desc='';
this.thumb='';
this.charge=0;
this.taxkey=0;
this.exclPayMethods='';
this.calculator=null;
};
function SMShipMethods_setShipMethod(shipMethodId){
this.selectedMethod=null;
for(var i=0;i<this.shipMethods.length;i++){
if(this.shipMethods[i].id==shipMethodId){
this.selectedMethod=this.shipMethods[i];
break;
};
};
return((this.selectedMethod!=null));
};
function SMShipMethods_autoSelect(){
if(this.doAutoSelect&&this.shipMethods.length==1){
this.selectedMethod=this.shipMethods[0];
SMShop.setShipMethod(this.selectedMethod)
SMGetCheckoutStep('SM_RESERVED_DATA_ENTRY_SHIPMENT',false)
};
};
function SMShipMethods_calcDynamic(calculator,isTable){
var dblBase=dblCharge=0;
switch(calculator.chargeBase){
case 0:dblBase=this.relTotalPrice;break;
case 1:dblBase=this.relTotalWeight;break;
case 2:dblBase=this.relTotalQty;break;
};
dblCharge=dblBase*calculator.chargeMultiplier;
if(!isTable){
if(calculator.chargeBase==0){
dblCharge=dblCharge/100;
};
dblCharge+=calculator.chargeValue;
if(calculator.chargeMax>0&&dblCharge>calculator.chargeMax){
dblCharge=calculator.chargeMax;
};
};
return(dblCharge);
};
function SMShipMethods_calcCharge(calculator){
var oCalc=null,bytBase=0,bCalculate=false;
if(calculator.chargeFreeFrom>0&&this.relTotalPrice>=calculator.chargeFreeFrom){
return(0);
}else if(calculator.chargeType==0){
return(calculator.chargeValue);
}else if(calculator.chargeType==1){
return(this.calcDynamic(calculator,false));
}else if(calculator.shipTables!=null){
bytBase=calculator.chargeBase;
for(var i=0;i<calculator.shipTables.length;i++){
oCalc=calculator.shipTables[i];
if(bytBase==0){
bCalculate=(this.relTotalPrice<=oCalc.upToAmount);
}else if(bytBase==1){
bCalculate=(this.relTotalWeight<=oCalc.upToAmount);
}else if(bytBase==2){
bCalculate=(this.relTotalQty<=oCalc.upToAmount);
};
if(bCalculate){
if(oCalc.chargeType==0){
return(oCalc.chargeValue);
}else if(oCalc.chargeType==1){
return(this.calcDynamic(oCalc,true));
};
};
};
};
return(-1);
};
function SMShipCalculator(pkid,zones,country){
var arrCharge=function(){
var arrZones=zones.length>0?zones.split(','):null;
if(arrZones==null){
if(m_arrShipCalculators[pkid]){
return(m_arrShipCalculators[pkid].split(';'));
};
}else{
for(var i=0;i<arrZones.length;i++){
if(!m_arrShipZones[arrZones[i]])continue;
if((';'+m_arrShipZones[arrZones[i]].toUpperCase()+';').indexOf(';'+country+';')>-1){
return(m_arrZoneCalculators[arrZones[i]].split(';'));
};
};
};
};
this.chargeValues=arrCharge();
if(this.chargeValues!=null){
this.chargeType=parseInt(this.chargeValues[0]);
this.chargeBase=parseInt(this.chargeValues[1]);
this.chargeValue=parseFloat(this.chargeValues[2]);
this.chargeMultiplier=parseFloat(this.chargeValues[3]);
this.chargeMax=parseFloat(this.chargeValues[4]);
this.chargeFreeFrom=parseFloat(this.chargeValues[5]);
this.shipTables=null;
if(this.chargeType==2){
this.shipTables=new SMShipTables(this.chargeValues).tables;
};
};
};
function SMShipTables(cvalues){
var arrTables=function(){
var arrTable=cvalues[6].length>0?cvalues[6].split(','):null;
var arrValues=new Array();
if(arrTable!=null){
for(var i=0;i<arrTable.length;i++){
if(!m_arrShipTables[arrTable[i]])continue;
arrValues[arrValues.length]=new SMShipTable(cvalues,arrTable[i]);
};
};
return(arrValues);
};
this.tables=arrTables();
};
function SMShipTable(cvalues,pkid){
var arrValues=m_arrShipTables[pkid].split(';');
this.chargeType=parseInt(arrValues[0]);
this.chargeValue=parseFloat(arrValues[1]);
this.upToAmount=parseFloat(arrValues[2]);
this.chargeBase=parseInt(cvalues[1]);
this.chargeMultiplier=parseFloat(arrValues[1]);
this.chargeMax=parseFloat(cvalues[4]);
};
function SMShipMethods_htmlTable(){
var arrMethods=this.shipMethods;
var oSMPrice=oSMPriceSurcharge=imgThumb=null;
var sProductSurcharges='',sProductSurchargesCaption='zzgl. %su Transportzuschlag';
var hasImages=false;
for(var i=0;i<arrMethods.length;i++){
if(arrMethods[i].thumb.length>0){
hasImages=true;
}
}
var sTable='<form name="shipmethods" onsubmit="return(oSMShipMethods.saveRedirect())" style="display:inline"><table id="shipmethods" cellpadding="4" cellspacing="0">';
if(arrMethods.length>0){
for(var i=0;i<arrMethods.length;i++){
oSMPrice=new cSMPrice();
oSMPriceSurcharge=new cSMPrice();
oSMPrice.calculate(arrMethods[i].charge,!toBool(SMShop.getAttribute(_SMAInGross)),arrMethods[i].taxkey);
oSMPriceSurcharge.calculate(SMShop.basket.getAttribute(_SMATotalShipSurcharges),!toBool(SMShop.getAttribute(_SMAInGross)),arrMethods[i].taxkey);
if(arrMethods[i].calcShipSurcharge&&oSMPriceSurcharge.net>0){
sProductSurcharges=cprimary.format((SMShop.getAttribute(_SMAOutGross)!="1")?oSMPriceSurcharge.net:oSMPriceSurcharge.gross,SM_CGROUP+SM_CSYMBOL);
sProductSurchargesCaption=sProductSurchargesCaption.replace(/%su/gi,sProductSurcharges);
}else{
sProductSurcharges='';
sProductSurchargesCaption='';
};
sTable+='<tr valign="top" class="shipmethod shipmethod-line hr'+(i%2==0?' even':' odd')+'">'
if(hasImages){
sTable+='<td>';
if(arrMethods[i].thumb.length>0){
imgThumb=new Image();
imgThumb.src=arrMethods[i].thumb;
sTable+='<img class="shipmethod-thumb" src="'+_(arrMethods[i].thumb).ltrim('../')+'">';
};
sTable+='</td>';
}
sTable+='<td class="option ac"><label><input id="shipmethod-'+arrMethods[i].id+'" type="radio" '+(i==this.selectdItemIndex?"checked ":"")+'name="optShipMethod" value="'+arrMethods[i].id+'"></label></td>';
sTable+='<td class="shipmethod-info">';
sTable+='<h3><label for="shipmethod-'+arrMethods[i].id+'">'+arrMethods[i].name+'</label></h3><div>'+arrMethods[i].desc;
if(sProductSurchargesCaption!=''){
sTable+='<br>'+sProductSurchargesCaption;
};
sTable+='</div>'
+'</td>'
+'<td class="shipment-charge">'+cprimary.format(toBool(SMShop.getAttribute(_SMAOutGross))?oSMPrice.gross:oSMPrice.net,SM_CGROUP+SM_CSYMBOL);+'</td>'
+'</tr>';
};
sTable+='</table>';
sTable+='<div class="btn-panel ac">';
sTable+='		<a id="btn-shipment-prev" class="btn" data="{icons: {primary: \'ui-icon-triangle-1-w\'}}" alt="Zurück" title="Zurück">Zurück</a>';
sTable+='		<a id="btn-shipment-next" class="btn special" data="{icons: {secondary: \'ui-icon-triangle-1-e\'}}" alt="Weiter" title="Weiter">Weiter</a>';
sTable+='</div>';
}else{
sTable+='</table>';
sTable+='<p>';
sTable+='Verzeihung. Das System konnte leider keine entsprechende Versandart bereitstellen. Bitte kontaktieren Sie uns, um Ihnen ein Angebot zu machen.';
sTable+='</p>';
sTable+='<div>';
sTable+='<a id="btn-shipment-prev" class="btn" alt="Zurück" title="Zurück">Zurück</a>';
sTable+='</div>';
};
sTable+='</form>';
return(sTable);
};
function SMShipMethods_printTable(){
/*
document.write(this.htmlTable());
SMShop.initShipmentButtons();
*/
};
function SMShipMethods_saveMethod(selectedMethodId){
if(this.setShipMethod(selectedMethodId)){
return(SMShop.setShipMethod(this.selectedMethod));
};
return(false);
};
function SMShipMethods_saveRedirect(){
if(this.saveMethod(this.getSelectedShipMethod())){
SMGetCheckoutStep('SM_RESERVED_DATA_ENTRY_SHIPMENT',false);
};
return(false);
};
function SMShipMethods_goBack(){
SMGetCheckoutStep('SM_RESERVED_DATA_ENTRY_SHIPMENT',true);
return(false);
};
function SMShipMethods_getSelectedShipMethod(){
var elem=null;
for(var i=0;i<document.shipmethods.elements.length;i++){
elem=document.shipmethods.elements[i];
if(elem.name=='optShipMethod'&&elem.checked){
return(elem.value);
};
};
return('');
};
var m_arrShipMethods=new Array();
m_arrShipMethods[2]="2;DHL;Die_20Zustellung_20erfolgt_20durch_20DHL;;;1;0;;;;DM_X201002";m_arrShipMethods[3]="3;UPS;Die_20Zustellung_20erfolgt_20durch_20UPS;;;1;0;;;;DM_X201003";var m_arrShipCalculators=new Array();
m_arrShipCalculators[2]='0;0;10;0;0;70;';m_arrShipCalculators[3]='0;0;10;0;0;70;';var m_arrZoneCalculators=new Array();
var m_arrShipZones=new Array();
var m_arrShipTables=new Array();
var oSMShipMethods=null;oSMShipMethods=new SMShipMethods();SMShop.base.addMember("oSMShipMethods");function oSMShipMethods_windowOnLoad(args){var oShipSelector=null;oSMShipMethods=new SMShipMethods();if(document.getElementById("shipmethodselector")){oShipSelector=document.getElementById("shipmethodselector");oShipSelector.innerHTML=oSMShipMethods.htmlTable();SMShop.initShipmentButtons();oShipSelector.style.height=oShipSelector.offsetHeight;};};
/*
;(function(){
$.provide($.Payment);
var Payment=$.Payment={
isPayform:function(oForm){
var retval=false;
for(var i=0;i<oForm.elements.length;i++){
if(oForm.elements[i].name=='SMPAYMETHOD_SELECTOR'){
retval=true;
break;
};
};
return(retval);
}
};
})();
*/
function isPayform(oForm){
var retval=false;
for(var i=0;i<oForm.elements.length;i++){
if(oForm.elements[i].name=='SMPAYMETHOD_SELECTOR'){
retval=true;
break;
};
};
return(retval);
};
function setActiveForm(formname){
formname=formname?formname:document.forms[0].name;
for(var i=0;i<document.forms.length;i++){
if(isPayform(document.forms[i])){
if(document.forms[i].name==formname){
document.forms[i].SMPAYMETHOD_SELECTOR.checked=true;
}else{
document.forms[i].SMPAYMETHOD_SELECTOR.checked=false;
};
};
};
};
function totalPayMethodCount(){
var formCount=0;
for(var i=0;i<document.forms.length;i++){
if(isPayform(document.forms[i])){
formCount++;
};
};
return(formCount);
};
function hideExclMethods(){
var relCountryCode='';
var relShipToCountryCode='';
var relBillToCountryCode=SMShop.getFormValue('BILLTO','BILLTO_COUNTRY',true).toUpperCase();
var usingShipToAddress=(SMShop.getFormElement("BILLTO","BILLTO_SHIPTO_DIFFERS")!=null);
var relSelectedItemId=SMShop.getActivePayMethodId();
var exclMethods=oSMPayMethods.exclMethods,arrExcl=null;
var sId='',bAdd=true,sRelId=sSelectFormName='';
var iActiveCount=totalPayMethodCount();
var sErrDesc=getVar('errdesc');
var el;
if(usingShipToAddress){
usingShipToAddress=toBool(SMShop.getFormValue("BILLTO","BILLTO_SHIPTO_DIFFERS",true));
};
if(usingShipToAddress){
relShipToCountryCode=SMShop.getFormValue('SHIPTO','SHIPTO_COUNTRY',true).toUpperCase();
};
if(sErrDesc.length>0){
jQuery('#SMPAYERRDESC').html(sErrDesc);
jQuery('#SMPAYERRDESC').css("display","block");
}else{
jQuery('#SMPAYERRDESC').css("display","none");
};
for(var pkid in m_exclPayMethodRegions){
if(isNaN(pkid)||!oSMPayMethods.payMethods[pkid])continue;
if(usingShipToAddress&&oSMPayMethods.payMethods[pkid].isShipCountryBased){
relCountryCode=relShipToCountryCode;
}else{
relCountryCode=relBillToCountryCode;
};
if((m_exclPayMethodRegions[pkid].toUpperCase()+',').indexOf(relCountryCode+',')>-1){
arrExcl=exclMethods.split(',');bAdd=true;
for(var i=0;i<arrExcl.length;i++){
if(parseInt(arrExcl[i])==parseInt(pkid)){
bAdd=false;break;
};
};
if(bAdd){
if(exclMethods.length>0)exclMethods+=',';
exclMethods+=pkid.toString();
};
};
};
if(exclMethods.length>0){
arrExcl=exclMethods.split(',');
for(var j=0;j<arrExcl.length;j++){
sId='#SMPAYMETHOD'+arrExcl[j];
el=jQuery(sId);
if(el.length>0){
el.hide(0);
iActiveCount--;
};
};
};
if(iActiveCount>0){
for(var i=0;i<document.forms.length;i++){
if(isPayform(document.forms[i])){
sRelId='#SMPAYMETHOD'+document.forms[i].SMPAYMETHOD_SELECTOR.value;
el=jQuery(sRelId);
if(el.length>0){
if(!el.is(":hidden")){
sSelectFormName=document.forms[i].name;
break;
};
};
};
};
if(relSelectedItemId.length>0){
sRelId='#SMPAYMETHOD'+relSelectedItemId;
el=jQuery(sRelId);
if(el.length>0){
if(!el.is(":hidden")){
sRelId='#SMPAYMETHOD_SELECTOR'+relSelectedItemId;
sSelectFormName=el.children('form:first').attr('name');
};
};
};
setActiveForm(sSelectFormName);
}else{
if(jQuery("#SMPAYACTION").length>0){
jQuery('#SMPAYACTION').hide(0);
};
if(jQuery("#SMPAYNOTE").length>0){
jQuery('#SMPAYACTION').css("display","");
};
};
};
function SMPayMethods_saveRedirect(){
console.log("SMPayMethods_saveRedirect");
var oSelectedForm=null,sId='';
var oActiveMethod=null,sVerify='';
for(var i=0;i<document.forms.length;i++){
if(isPayform(document.forms[i])){
if(document.forms[i].SMPAYMETHOD_SELECTOR.checked){
oSelectedForm=document.forms[i];
sId=document.forms[i].SMPAYMETHOD_SELECTOR.value;
oActiveMethod=oSMPayMethods.payMethods[sId];
oActiveMethod.payForm=oSelectedForm;
break;
}
}
};
/*
sVerify='SMFRMVerify_'+oSelectedForm.name;
if(window[sVerify]!=null){
if(window[sVerify]()==false){
return(false);
};
};
*/
if(jQuery('form#'+oSelectedForm.name).validate().form()==false){
return(false);
};
if(SMShop.setPayMethod(oActiveMethod)){
SMGetCheckoutStep('SM_RESERVED_DATA_ENTRY_PAYMENT',false);
};
return(false);
};
function SMPayMethods_goBack(){
SMGetCheckoutStep('SM_RESERVED_DATA_ENTRY_PAYMENT',true);
};
function SMPayMethods(){
var SMPrice=new cSMPrice(),totalPrice=0;
SMPrice.decode(SMShop.basket.getAttribute(_SMADSubTotal));
this.payMethods=new Array();
this.exclMethods=SMShop.getActiveShipMethodExclusions();
this.relTotalPrice=SMShop.getAttribute(_SMAOutGross)!="1"?SMPrice.net:SMPrice.gross;
this.addPayMethod=SMPayMethods_addMethod;
this.addExclMethod=SMPayMethods_addExclMethod;
};
function SMPayMethod(){
this.id='';
this.publicId='';
this.name='';
this.desc='';
this.thumb='';
this.chargeType=0;
this.chargeValue=0;
this.taxkey=0;
this.payForm=null;
this.isShipCountryBased=false;
};
function SMPayMethods_addExclMethod(pkid){
var arrExcl=null,bAdd=true;
arrExcl=this.exclMethods.split(',');
for(var i=0;i<arrExcl.length;i++){
if(parseInt(arrExcl[i])==parseInt(pkid)){
return;
};
};
if(this.exclMethods.length>0)this.exclMethods+=',';
this.exclMethods+=pkid.toString();
};
function SMPayMethods_addMethod(values){
var arr=values.split(';');
var sOrderValue=arr[7];
var arrOrderValue=null;
var fromValue=maxValue=0;
if(sOrderValue.length>0){
arrOrderValue=sOrderValue.split(',');
fromValue=parseFloat(arrOrderValue[0]);
maxValue=parseFloat(arrOrderValue[1]);
if(this.relTotalPrice<fromValue||(maxValue>0&&this.relTotalPrice>fromValue&&this.relTotalPrice>maxValue)){
this.addExclMethod(arr[0].toString());
return;
};
};
var oMethod=new SMPayMethod();
oMethod.id=SX_uEsc(arr[0]);
oMethod.name=SX_uEsc(arr[1]);
oMethod.desc=SX_uEsc(arr[2]);
oMethod.thumb=SX_uEsc(arr[3]);
oMethod.chargeType=parseFloat(arr[4]);
oMethod.chargeValue=parseFloat(arr[5]);
oMethod.taxkey=parseInt(arr[6]);
oMethod.publicId=SX_uEsc(arr[8]);
oMethod.isShipCountryBased=toBool(arr[9]);
this.payMethods[arr[0].toString()]=oMethod;
};
var m_exclPayMethodRegions=new Array();
var oSMPayMethods=new SMPayMethods();
oSMPayMethods.addPayMethod('2;Nachnahme;Bezahlen_20Sie_20die_20Rechnung_20bequem_20bei_20Erhalt_20der_20Ware_20per_20Nachnahme_20bei_20Ihrem_20Paketboten_X3;;0;0;1;;PM_X201002;0');if(SMShop.basket.payMethodInfo.xml.getAttribute(_SMAUniqueID)==""){SMShop.setPayMethod(oSMPayMethods.payMethods[(2).toString()]);};oSMPayMethods.addPayMethod('3;Bankeinzug;Geben_20Sie_20bitte_20Ihre_20Bankdaten_20ein_X3_20Die_20Daten_20werden_20mit_20dem_20Auftrag_20zur_20weiteren_20Bearbeitung_20an_20uns_20_C3_BCbermittelt_X3;;0;0;1;;PM_X201003;0');if(SMShop.basket.payMethodInfo.xml.getAttribute(_SMAUniqueID)==""){SMShop.setPayMethod(oSMPayMethods.payMethods[(2).toString()]);};oSMPayMethods.addPayMethod('4;Kreditkarte;Geben_20Sie_20bitte_20Ihre_20Kreditkartendaten_20ein_X3_20Die_20Daten_20werden_20mit_20dem_20Auftrag_20zur_20weiteren_20Bearbeitung_20an_20uns_20_C3_BCbermittelt_X3;;0;0;1;;PM_X201004;0');if(SMShop.basket.payMethodInfo.xml.getAttribute(_SMAUniqueID)==""){SMShop.setPayMethod(oSMPayMethods.payMethods[(2).toString()]);};oSMPayMethods.addPayMethod('5;Rechnung;Zahlen_20Sie_20nach_20Erhalt_20unseres_20schriftlichen_20Rechnungsdokumentes_X3;;0;0;1;;PM_X201005;0');if(SMShop.basket.payMethodInfo.xml.getAttribute(_SMAUniqueID)==""){SMShop.setPayMethod(oSMPayMethods.payMethods[(2).toString()]);};oSMPayMethods.addPayMethod('12;PayPal;PayPal_20ist_20der_20Online_X2Zahlungsservice_2C_20mit_20dem_20Sie_20in_20Online_X2Shops_20sicher_2C_20einfach_20und_20schnell_20bezahlen_20_X2_20und_20das_20kostenlos_X3;_X3_X3_2Fmedia_2Fimages_2Fpp_X2logo_X2big_X3png;0;0;1;;P_X201011;0');if(SMShop.basket.payMethodInfo.xml.getAttribute(_SMAUniqueID)==""){SMShop.setPayMethod(oSMPayMethods.payMethods[(2).toString()]);};
function cSMBasketGUIColumn(id,caption){
this.styleHeader=new cSMStyleBox();
this.styleBody=new cSMStyleBox();
this.id=id;
this.index=0;
this.product=null;
this.caption=caption;
this.gui=null;
this.render=null;
this.renderXML=null;
};
function cSMBasketGUIFooterItem(id,caption){
this.styleCaption=new cSMStyleBox();
this.styleValue=new cSMStyleBox();
this.id=id;
this.basket=null;
this.caption=caption;
this.gui=null;
this.render=null;
this.renderXML=null;
this.cancel=false;
};
function cSMBasketGUI(id){
this.id=id;
this.hideColumnHeaders=false;
this.base=new cSMBase(this.id);
this.shop=SMShop;
this.basket=this.shop.basket;
this.columns=new Array();
this.footerItems=new Array();
this.styleTable=new cSMStyleBox();
this.basket.base.addMember(this.id);
};
cSMBasketGUI.prototype.addColumn=function(id,caption){
var c=new cSMBasketGUIColumn(id,caption);
this.columns[this.columns.length]=c;c.gui=this;
return(c);
};
cSMBasketGUI.prototype.addFooterItem=function(id,caption){
var f=new cSMBasketGUIFooterItem(id,caption);
this.footerItems[this.footerItems.length]=f;f.gui=this;
return(f);
};
cSMBasketGUI.prototype.render=function(){
var s=fc="",xb=this.basket.xml,xc=null,p=null,
c=null,f=null,tro="<tr>",trc="</tr>",tho="<th",thc="</th>",tdo="<td",tdc="</td>",cl=null,fset=false;
s+="<form"+this.htAttrib("style","display:inline")+"><table id=\"basket\""+this.styleTable.createInlineCode()+">";
with(this.basket.parent){
if(getAttribute(_SMAOComplete)=="true"){
reinitOrder();
};
};
if(!this.hideColumnHeaders){
s+="<thead>"+tro;
for(var i=0;i<this.columns.length;i++){
c=this.columns[i];
c.index=i;c.product=p;
s+=tho+c.styleHeader.createInlineCode()+">"+c.caption+thc;
};
s+=trc+"</thead>";
};
s+="<tbody>";
if(xb.selectNodes(_SMPrd).length()==0){
s+=tro+tdo+" class=\"empty\" colspan=\"" + this.columns.length + "\">";
s+="Ihr Warenkorb enthält keine Einträge, bitte legen Sie mindestens einen Artikel in den Warenkorb."+tdc+trc;
}
else{
for(var i=0;i<xb.selectNodes(_SMPrd).length();i++){
xc=xb.selectNodes(_SMPrd).item(i);
p=new cSMProduct(_SMPrd);p.shop=this.shop;p.basket=this.basket;p.parent=this.basket;p.init(xc);
s+="<tr id=\"" + xc.getAttribute(_SMAUniqueID) + "\">";
for(var j=0;j<this.columns.length;j++){
c=this.columns[j];c.index=i;c.product=p;
cl=new Array();
if(c.render!=null){
/*
if(i==0)cl[cl.length]="first-item";
*/
if(i%2==1)c.styleBody.CSSClass+=" odd";
s+=tdo
+c.styleBody.createInlineCode()+">"+c.render()+tdc;
};
c.styleBody.CSSClass=c.styleBody.CSSClass.replace(" odd","");
};
s+=trc;
};
};
s+="</tbody>";
if(this.footerItems.length>0&&this.basket.getAttribute(_SMAItems)!="0"){
s+="<tfoot>";
for(var i=0;i<this.footerItems.length;i++){
f=this.footerItems[i];f.basket=f.gui.basket;f.cancel=false;
fc=tro+tdo+this.htAttrib("colspan",(this.columns.length-1))+f.styleCaption.createInlineCode()+">";
fc+=f.caption+tdc;
/*
if(i==0||!fset)cl[cl.length]="first-item";
*/
fc+=tdo+this.htAttrib("class",cl.join(" "))+f.styleValue.createInlineCode()+" >";
if(f.render!=null)fc+=f.render();
fc+=tdc+trc;
if(!f.cancel){
s+=fc;
fset=true;
}
else if(i==0)fset=false;
};
s+="</tfoot>";
};
s+="</table>";
s+="</form>";
xc=document.getElementById("basket-buttons");if(xc)xc.style.display=((xb.selectNodes(_SMPrd).length()!=0)?"inline":"none");
return(s);
};
cSMBasketGUI.prototype.renderXML=function(){
var dom=new SXMLDom(),xc=p=c=f=xf=null;
with(dom){
documentElement=createNode("SMBasketXML");
with(documentElement){
with(appendChild(dom.createNode("SMColumns"))){
for(var i=0;i<this.columns.length;i++){
c=this.columns[i];c.index=i;c.product=p;
with(appendChild(dom.createNode("SMColumn"))){
setAttribute("id",c.id);
setAttribute("caption",c.caption);
};
};
};
with(appendChild(dom.createNode("SMPositions"))){
xb=this.basket.xml.selectNodes(_SMPrd);
for(var i=0;i<xb.length();i++){
xc=xb.item(i);
p=new cSMProduct(_SMPrd);p.shop=this.shop;p.basket=this.basket;p.parent=this.basket;p.init(xc);
with(appendChild(dom.createNode("SMPosition"))){
for(var j=0;j<this.columns.length;j++){
c=this.columns[j];c.index=i;c.product=p;
with(appendChild(dom.createNode("SMColumn"))){
setAttribute("id",c.id);
if(c.renderXML!=null){
text=c.renderXML();
}
else if(c.render!=null)text=c.render();
};
};
};
};
};
with(appendChild(dom.createNode("SMFooterItems"))){
for(var i=0;i<this.footerItems.length;i++){
f=this.footerItems[i];f.basket=f.gui.basket;
xf=dom.createNode("SMFooterItem");
with(xf){
setAttribute("id",f.id);
setAttribute("caption",f.caption);
if(f.renderXML!=null){
text=f.renderXML();
}
else if(f.render!=null)text=f.render();
};
if(!f.cancel)appendChild(xf);
};
};
};
};
return(dom);
};
cSMBasketGUI.prototype.htAttrib=function(p,v){
var s="";
if(p!=""&&v!=""){
s+=" "+p+"=\"";
s+=v+"\"";
};
return(s);
};
