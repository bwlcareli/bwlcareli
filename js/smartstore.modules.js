
(function($,undefined){
$.fn.extend({
megaMenu:function(options){
var defaults={
event:'hover',
shrinkOnly:false,
usePageWidth:false,
colWidth:'18em',
direction:'horizontal',
cornerTolerance:4,
navSelector:".mm-nav",
menuItemHoverClass:"box-hover",
popup:{
groupId:"megamenu",
createWrapper:false,
wrapperClass:"dropdown",
sourceHoverClass:"hover",
sourceActiveClass:"mm-opener dropdown-tab",
transitionThreshold:0
}
}
var opts=$.extend(true,defaults,options);
return this.each(function(){
var nav=$(opts.navSelector);
var hasTransition=nav.hasClass("transition");
var holder=$(this);
var openerCornerClass=(opts.direction==="horizontal")?"ui-corner-top":"ui-corner-left";
var menusHandler=function(){
holder.find(".mm").each(function(){
menuHandler($(this));
});
}
var menuHandler=function(menu){
menu.addClass("dropdown");
if(opts.menuItemHoverClass){
menu.on("mouseenter",".mm-col li",function(){$(this).addClass(opts.menuItemHoverClass+" ui-corner-all")})
.on("mouseleave",".mm-col li",function(){$(this).removeClass(opts.menuItemHoverClass+" ui-corner-all")});
}
menu.find(".mm-col").each(function(i,val){
var col=$(this);
col.width(opts.colWidth);
if(col.prev().length===0)col.addClass('alpha');
if(col.next().length===0)col.addClass('omega');
});
}
var chevronHandler=function(){
nav.find(".has-children > a").each(function(){
$(this).append('<em class="mm-chevron"></em>');
});
}
var shrinkHandler=function(){
if(opts.shrink&&opts.shrink.enabled){
opts.shrink.onShrink=function(btn,menu){
popupHandler(menu,btn);
};
opts.shrink.onChange=function(menu){
menuHandler(menu);
}
nav.shrinkMenu(opts.shrink);
}
}
var popupHandler=function(){
var target=arguments[0];
var selector=arguments[1]||nav.children();
var popupOptions={
target:target||function(src){
var id="#mm-"+src.find("a:first").data("for");
var menu=holder.find(id);
if(menu.length>0){
return menu;
}
},
show:{
before:function(src,menu){
src
.addClass(openerCornerClass+" "+opts.direction)
.css("z-index",parseInt(menu.css("z-index"))+2);
}
},
hide:{
after:function(src,menu){
if(hasTransition)nav.addClass("transition");
src
.removeClass(openerCornerClass+" "+opts.direction)
.css("z-index","1001");
}
},
onPosition:function(src,menu,pos){
var isVert=(opts.direction=="vertical");
var navWidth=parseFloat(nav.outerWidth());
var inPos=menu.data("position");
function adjustOffset(x,y){
arr=_.map(inPos.offset.split(" "),function(val){return parseFloat(val)});
if(arr.length==1)arr.push(arr[0]);
if(_.isNumber(x))arr[0]=x;
if(_.isNumber(y))arr[1]=y;
inPos.offset=arr.join(" ");
}
if(!inPos){
inPos={
my:"left top",
at:isVert?"right top":"left bottom",
collision:isVert?"none fit":"none",
offset:"0 0"
}
menu.addClass("ui-corner-"+(isVert?"right":"bottom"));
var offsets=[0,0];
if(isVert){
offsets[0]=-1*(parseFloat(src.css('border-right-width'))+parseFloat(menu.css('border-left-width')));
}
else{
offsets[1]=-1*(parseFloat(src.css('border-bottom-width'))+parseFloat(menu.css('border-top-width')));
}
inPos.offset=offsets.join(" ");
$.extend(pos,inPos);
menu.data("position",pos);
}
var ox=0;
if(isVert){
menu.removeClass("ui-corner-bl ui-corner-tl");
}
else{
menu.removeClass("ui-corner-tr ui-corner-tl");
if(opts.usePageWidth){
menu.width(navWidth-menu.horizontalCushioning());
ox=src.position().left;
adjustOffset(ox*-1,null);
menu.addClass("ui-corner-tr");
if(ox>opts.cornerTolerance)menu.addClass("ui-corner-tl");
}
else{
var menuWidth=parseFloat(menu.outerWidth());
var ox=navWidth-(parseFloat(src.position().left));
var direction="left";
if(menuWidth>=ox){
ox=menuWidth-ox;
adjustOffset(ox*-1,null);
if(ox>opts.cornerTolerance){
menu.addClass("ui-corner-tl");
}
}
else{
ox=0;
}
inPos.my=direction+' top';
inPos.at=direction+' bottom';
if(menuWidth>(src.outerWidth()+opts.cornerTolerance)){
menu.addClass("ui-corner-tr");
}
}
}
$.extend(pos,inPos);
}
};
selector.smartPopup($.extend(true,opts.popup,popupOptions));
}
var fn;
if(opts.shrinkOnly){
fn=_.compose(popupHandler,menusHandler,shrinkHandler);
}
else{
fn=_.compose(popupHandler,menusHandler,shrinkHandler,chevronHandler);
}
$(window).load(fn);
});
}
});
})(jQuery);
SMShop.basket.base.addMember("SMProductListListener");
function SMProductListListener_onBeforeAdd(args){
var smproduct=args[1];
var minamount=parseInt(smproduct.getAttribute(_SMAMinAmount));
var maxamount=parseInt(smproduct.getAttribute(_SMAMaxAmount));
var amount=parseFloat(smproduct.getAttribute(_SMAAmount));
var qtyamount=document.getElementById("PD"+smproduct.getAttribute(_SMAUniqueID)+"Amount");
if(qtyamount!=null){
if(minamount.toString().length>0&&maxamount.toString().length>0){
if(!(parseInt(qtyamount.value)>=minamount)){
jQuery.alert(T['msg.min-order-qty']);
qtyamount.value=minamount;
return(false);
}else if(maxamount>0&&!(parseInt(qtyamount.value)<=maxamount)){
jQuery.alert(T['msg.max-order-qty']);
qtyamount.value=maxamount;
return(false);
}else{
smproduct.setAttribute(_SMAAmount,qtyamount.value);
smproduct.update();
return(true);
};
}else{
jQuery.alert(T['msg.min-order-qty']);
qtyamount.value=minamount;
return(false);
};
};
};
(function($){
$.fn.extend({
productListOptimizer:function(settings){
var defaults={
alignElemsToGrid:true,
alignElemsPerRow:false,
multiColumn:false,
imageAlign:'near',
isInititialised:false,
gridStyle:'fluid',
isScrollable:false,
clientSide:false,
forceGrid:false
};
var settings=$.extend(defaults,settings);
var maxHeights={
maxHeightCell:0,
maxHeightTitle:0,
maxHeightDesc:0,
maxHeightInfos:0,
maxHeightParts:0,
maxHeightPrice:0,
maxHeightImg:0,
maxWidthPrice:0
}
function getHeights(elem){
var sheet=elem.find(".pl-infosheet");
maxHeights.maxHeightTitle=Math.max(maxHeights.maxHeightTitle,elem.find(".pl-name").height());
maxHeights.maxHeightDesc=Math.max(maxHeights.maxHeightDesc,sheet.children(".pl-desc").height());
maxHeights.maxHeightInfos=Math.max(maxHeights.maxHeightInfos,sheet.children(".pl-datasheet").height());
maxHeights.maxHeightParts=Math.max(maxHeights.maxHeightParts,sheet.children(".pl-partslist").height());
maxHeights.maxHeightPrice=Math.max(maxHeights.maxHeightPrice,sheet.children(".pl-sales").height());
maxHeights.maxHeightImg=Math.max(maxHeights.maxHeightImg,elem.find(".pl-frame-parent img").height());
maxHeights.maxWidthPrice=Math.max(maxHeights.maxWidthPrice,sheet.children(".pl-sales").children(".pl-controls").width());
}
function setHeights(elems){
elems.find(".pl-name").height(maxHeights.maxHeightTitle);
if(settings.alignElemsPerRow){
elems.find(".pl-frame-parent").height(maxHeights.maxHeightImg);
}
if(settings.alignElemsToGrid){
elems.find(".pl-desc").height(maxHeights.maxHeightDesc);
elems.find(".pl-datasheet").height(maxHeights.maxHeightInfos);
elems.find(".pl-partslist").height(maxHeights.maxHeightParts);
}
if(!settings.multiColumn&&!settings.isScrollable){
elems.find(".pl-sales").height(maxHeights.maxHeightPrice);
elems.find(".pl-sales").width(maxHeights.maxWidthPrice);
}
}
function resetInternalHeights(){
maxHeights.maxHeightCell=0;
maxHeights.maxHeightTitle=0;
maxHeights.maxHeightDesc=0;
maxHeights.maxHeightInfos=0;
maxHeights.maxHeightParts=0;
maxHeights.maxHeightPrice=0;
maxHeights.maxHeightImg=0;
}
function resetElementHeights(elems){
elems.css('height','auto');
elems.children('.pl-name').css('height','auto');
elems.children('.pl-infosheet').children().css('height','auto');
elems.find('.pl-controls, .pl-sales').removeClass('bottom');
}
function alignImage(elem){
var frameParent=elem.find('.pl-frame-parent');
var img=frameParent.find('img');
if(!settings.multiColumn&&!settings.isScrollable){
frameParent.css('height','100%');
if(settings.imageAlign=="far"){
img.css('bottom',($.Grid.marginLeft+$.Grid.marginRight)+'px');
}
else if(settings.imageAlign=="center"){
_.defer(function(){
img.css('top',(frameParent.height()/2 - img.height()/2)+"px");
});
}
}
else{
img.css('margin-top',(frameParent.height()/2 - img.height()/2)+'px');
}
}
function adjustElements(elems){
if(settings.isInititialised&&!settings.isScrollable)
resetElementHeights(elems);
elems.each(function(){
currentCell=$(this);
getHeights(currentCell);
});
setHeights(elems);
elems.each(function(){
currentCell=$(this);
alignImage(currentCell);
if(maxHeights.maxHeightCell<currentCell.height())
maxHeights.maxHeightCell=currentCell.height();
});
elems.height(maxHeights.maxHeightCell);
if(settings.multiColumn||settings.isScrollable){
elems.find(".pl-sales").addClass("bottom");
}else{
elems.find(".pl-controls").addClass("bottom");
}
}
function resizeElements(list){
if(settings.isScrollable){
var visibleElemnts=list.outerWidth()/list.find(".pl-cell:first").outerWidth();
visibleElemnts++;
list.data('last-opt',parseInt(visibleElemnts));
elems=list.find(".pl-element:lt("+parseInt(visibleElemnts)+")");
adjustElements(elems);
resetInternalHeights();
}
else if(settings.alignElemsPerRow){
list.find(".pl-row").each(function(index,value){
elems=$(this).find(".pl-element");
adjustElements(elems);
resetInternalHeights();
});
}
else{
elems=list.find(".pl-element");
adjustElements(elems);
resetInternalHeights();
}
settings.isInititialised=true;
};
function addScrollButtons(list){
list.find(".sb").scrollButton({
nearSize:96,
farSize:28,
target:list,
showButtonAlways:true,
autoPosition:true,
position:"inside",
offset:0,
handleCorners:true,
smallIcons:false,
hostFix:true,
click:function(dir){
var el=$(this);
var btn=el.data("ScrollButton");
}
});
};
$.fn.productListOptimizer.adjustElementRange=function(list,step){
settings.isScrollable=true;
var first=parseInt(list.data('last-opt'));
var elems=list.find(".pl-element");
if(elems.length==first){
list.data('last-opt',0);
}
else{
list.data('last-opt',first+1);
}
elems=elems.slice(first-1,first+step);
adjustElements(elems);
resetInternalHeights();
}
return this.each(function(){
var list=$(this),
elems,currentCell,
plRows=list.find(".pl-row"),
multiPanel=list.closest('.ui-tabs');
settings.multiColumn=list.hasClass('grid')||list.hasClass('scroll')||settings.forceGrid;
if(multiPanel.length>0){
var optimize=function(){
resizeElements(list);
addScrollButtons(list);
};
$.preload(list.find("img"),optimize);
$(document).bind('smpanelshow',function(evt,id,ui){
var hostingID=list.closest('.ui-tabs-panel').attr('id');
if(list.attr('data-adjusted')!=='1'&&(hostingID==id)){
list.attr('data-adjusted','1');
resizeElements(list);
}
addScrollButtons(list);
});
}else{
var optimize=function(){
resizeElements(list);
};
if(!settings.clientSide){
$.preload(list.find("img"),optimize);
}
else{
optimize();
}
if((settings.gridStyle=='fluid')&&!settings.isScrollable){
var lazyOptimize=_.debounce(optimize,300);
$(window).resize(lazyOptimize);
}
}
});
}
});
})(jQuery);
(function($){
$.fn.extend({
productListScroller:function(settings){
var defaults={
preloadElements:0
};
var settings=$.extend(defaults,settings);
return this.each(function(){
var list=$(this);
list.evenIfHidden(function(el){
var visibleElemnts=parseInt(list.outerWidth()/list.find(".pl-cell:first").outerWidth());
visibleElemnts=(visibleElemnts==0)?1:visibleElemnts;
list.find('.pl-row').wrap('<div class="pl-slider" />');
list.serialScroll({
target:'.pl-slider',
items:'.pl-cell',
prev:'.pl-scroll-prev',
next:'.pl-scroll-next',
axis:'x',
duration:200,
easing:'easeInOutQuad',
force:true,
cycle:false,
exclude:visibleElemnts-1,
onBefore:function(e,elem,$pane,$items,pos){
var plList=$pane.parent(),
lastOptimized=plList.data('last-opt'),
isFirst=(pos==0),
isLast=((pos+visibleElemnts)==$items.length);
if(isFirst)
plList.find('.pl-scroll-prev').data("ScrollButton").enable(false);
else
plList.find('.pl-scroll-prev').data("ScrollButton").enable(true);
if(isLast)
plList.find('.pl-scroll-next').data("ScrollButton").enable(false);
else
plList.find('.pl-scroll-next').data("ScrollButton").enable(true);
if(lastOptimized!=0){
plList.productListOptimizer.adjustElementRange(plList,1);
}
}
});
$.preload(list.find("img"),function(){
var itemsWidth=list.find('.pl-cell:first').outerWidth(true)*list.find('.pl-cell').length;
if(itemsWidth>list.width()){
list.find(".sb").scrollButton({
nearSize:96,
farSize:28,
target:list,
showButtonAlways:true,
autoPosition:true,
position:"inside",
offset:0,
handleCorners:true,
smallIcons:false,
hostFix:true,
click:function(dir){
var el=$(this);
var btn=el.data("ScrollButton");
}
}).addClass('ui-corner-all');
}
});
});
});
}
});
})(jQuery);
cSMDiscounts.prototype.renderHTML=function(){
var $t=this,$x=$t.xml,$go=false,$h=$n="",$vl=$md=$o=$op=0,$a=$v=$vd=$id=$tB=$hd=null;
$op=$t.parent.getOriginalPrice();
$md=$x.getAttribute(_SMAMode).split(";");
$vl=$x.getAttribute(_SMAValue).split(";");
$a=$x.getAttribute(_SMAAmount).split(";");
$vd=$x.getAttribute(_SMAValueDiscount).split(";");
$id=$x.getAttribute(_SMAItemDiscount).split(";");
$tB=$x.getAttribute(_SMATextBuffer).split(";");
$hd=$x.getAttribute(_SMAHidden).split(";");
$qu=$x.parentNode.getAttribute(_SMAOQtyUnit);
$qt=$x.getAttribute(_SMAMode).split(";");
$h+='<div class="discounts-headline larger">Rabatte</div>';
$h+='<table border="0" cellpadding="0" cellspacing="0" class="discounts-list">';
$h+='<thead><tr>';
$h+='<th class="discounts-name ac">&nbsp;</th>';
$h+='<th class="discounts-from-amount ac">Ab {0}</th>'.format($qu);
$h+='<th class="discounts-value bold ac">Preis:{0}</th>'.format($qu);
$h+='<th class="discounts-saving ac">Ersparnis</th>';
$h+='</tr></thead><tbody>';
for(var i=0;i<$a.length;i++){
if($hd[i]!="1"){
$go=true;
$n=$x.text.substring($o,$o+parseInt($tB[i]));
$o+=parseInt($tB[i]);
$h+='<tr valign="top">';
$h+='<td class="discounts-name al">{0}&nbsp;</td>'.format($n);
$h+='<td class="discounts-from-amount ar">{0}</td>'.format($a[i]);
if(toInt($qt[i])!=2){
$h+='<td class="discounts-value bold ar">{0}</td>'.format(cprimary.format(fnSMPFt($vd[i]),SM_CGROUP+SM_CSYMBOL));
}else{
$h+='<td class="discounts-value bold ar">+'+$id[i]+' '+$qu+' kostenlos</td>';
};
$h+='<td class="discounts-value ar">';
if(toInt($qt[i])!=2){
$h+=(($md[i]==1)?$vl[i]+"% = ":"")+cprimary.format($op-fnSMPFt($vd[i]),SM_CGROUP+SM_CSYMBOL);
}else{
$h+=cprimary.format($id[i]*$op,SM_CGROUP+SM_CSYMBOL);
};
$h+='</td>';
$h+='</tr>';
};
};
$h+='</tbody></table>';
if(!$go)$h="";
return($h);
};
;(function($,window,document,undefined){
var pluginName='productDetail';
var galPluginName="plugin_smartGallery";
function ProductDetail(element,options){
var self=this;
this.element=element;
var el=this.el=$(element);
var meta=$.metadata?$.metadata.get(element):{};
var opts=this.options=$.extend(true,{},options,meta||{});
this.init=function(){
var opts=this.options,
leftPanel=$('#pd-left'),
rightPanel=$('#pd-right');
$('.pnl-quantity').smartform({handleBox:false,handleLabel:false});
$('#pd-add-to-cart-panel').addClass('ui-corner-all ui-widget-content content-shadow');
this.createBigGallery(false,$('#pd-gallery-small'));
this.createSmallGallery();
$.preload('#sm-product-detail img',function(){
$(function(){
var iHeightLeft=parseInt(leftPanel.height());
var iHeightRight=parseInt($('#sm-product-detail').height());
if(iHeightLeft<iHeightRight){
rightPanel.css('min-height',iHeightLeft);
}
leftPanel.height(iHeightRight);
});
});
if(opts.positionSmallGallery=='right'){
leftPanel.css({'float':'right','border-right':'none','width':opts.smallGalleryWidth+5});
rightPanel.css({'margin-right':(opts.smallGalleryWidth+5)+'px','margin-left':'0'});
}
else{
leftPanel.css({'width':opts.smallGalleryWidth});
rightPanel.css({'margin-left':(opts.smallGalleryWidth+5)+'px',});
}
if(leftPanel.children().length==0&&leftPanel.text()==""){
leftPanel.css({'width':"0"});
rightPanel.css("margin","0");
}
$('#pd-manufacturer img').css({'max-width':opts.smallGalleryWidth});
$('.pnl-addtobasket-qty').smartform({handleBox:false,handleLabel:false});
$('#pd-add-to-cart-panel form').smartform();
return this;
};
this.isSameDetailImg=function(newDetailSrc){
if(bigGallery.is(":hidden")){
var oldSrc=$('#pd-gallery-small .sg-image img').attr('src');
}else{
var oldSrc=$('#pd-gallery-big .sg-image img').attr('src');
}
return unescape(oldSrc)==unescape(newDetailSrc);
};
this.replaceDetailImage=function(galleryID,src){
var gallery=$('#'+galleryID);
var galleryHtml=$(gallery.data(galPluginName).origHtml);
galleryHtml.find('.sg-image a').attr('href',src);
galleryHtml.find('.sg-image img').attr('src',src);
var firstElem=galleryHtml.find('.sg-thumb-list li:first a');
firstElem.attr('href',src);
firstElem.find('.thumb').attr('src',src);
gallery.replaceWith(galleryHtml);
galleryHtml.addClass("o0");
};
this.refreshGalleries=function(newDetailSrc){
var self=this;
var smallGallery=$('#pd-gallery-small');
var bigGallery=$('#pd-gallery-big');
function showVariantPic(){
self.replaceDetailImage('pd-gallery-small',newDetailSrc);
$('#pd-gallery-big').remove();
var fn=function(){
self.createSmallGallery();
self.createBigGallery(false,$('#pd-gallery-small'));
$('#pd-gallery-small, #pd-gallery-big').removeClass("o0");
}
_.delay(fn,300);
}
if(!bigGallery.is(":hidden")){
bigGallery.data(galPluginName).options.callbacks.toolClick('shrink');
bigGallery.data(galPluginName).hideImagePanels(0);
bigGallery.slideUp('slow',function(){
showVariantPic();
smallGallery.slideDown('slow');
});
}else{
showVariantPic();
}
};
this.initialized=false;
this.init();
this.initialized=true;
}
ProductDetail.prototype={
smallGallery:null,
bigGallery:null,
activePictureIndex:0,
createSmallGallery:function(){
var self=this;
var opts=this.options;
var enlargeGallery=function(){
var smallPlugin=smallGallery.data(galPluginName);
var bigPlugin=bigGallery.data(galPluginName);
smallPlugin.hideImagePanels(100);
smallGallery.slideUp('slow',function(){
bigGallery.slideDown('slow');
});
if(smallPlugin.currentIndex>0){
bigPlugin.showImage(smallPlugin.currentIndex);
}
};
smallGallery=$('#pd-gallery-small').smartGallery({
width:opts.smallGalleryWidth,
height:opts.smallGalleryHeight,
enableDescription:opts.showImageDescription,
zoom:{
enabled:opts.showZoom,
zoomType:opts.zoomType,
showEffect:opts.showFade?'fadein':'show',
hideEffect:opts.showFade?'fadeout':'hide',
fadeinSpeed:opts.fadeSpeed,
fadeoutSpeed:opts.fadeSpeed
},
box:{
enabled:false
},
callbacks:{
imageClick:function(){
enlargeGallery();
return false;
},
toolClick:function(id){
if(id=="enlarge"){
enlargeGallery();
}
}
}
});
},
createBigGallery:function(isVisible,smallGallery){
var opts=this.options;
var self=this;
var galleryClone=$('#pd-gallery-small')
.clone()
.addClass('hidden-accessible')
.attr('id','pd-gallery-big');
$('#sm-product-detail').before(galleryClone);
bigGallery=$('#pd-gallery-big').smartGallery({
width:Math.min($('#sm-product-detail').width()-10,590),
height:400,
extraTools:['shrink'],
enableDescription:opts.showImageDescription,
zoom:{
enabled:false
},
callbacks:{
toolClick:function(id){
if(id=="shrink"){
var smallPlugin=smallGallery.data(galPluginName);
var bigPlugin=bigGallery.data(galPluginName);
bigPlugin.hideImagePanels(100);
bigGallery.slideUp('slow',function(){
smallGallery.slideDown('slow');
});
if(bigPlugin.currentIndex>0){
smallPlugin.showImage(bigPlugin.currentIndex);
}
}
}
}
});
var waitForThumbDimensions=setInterval(function(){
if(!isVisible){
$('#pd-gallery-big').css({'display':'none'}).removeClass('hidden-accessible');
}
else{
$('#pd-gallery-big').css({'display':'block'}).removeClass('hidden-accessible');
}
clearInterval(waitForThumbDimensions);
},600);
}
}
$.provide('$.'+pluginName);
$[pluginName].defaults={}
$.fn[pluginName]=function(options){
return this.each(function(){
if(!$.data(this,'plugin_'+pluginName)){
options=$.extend(true,{},$[pluginName].defaults,options);
$.data(this,'plugin_'+pluginName,new ProductDetail(this,options));
}
});
}
})(jQuery,window,document);
(function($){
var methods={
init:function(){
var line,amount,value;
$ctx=$(this);
$ctx.find('tr:last td').css('border-bottom','none');
$ctx.find('.g-discount-line').each(function(){
line=$(this);
amount=line.find('.g-discount-amount');
value=line.find('.g-discount-type');
amount.html(cprimary.format(amount.data('amount'),SM_CSYMBOL+SM_CGROUP));
if(value.data('type')==1){
value.html(value.data('value'));
}
else if(value.data('type')==2){
value.html(
'{0} x {1} {2}'.format(value.data('value'),SMGDPL['$GDP-'+value.data('pkid')].name,T['lbl.free-of-charge'])
);
}
else{
value.html(cprimary.format(value.data('value'),SM_CGROUP+SM_CSYMBOL));
}
});
}
};
$.fn.globalDiscounts=function(method){
if(methods[method])
return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
if(typeof method==='object'||!method)
return methods.init.apply(this,arguments);
$.error('Method '+method+' does not exist on jQuery.globalDiscounts');
return null;
};
})(jQuery);
(function($){
jQuery.fn.splitter=function(options){
var defaults={
distribution:"even",
colsMargin:0,
fixedHeight:0,
stretchChildren:true
},
settings=$.extend({},defaults,options),
proportions=[],
isHostOfPL=false;
if(settings.colsMargin<0)
settings.colsMargin=parseInt($.Grid.marginLeft+$.Grid.marginRight);
jQuery.each(this,function(){
var el=$(this),
children=el.children(),
count=children.length;
isHostOfPL=el.find('.mod-product-list').length>0;
if(settings.distribution=="even"||count<2||count>3){
children.width((100/count)+"%");
}else{
switch(settings.distribution){
case "left":
proportions=count==2
?[66.66,33.33]
:[50,25,25];
break;
case "center":
proportions=count==2
?[50,50]
:[25,50,25];
break;
case "right":
proportions=count==2
?[33.33,66.66]
:[25,25,50];
break;
}
}
for(var i=0;i<count;++i){
var child=children.eq(i);
child.width(proportions[i]+"%");
if(i>0)child.children().css({marginLeft:settings.colsMargin});
}
switch(settings.fixedHeight){
case 0:
if(isHostOfPL){
_.defer(function(){
el.height(el.children().max(function(){return $(this).outerHeight(true);}));
});
}
else{
_.defer(function(){
el.height(el.children().max(function(){return $(this).outerHeight(true);}));
});
}
case -1:
break;
default:
el.height(settings.fixedHeight-el.verticalCushioning());
}
if(settings.stretchChildren==1){
if(isHostOfPL){
_.defer(function(){
el.find(".module-wrapper > :first-child").adjustContainerHeight(el.height());
});
}else{
_.defer(function(){
el.find(".module-wrapper > :first-child").adjustContainerHeight(el.height());
});
}
}
});
};
})(jQuery);
