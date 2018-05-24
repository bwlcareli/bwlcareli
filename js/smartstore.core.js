
(function($,undefined){
var shakeOpts={direction:"right",distance:4,times:3,easing:"easeInOutCubic"};
$.Utils={
doQuickSearch:function(frm){
var box=frm.find("input.searchterm");
var value=box.val();
if(_.isBlank(value)){
frm.stop(true,true)
.effect("shake",shakeOpts,100,function(){box.trigger("focus").removeClass("placeholder")});
}
else{
SMShop.xml.setAttribute('search-query','searchterm='+_.encodeUri(value)+'&dosearch=1');
SMShop.update();
location.href=$.Cfg.searchPage;
}
return false;
},
showInfoPopup:function(pagehref,popwidth,popheight){
var opts={
width:popwidth||600,
height:popheight||500,
showScroll:true,
targetUrl:pagehref,
isResizeable:true
};
showInfoPopup2(pagehref,opts);
},
showInfoPopup2:function(pagehref,options){
var opts=$.extend({},$.Cfg.infoPopupOptions,options||{});
var oPopup=new SMPopup();
oPopup.pWidth=opts.width;
oPopup.pHeight=opts.height;
$.extend(oPopup,opts);
if(opts.left)oPopup.pLeft=opts.left;
if(opts.top)oPopup.pTop=opts.top;
oPopup.targetUrl=pagehref;
oPopup.openPage();
},
formatPrice:function(price,taxKey){
var inGross=toBool(SMShop.getAttribute(_SMAInGross));
var outGross=toBool(SMShop.getAttribute(_SMAOutGross));
oPrice=new cSMPrice();
oPrice.calculate(price,!inGross,taxKey);
return cprimary.format(outGross?oPrice.gross:oPrice.net,SM_CGROUP+SM_CSYMBOL);
},
getVar:function(name){
var result=$_GET[name];
if(result){
return result.replace("/","%2F").replace("+","%2B");
}
else{
return "";
}
},
initGetVars:function(getVars,arrTarget){
var arrVars=arrVal=null;
if(!_.isEmpty(getVars.length)){
arrVars=getVars.replace(/\?/g,'').split('&');
for(var i=0;i<arrVars.length;++i){
arrVal=arrVars[i].split('=');
arrTarget[arrVal[0].toString()]=unescape(arrVal[1]).toString();
}
}
return arrTarget;
}
};
window.showInfoPopup=$.Utils.showInfoPopup;
window.showInfoPopup2=$.Utils.showInfoPopup2;
window.printBackButton=function(){return ""};
window.printOrderId=function(){return ""};
window.formatPrice=$.Utils.formatPrice;
window.getVar=$.Utils.getVar;
window.initGetVars=$.Utils.initGetVars;
})(jQuery);
var $_GET=[];
window.initGetVars(window.location.search.toString(),$_GET);
(function($){
$.provide("$.Renderers");
var Paginator=$.Renderers.PaginatorRenderer=function(options){
this.options={
pageCount:1,
currentPage:1,
navbarAlign:"center",
maxElements:12,
target:0,
linkClasses:null
};
if(options)this.options=$.extend(this.options,options);
this.htmlCode="";
}
Paginator.fn=Paginator.prototype={
getHtml:function(){
var	opts=this.options,
link='';
this.htmlCode='';
if(opts.pageCount>1){
this.htmlCode+='<nav class="paginator-init" data="{maxElements:{0}, horizontalAlign:\'{1}\'}"><ul>'.format(opts.maxElements,opts.navbarAlign);
for(var i=1;i<=opts.pageCount;++i){
link=(opts.target==='javascript:void(0)'?opts.target:'{0}={1}'.format(opts.target,i));
this.htmlCode+='<li{0}><a href="{1}" data-page="{3}"{2}>{3}</a></li>'.format((opts.currentPage==i)?' class="selected"':'',
link,_.setAttr('class',opts.linkClasses),i);
}
this.htmlCode+='</ul></nav>';
}
return this.htmlCode;
}
};
var BasketPanel=$.Renderers.BasketPanelRenderer=function(options){
this.options={
da:null,
caption:'',
showCaption:true,
showQtyField:true,
showAddToBag:true,
showDetail:true,
showQtyUnit:true,
displaySmallInfoButton:true,
displaySmallAddButton:true,
isSmallAddCaption:true,
onClickHandler:true,
detailsLink:''
};
if(options)this.options=$.extend(this.options,options);
this.htmlCode="";
}
BasketPanel.fn=BasketPanel.prototype={
getHtml:function(){
var	opts=this.options,
da=opts.da;
var pkid=parseInt(da.val("PKID")),
QtyStep=parseInt(da.val("OrderQtyStep")),
QtyMin=parseInt(da.val("MinOrderQty")),
QtyMax=parseInt(da.val("MaxOrderQty")),
QtyType=parseInt(da.val("OQType")),
QtyDef=parseInt(da.val("OQDefValue")),
OptCount=parseInt(da.val("OQDDOptionsCount")),
QtyUnit=da.val("QtyUnit"),
showPanel=(parseInt(da.val("PricingConfiguration"))==0),
sButtonAlt=getLocalValue('btn.add-to-bag'),
sDetailCaption=getLocalValue('btn.details'),
sArrayIndex="",
onClick='';
if(showPanel&&opts.showAddToBag){
if(opts.showQtyField&&opts.showCaption){
this.htmlCode+='<div class="pnl-addtobasket-caption">{0}</div>'.format(opts.caption);
}
this.htmlCode+='<div class="pnl-addtobasket" class="noprint">';
QtyDef=QtyDef>QtyMin?QtyDef:QtyMin;
if(opts.showQtyField){
this.htmlCode+='<div class="pnl-quantity ui-corner-all">';
switch(QtyType){
case 0:
this.htmlCode+='<input class="pnl-addtobasket-qty prompt" id="PD{0}Amount" type="text" size="1" value="{1}" onchange="this.value=fnSMNum(this.value)">'.format(pkid,QtyDef);
break;
case 1:
this.htmlCode+='<input class="pnl-addtobasket-qty" type="number" min="{0}"{1} step="{2}" id="PD{3}Amount" size="5" value="{4}" onchange="this.value=fnSMNum(this.value)">'.format(
Math.max(QtyMin,QtyDef)||1,
(QtyMax>0&&QtyMax>=QtyMin)?' max="'+QtyMax+'"':'',
QtyStep||1,
pkid,
QtyDef);
break;
case 2:
this.htmlCode+='<select class="pnl-addtobasket-qty" id="PD'+pkid+'Amount">';
for(var i=QtyStep;i<=parseInt(OptCount*QtyStep);i+=QtyStep){
this.htmlCode+='<option value="'+i+'"';
if(i==QtyDef)this.htmlCode+=' selected';
this.htmlCode+='>'+i;
};
this.htmlCode+='</select>';
break;
};
if(opts.showQtyUnit)
this.htmlCode+='<span class="pnl-addtobasket-qtyunit">&nbsp;{0}&nbsp;</span>'.format(QtyUnit);
this.htmlCode+='</div>';
};
this.htmlCode+='<span style="vertical-align:middle">';
if(!opts.showQtyField)
this.htmlCode+='<input id="PD{0}amount" type="hidden" value="{1}">'.format(pkid,QtyDef);
if(opts.onClickHandler){
onClick=' onclick="SMShop.basket.add(SMProductList[{0}])"'.format(pkid);
}
this.htmlCode+='<a class="btn special addtobasket" href="javascript:void(0);" alt="'+sButtonAlt+'" title="'+sButtonAlt
+'" data="{text:'+String(!opts.displaySmallAddButton).toLowerCase()+', icons:{primary:\'ui-icon-cart\'}}"'+onClick+' data-id="'
+pkid+'">'+(opts.isSmallAddCaption?getLocalValue('btn.add-to-bag-short'):getLocalValue('btn.add-to-bag'))+'</a>';
this.htmlCode+='</span>';
if(opts.showDetail){
this.htmlCode+='<span style="padding-left:4px"><a class="btn" id="btn-product-details" data="{text:{0}, icons:{secondary:\'ui-icon-info\'}}" href="{1}" title="{2}">{2}</a></span>'.format(String(!opts.displaySmallInfoButton).toLowerCase(),opts.detailsLink==''?'product:'+pkid:opts.detailsLink,sDetailCaption);
};
this.htmlCode+='</div>';
}else{
if(opts.showDetail){
this.htmlCode+='<div class="noprint"><a class="btn" id="btn-product-details" data="{text:{0}, icons:{secondary:\'ui-icon-info\'}}" href="{1}" title="{2}">{2}</a></div>'.format(String(!opts.displaySmallInfoButton).toLowerCase(),opts.detailsLink==''?'product:'+pkid:opts.detailsLink,sDetailCaption);
};
};
return this.htmlCode;
}
};
})(_inBrowser?jQuery:global['System']);
(function($){
$.provide("$.Renderers");
var List=$.Renderers.ListRenderer=function(options){
this.options={
itemsInRow:3,
itemsInPage:9,
sortBy:"manufacturer",
alternateItems:false,
showRowSeparator:true,
showItemBorders:true,
animateItemOnHover:true,
headerText:"",
footerText:"",
navBarHtml:"",
navBarPos:"bottom",
navBarAlign:"right",
groupBy:"",
contextType:"xml"
};
if(options)this.options=$.extend(this.options,options);
this.settings={
plRow:{css:"",className:"pl-row clearfix"},
plCellParent:{css:"",className:"pl-cell-parent"},
plCell:{css:"",className:"pl-cell content-fill"},
plElement:{css:"",className:"pl-element"}
};
this.pageCount=1;
this.htmlCode="";
}
List.fn=List.prototype={
getHtml:function(dataAdapter,itemCallback,currentPage){
var	opts=this.options,
settings=this.settings,
row=[],
item={},
itemCount=0,
itemsInRowCount=0,
isLastRow=false,
isEndOfRow=false;
if(opts.itemsInPage!=-1){
var da=dataAdapter;
this.pageCount=da.pageCount();
if(da.hasData()){
da.pageSize(opts.itemsInPage);
da.absolutePage(currentPage);
}
if(opts.itemsInRow>1){
settings.plCell.css="float: left;width: {0}%;".format((100/opts.itemsInRow).toFixed(3));
}
if(opts.showItemBorders){
settings.plElement.className+=" border";
if(opts.animateItemOnHover)
settings.plElement.className+=" animate";
}
this.renderNavBar("top");
this.renderHeaderText();
var currentPageSize=this.calculateCurrentPageSize(da.length(),da.pageCount(),da.pageSize(),da.absolutePage());
for(var i=0,length=da.pageSize();i<length;i++){
if(!da.eof()||(opts.itemsInRow==0&&!da.eof()&&da.pos()<50)){
this.tempCellClasses=settings.plCell.className;
this.tempElementClasses=settings.plElement.className;
if(itemsInRowCount==0){
this.htmlCode+='<div class="pl-row clearfix">';
this.tempCellClasses+=" alpha";
}
else if(itemsInRowCount+1==opts.itemsInRow){
this.tempCellClasses+=" omega";
}
this.tempElementClasses+=(opts.alternateItems&&(i%2!=0)?" alt":"");
this.renderCell(da,itemCallback);
isEndOfRow=((itemsInRowCount+1)==opts.itemsInRow||(i+1)==currentPageSize||opts.itemsInRow==0&&(da.pos()+1)==da.length());
if(isEndOfRow){
this.htmlCode+='</div>';
this.renderRowSeparator(opts.showRowSeparator,i+1==da.pageSize());
itemsInRowCount=-1;
}
itemsInRowCount++;
da.moveNext();
}
}
if(opts.itemsInRow==0){
var controls="";
controls+='<a class="sb invisible pl-scroll-prev" data="{direction:\'left\', enabled: false}" href="#">Zurück</a>';
controls+='<a class="sb invisible pl-scroll-next" data="{direction:\'right\'}" href="#">Weiter</a>';
this.htmlCode+=controls;
}
this.renderFooterText();
this.renderNavBar("bottom");
}
return this.htmlCode;
},
renderCell:function(da,itemCallback){
var htmlCode='<div class="{0}" style="{1}" data-pkid="{2}">'.format(this.tempCellClasses,this.settings.plCell.css,da.val("PKID"));
htmlCode+='<article class="{0}">'.format(this.tempElementClasses);
htmlCode+=itemCallback.call(this,da);
htmlCode+='</article>';
htmlCode+='</div>';
this.htmlCode+=htmlCode;
},
renderRowSeparator:function(show,isLastRow){
if(show&&!isLastRow)
this.htmlCode+="<hr />";
},
renderHeaderText:function(){
if(!_.isBlank(this.options.headerText))
this.htmlCode+='<div class="list-header x-ui-widget-content ui-corner-all ac bold">{0}</div>'.format(this.options.headerText);
},
renderFooterText:function(){
if(!_.isBlank(this.options.footerText))
this.htmlCode+='<div class="list-footer x-ui-widget-content ui-corner-all ac">{0}</div>'.format(this.options.footerText);
},
renderNavBar:function(position){
var opts=this.options;
if(this.pageCount>1&&
(position==='top'&&(opts.navBarPos==='top'||opts.navBarPos==='both'))||
(position==='bottom'&&(opts.navBarPos==='bottom'||opts.navBarPos==='both'))){
this.htmlCode+='<div align="{0}" id="paginator-{1}">{2}</div>'.format(opts.navBarAlign,position,opts.navBarHtml);
}
},
calculateCurrentPageSize:function(recordCount,pageCount,pageSize,absolutePage){
if(pageCount==absolutePage&&(recordCount%pageSize!=0)){
return recordCount%pageSize;
}
else{
return pageSize;
}
}
};
})(_inBrowser?jQuery:global['System']);
(function($){
$.provide("$.DataAdapters");
var da=$.DataAdapters.JsonAdapter=function(arr,pageSize){
this.type=function(){return "json"};
this.storage=arr;
this._curSlice=arr;
this._idx=0;
this._pageSize=pageSize||0;
this._pageCount=1;
this._absolutePage=1;
this._refreshSlice=function(){
var isPageable=(this._pageSize>0&&_.isArray(this.storage)&&this.storage.length>0);
if(isPageable){
this._pageCount=Math.ceil(this.storage.length/this._pageSize);
var startPos=(this._absolutePage-1)*this._pageSize;
var endPos=startPos+this._pageSize;
this._curSlice=this.storage.slice(startPos,endPos);
}
else{
this._curSlice=arr;
this._pageCount=1;
this._absolutePage=1;
}
};
this._refreshSlice();
}
da.fn=da.prototype={
hasData:function(){
return(_.isArray(this.storage)&&this.storage.length>0);
},
dispose:function(){
},
length:function(){
return this.storage.length;
},
pos:function(idx){
if(!_.isNumber(idx)){
return this._idx;
}
this._idx=idx;
},
bof:function(){return this._idx<0;},
eof:function(){return this._idx>=this._curSlice.length;},
moveFirst:function(){this._idx=0;},
moveNext:function(){this._idx++;},
moveLast:function(){this._idx=this._curSlice.length-1;},
movePrev:function(){this._idx--;},
pageCount:function(){
return this._pageCount;
},
pageSize:function(size){
if(!_.isNumber(size)){
return this._pageSize;
}
if(size!==this._pageSize){
this._pageSize=size;
this._absolutePage=1;
this._refreshSlice();
}
},
absolutePage:function(idx){
if(!_.isNumber(idx)){
return this._absolutePage;
}
var isValidIndex=(idx>=1&&idx<=this._pageCount&&idx!==this._absolutePage);
if(isValidIndex){
this._absolutePage=idx;
this._refreshSlice();
}
},
val:function(idx){
return this._curSlice[this._idx][idx];
}
}
})(_inBrowser?jQuery:global['System']);
function ScriptInclude(){
this.src="";
this.args=new Array();
this.set=ScriptInclude_Set;
};
function ScriptInclude_Set(){
var tmpHTML="";
var tmpArgs="";
tmpHTML="<script type='text\/javascript'"
+" src='"+this.src+"?";
for(var i=0;i<this.args.length;i++){
tmpArgs+=this.args[i].replace("/","\/")+"&";
};
tmpHTML+=tmpArgs;
tmpHTML+="'><\/script>";
document.write(tmpHTML);
};
function createInputElement(name,value){
var InputElementItemNumber;
InputElementItemNumber=document.createElement('input');
InputElementItemNumber.name=name;
InputElementItemNumber.setAttribute("value",value);
InputElementItemNumber.type="hidden";
return InputElementItemNumber;
};
;(function($){
$.fn.adjustContainerHeight=function(height){
if(height==-1)return;
if(height==0){
height=this.max(function(){return $(this).outerHeight(true);});
}
this.each(function(index){
var $this=$(this),
verticalCushioning=$this.verticalCushioning(),
targetHeight=height-verticalCushioning,
header=$this.children(".header"),
body=$this.children(".body"),
footer=$this.children(".footer");
if(body.length==0)return;
if(header.length!=0)targetHeight-=header.outerHeight(true);
if(footer.length!=0)targetHeight-=footer.outerHeight(true);
targetHeight-=body.verticalCushioning();
body.height(targetHeight);
});
}
})(jQuery);
;(function($){
$(function(){
var html=$("html");
$(window).load(function(){
html.removeClass("loading").addClass("loaded");
var doEllipsis=function(){
$('.ellipsis').ellipsis();
};
_.defer(doEllipsis,100);
if($.Grid.stretchLevel>1){
var lazyEllipsis=_.debounce(doEllipsis,300);
$(window).bind('resize',lazyEllipsis);
}
$('#old-browser-hint').html('Ihr Browser ist nicht aktuell! Für eine optimale Darstellung dieses Shops führen Sie bitte ein Update durch.');
});
html.removeClass("not-ready").addClass("ready");
if(html.hasClass("ie7")){
$.fixIE7ZIndexBug();
}
$.metadata.setType("attr","data");
$.extend($.ui.dialog.prototype.options,{
closeText:T['lbl.close'],
show:'scale',
zIndex:999999
});
});
})(jQuery);
