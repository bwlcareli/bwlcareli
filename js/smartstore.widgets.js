
;(function($){
$.smartform={
options:{
radioClass:'radio',
checkboxClass:'checkbox',
fileClass:'uploader',
checkedClass:'checked',
focusClass:'focus',
disabledClass:'disabled',
activeClass:'active',
hoverClass:'hover',
useID:true,
idPrefix:'smform',
resetSelector:false,
autoHide:true,
handleInput:true,
handlePlaceholder:true,
handleNumber:true,
handleSelect:true,
handleBox:true,
handleLabel:true
},
elements:[]
};
$.fn.smartform=function(options){
options=$.extend({},$.smartform.options,options);
var el=this;
function doInput(elem){
elem.addClass("prompt");
var hasSpinner=false;
if(options.handleNumber&&elem.attr("type")==="number"){
if(!Modernizr.inputtypes.number){
elem.spinner({
min:elem.attr('min'),
max:elem.attr('max'),
step:elem.attr('step'),
allowNull:true
});
hasSpinner=true;
};
}
if(options.handlePlaceholder){
if(elem.attr("placeholder")){
elem.placeholder();
}
}
storeElement(elem);
}
function doSelect(elem){
if(!parseInt(elem.css("z-index"))){
_.defer(function(){elem.css("z-index",$.topZIndex())});
}
elem.selectmenu({style:'dropdown'});
storeElement(elem);
}
function doCheckboxOrRadio(elem,className){
var $el=$(elem);
var wrap=$el.parent(),
divTag=$('<div />'),
spanTag=$('<span />');
if(!$el.css("display")=="none"&&options.autoHide){
divTag.hide();
}
divTag.addClass(className);
if(options.useID&&elem.attr("id")!=""){
divTag.attr("id",options.idPrefix+"-"+elem.attr("id"));
}
wrap.attr("id","LBL_"+elem.attr("id"));
divTag.append(elem);
spanTag.html(wrap.html());
wrap.empty();
wrap.append(divTag).append(spanTag);
$(elem)
.css({'position':'absolute','left':'-999999px'})
.bind({
"focus.smartform":function(){
divTag.addClass(options.focusClass);
},
"blur.smartform":function(){
divTag.removeClass(options.focusClass);
},
"click.smartform touchend.smartform":function(){
if(!$(elem).is(":checked")){
divTag.removeClass(options.checkedClass);
}else{
if(className==options.radioClass){
var classes=className.split(" ")[0];
$("."+classes+"."+options.checkedClass+":has([name='"+$(elem).attr('name')+"'])").removeClass(options.checkedClass);
}
divTag.addClass(options.checkedClass);
}
},
"mousedown.smartform touchbegin.smartform":function(){
if(!$(elem).is(":disabled"))
divTag.addClass(options.activeClass);
},
"mouseup.smartform touchend.smartform":function(){
divTag.removeClass(options.activeClass);
},
"mouseenter.smartform":function(){
divTag.addClass(options.hoverClass);
},
"mouseleave.smartform":function(){
divTag.removeClass(options.hoverClass).removeClass(options.activeClass);
}
});
spanTag
.bind({
"mousedown.smartform":function(){$el.triggerHandler("mousedown");},
"mouseup.smartform":function(){$el.triggerHandler("mouseup");},
"mouseenter.smartform":function(){$el.triggerHandler("mouseenter");},
"mouseleave.smartform":function(){$el.triggerHandler("mouseleave");}
});
if($(elem).is(":checked")){
divTag.addClass(options.checkedClass);
}
if($(elem).is(":disabled")){
divTag.addClass(options.disabledClass);
}
storeElement(elem);
}
function storeElement(elem){
elem=$(elem).get();
if(elem.length>1){
$.each(elem,function(i,val){
$.smartform.elements.push(val);
});
}else{
$.smartform.elements.push(elem);
}
}
$.smartform.noSelect=function(elem){
function f(){
return false;
};
$(elem).each(function(){
this.onselectstart=this.ondragstart=f;
$(this)
.mousedown(f)
.css({MozUserSelect:'none'});
});
};
$.smartform.update=function(elem){
if(elem==undefined){
elem=$($.smartform.elements);
}
elem=$(elem);
var divTag;
elem.each(function(){
var $e=$(this);
if((options.handleSelect&&$e.is("select"))||(options.handleBox&&$e.is(":checkbox, :radio"))){
if($e.is("select")){
var uiSelect=$e.data("selectmenu");
if(uiSelect){
uiSelect.value($e.val());
}
}
else{
divTag=$e.closest("div");
divTag.removeClass(options.hoverClass+" "+options.focusClass+" "+options.activeClass+" "+options.checkedClass);
if($e.is(":checked")){
divTag.addClass(options.checkedClass);
}
if($e.is(":disabled")){
divTag.addClass(options.disabledClass);
}
else{
divTag.removeClass(options.disabledClass);
}
}
}
});
};
return this.each(function(){
var form=$(this);
if(options.handleInput){
var inputs="textarea, input:not([type=checkbox], [type=radio], [type=button], [type=reset])"
form.find(inputs).each(function(){
doInput($(this));
});
}
if(options.handleSelect){
form.find('select').each(function(){
var select=$(this);
if((select.attr("size")==undefined||parseInt(select.attr("size"))<=1)&&_.isEmpty(select.attr("multiple")))
doSelect(select);
});
}
if(options.handleBox){
form.find('label>input:checkbox, label>input:radio').each(function(){
var input=$(this);
input.parent().addClass("wrap");
if(input.is(':checkbox'))
doCheckboxOrRadio(input,options.checkboxClass);
else
doCheckboxOrRadio(input,options.radioClass);
});
}
if(options.handleLabel){
form.find(".control-caption > label").each(function(){
var lbl=$(this);
if(lbl.attr("title").length==0)
lbl.attr("title",lbl.text());
});
}
});
};
})(jQuery);
function SMFRMDatePicker_update(elem){
var ctl=elem,
id=ctl.attr('id').substring(ctl.attr('id').indexOf('_')+1),
form=null,
$he=$d=$m=$y=null;
if(ctl!=null){
form=ctl[0].form;
$he=form.elements[id];
$d=form.elements['dtDateDay_'+id];
$m=form.elements['dtDateMonth_'+id];
$y=form.elements['dtDateYear_'+id];
$he.value=$y.value+'-'+$m.value+'-'+$d.value;
};
}
(function($,undefined){
var
active='ui-state-active',
hover='ui-state-hover',
disabled='ui-state-disabled',
keyCode=$.ui.keyCode,
up=keyCode.UP,
down=keyCode.DOWN,
right=keyCode.RIGHT,
left=keyCode.LEFT,
pageUp=keyCode.PAGE_UP,
pageDown=keyCode.PAGE_DOWN,
home=keyCode.HOME,
end=keyCode.END,
msie=$.browser.msie,
mouseWheelEventName=$.browser.mozilla?'DOMMouseScroll':'mousewheel',
eventNamespace='.uispinner',
validKeys=[up,down,right,left,pageUp,pageDown,home,end,keyCode.BACKSPACE,keyCode.DELETE,keyCode.TAB],
focusCtrl;
$.widget('ui.spinner',{
options:{
min:null,
max:null,
allowNull:false,
group:'',
point:'.',
prefix:'',
suffix:'',
places:null,
defaultStep:1,
largeStep:10,
mouseWheel:true,
increment:'slow',
className:null,
showOn:'always',
width:16,
upIconClass:"ui-icon-triangle-1-n",
downIconClass:"ui-icon-triangle-1-s",
format:function(num,places){
var options=this,
regex=/(\d+)(\d{3})/,
result=((isNaN(num)?0:Math.abs(num)).toFixed(places))+'';
for(result=result.replace('.',options.point);regex.test(result)&&options.group;result=result.replace(regex,'$1'+options.group+'$2')){};
return(num<0?'-':'')+options.prefix+result+options.suffix;
},
parse:function(val){
var options=this;
if(options.group=='.')
val=val.replace('.','');
if(options.point!='.')
val=val.replace(options.point,'.');
return parseFloat(val.replace(/[^0-9\-\.]/g,''));
}
},
_create:function(){
var self=this,
input=self.element,
type=input.attr('type');
if(!input.is('input')||((type!='text')&&(type!='number'))){
console.error('Invalid target for ui.spinner');
return;
}
self._procOptions(true);
self._createButtons(input);
if(!input.is(':enabled'))
self.disable();
},
_createButtons:function(input){
function getMargin(margin){
return margin=='auto'?0:parseInt(margin);
}
var self=this,
options=self.options,
className=options.className,
buttonWidth=options.width,
showOn=options.showOn,
box=$.support.boxModel,
height=input.outerHeight(),
rightMargin=self.oMargin=getMargin(input.css('margin-right')),
wrapper=self.wrapper=input.css({width:(self.oWidth=(box?input.width():input.outerWidth()))-buttonWidth,
marginRight:rightMargin+buttonWidth,textAlign:'right'})
.after('<span class="ui-spinner ui-widget"></span>').next(),
btnContainer=self.btnContainer=$(
'<div class="ui-spinner-buttons">'+
'<div class="ui-spinner-up ui-spinner-button ui-state-default ui-corner-tr"><span class="ui-icon '+options.upIconClass+'">&nbsp;</span></div>'+
'<div class="ui-spinner-down ui-spinner-button ui-state-default ui-corner-br"><span class="ui-icon '+options.downIconClass+'">&nbsp;</span></div>'+
'</div>'),
upButton,downButton,buttons,icons,
hoverDelay,
hoverDelayCallback,
hovered,inKeyDown,inSpecialKey,inMouseDown,
rtl=input[0].dir=='rtl';
if(className)wrapper.addClass(className);
wrapper.append(btnContainer.css({height:height,left:-buttonWidth-rightMargin,
top:(input.offset().top-wrapper.offset().top)+'px'}));
buttons=self.buttons=btnContainer.find('.ui-spinner-button');
buttons.css({width:buttonWidth-(box?buttons.outerWidth()-buttons.width():0),height:height/2-(box?buttons.outerHeight()-buttons.height():0)});
upButton=buttons[0];
downButton=buttons[1];
icons=buttons.find('.ui-icon');
icons.css({marginLeft:(buttons.innerWidth()-icons.width())/2,marginTop:(buttons.innerHeight()-icons.height())/2});
btnContainer.width(buttons.outerWidth());
if(showOn!='always')
btnContainer.css('opacity',0);
if(showOn=='hover'||showOn=='both')
buttons.add(input)
.bind('mouseenter'+eventNamespace,function(){
setHoverDelay(function(){
hovered=true;
if(!self.focused||(showOn=='hover'))
self.showButtons();
});
})
.bind('mouseleave'+eventNamespace,function hoverOut(){
setHoverDelay(function(){
hovered=false;
if(!self.focused||(showOn=='hover'))
self.hideButtons();
});
});
buttons.hover(function(){
self.buttons.removeClass(hover);
if(!options.disabled)
$(this).addClass(hover);
},function(){
$(this).removeClass(hover);
})
.mousedown(mouseDown)
.mouseup(mouseUp)
.mouseout(mouseUp);
if(msie)
buttons.dblclick(function(){
if(!options.disabled){
self._change();
self._doSpin((this===upButton?1:-1)*options.step);
}
return false;
})
.bind('selectstart',function(){return false;});
input.bind('keydown'+eventNamespace,function(e){
var dir,large,limit,
keyCode=e.keyCode;
if(e.ctrl||e.alt)return true;
if(isSpecialKey(keyCode))
inSpecialKey=true;
if(inKeyDown)return false;
switch(keyCode){
case up:
case pageUp:
dir=1;
large=keyCode==pageUp;
break;
case down:
case pageDown:
dir=-1;
large=keyCode==pageDown;
break;
case right:
case left:
dir=(keyCode==right)^rtl?1:-1;
break;
case home:
limit=self.options.min;
if(limit!=null)self._setValue(limit);
return false;
case end:
limit=self.options.max;
limit=self.options.max;
if(limit!=null)self._setValue(limit);
return false;
}
if(dir){
if(!inKeyDown&&!options.disabled){
keyDir=dir;
$(dir>0?upButton:downButton).addClass(active);
inKeyDown=true;
self._startSpin(dir,large);
}
return false;
}
})
.bind('keyup'+eventNamespace,function(e){
if(e.ctrl||e.alt)return true;
if(isSpecialKey(keyCode))
inSpecialKey=false;
switch(e.keyCode){
case up:
case right:
case pageUp:
case down:
case left:
case pageDown:
buttons.removeClass(active)
self._stopSpin();
inKeyDown=false;
return false;
}
})
.bind('keypress'+eventNamespace,function(e){
if(invalidKey(e.keyCode,e.charCode))return false;
})
.bind('change'+eventNamespace,function(){self._change();})
.bind('focus'+eventNamespace,function(){
function selectAll(){
self.element.select();
}
msie?selectAll():setTimeout(selectAll,0);
self.focused=true;
focusCtrl=self;
if(!hovered&&(showOn=='focus'||showOn=='both'))
self.showButtons();
})
.bind('blur'+eventNamespace,function(){
self.focused=false;
if(!hovered&&(showOn=='focus'||showOn=='both'))
self.hideButtons();
});
function isSpecialKey(keyCode){
for(var i=0;i<validKeys.length;i++)
if(validKeys[i]==keyCode)return true;
return false;
}
function invalidKey(keyCode,charCode){
if(inSpecialKey)return false;
var ch=String.fromCharCode(charCode||keyCode),
options=self.options;
if((ch>='0')&&(ch<='9')||(ch=='-'))return false;
if(((self.places>0)&&(ch==options.point))
||(ch==options.group))return false;
return true;
}
function setHoverDelay(callback){
if(hoverDelay){
if(callback===hoverDelayCallback)return;
clearTimeout(hoverDelay);
}
hoverDelayCallback=callback;
hoverDelay=setTimeout(execute,100);
function execute(){
hoverDelay=0;
callback();
}
}
function mouseDown(){
if(!options.disabled){
var input=self.element[0],
dir=(this===upButton?1:-1);
input.focus();
input.select();
$(this).addClass(active);
inMouseDown=true;
self._startSpin(dir);
}
return false;
}
function mouseUp(){
if(inMouseDown){
$(this).removeClass(active);
self._stopSpin();
inMouseDown=false;
}
return false;
}
},
_procOptions:function(init){
var self=this,
input=self.element,
options=self.options,
min=options.min,
max=options.max,
step=options.step,
places=options.places,
maxlength=-1,temp;
if(options.increment=='slow')
options.increment=[{count:1,mult:1,delay:250},
{count:3,mult:1,delay:100},
{count:0,mult:1,delay:50}];
else if(options.increment=='fast')
options.increment=[{count:1,mult:1,delay:250},
{count:19,mult:1,delay:100},
{count:80,mult:1,delay:20},
{count:100,mult:10,delay:20},
{count:0,mult:100,delay:20}];
if((min==null)&&((temp=input.attr('min'))!=null))
min=parseFloat(temp);
if((max==null)&&((temp=input.attr('max'))!=null))
max=parseFloat(temp);
if(!step&&((temp=input.attr('step'))!=null))
if(temp!='any'){
step=parseFloat(temp);
options.largeStep*=step;
}
options.step=step=step||options.defaultStep;
if((places==null)&&((temp=step+'').indexOf('.')!=-1))
places=temp.length-temp.indexOf('.')-1;
self.places=places;
if((max!=null)&&(min!=null)){
if(min>max)min=max;
maxlength=Math.max(Math.max(maxlength,options.format(max,places,input).length),options.format(min,places,input).length);
}
if(init)self.inputMaxLength=input[0].maxLength;
temp=self.inputMaxLength;
if(temp>0){
maxlength=maxlength>0?Math.min(temp,maxlength):temp;
temp=Math.pow(10,maxlength)-1;
if((max==null)||(max>temp))
max=temp;
temp=-(temp+1)/10+1;
if((min==null)||(min<temp))
min=temp;
}
if(maxlength>0)
input.attr('maxlength',maxlength);
options.min=min;
options.max=max;
self._change();
input.unbind(mouseWheelEventName+eventNamespace);
if(options.mouseWheel)
input.bind(mouseWheelEventName+eventNamespace,self._mouseWheel);
},
_mouseWheel:function(e){
var self=$.data(this,'spinner');
if(!self.options.disabled&&self.focused&&(focusCtrl===self)){
self._change();
self._doSpin(((e.wheelDelta||-e.detail)>0?1:-1)*self.options.step);
return false;
}
},
_setTimer:function(delay,dir,large){
var self=this;
self._stopSpin();
self.timer=setInterval(fire,delay);
function fire(){
self._spin(dir,large);
}
},
_stopSpin:function(){
if(this.timer){
clearInterval(this.timer);
this.timer=0;
}
},
_startSpin:function(dir,large){
var self=this,
options=self.options,
increment=options.increment;
self._change();
self._doSpin(dir*(large?self.options.largeStep:self.options.step));
if(increment&&increment.length>0){
self.counter=0;
self.incCounter=0;
self._setTimer(increment[0].delay,dir,large);
}
},
_spin:function(dir,large){
var self=this,
increment=self.options.increment,
curIncrement=increment[self.incCounter];
self._change();
self._doSpin(dir*curIncrement.mult*(large?self.options.largeStep:self.options.step));
self.counter++;
if((self.counter>curIncrement.count)&&(self.incCounter<increment.length-1)){
self.counter=0;
curIncrement=increment[++self.incCounter];
self._setTimer(curIncrement.delay,dir,large);
}
},
_doSpin:function(step){
var self=this,
value=self.curvalue;
if(value==null)
value=(step>0?self.options.min:self.options.max)||0;
if(isNaN(value))value==0;
self._setValue(value+step);
},
_parseValue:function(){
var value=this.element.val();
return value?this.options.parse(value,this.element):null;
},
_validate:function(value){
var options=this.options,
min=options.min,
max=options.max;
if((value==null)&&!options.allowNull)
value=this.curvalue!=null?this.curvalue:min||max||0;
if((max!=null)&&(value>max))
return max;
else if((min!=null)&&(value<min))
return min;
else
return value;
},
_change:function(){
var self=this,
value=self._parseValue(),
min=self.options.min,
max=self.options.max;
if(!self.selfChange){
if(isNaN(value))
value=self.curvalue;
self._setValue(value,true);
}
},
_setOption:function(key,value){
$.Widget.prototype._setOption.call(this,key,value);
this._procOptions();
},
increment:function(){
this._doSpin(this.options.step);
},
decrement:function(){
this._doSpin(-this.options.step);
},
showButtons:function(immediate){
var btnContainer=this.btnContainer.stop();
if(immediate)
btnContainer.css('opacity',1);
else
btnContainer.fadeTo('fast',1);
},
hideButtons:function(immediate){
var btnContainer=this.btnContainer.stop();
if(immediate)
btnContainer.css('opacity',0);
else
btnContainer.fadeTo('fast',0);
this.buttons.removeClass(hover);
},
_setValue:function(value,suppressFireEvent){
var self=this;
self.curvalue=value=self._validate(value);
self.element.val(value!=null?
self.options.format(value,self.places,self.element):
'');
if(!suppressFireEvent){
self.selfChange=true;
self.element.change();
self.selfChange=false;
}
},
value:function(newValue){
if(arguments.length){
this._setValue(newValue);
return this.element;
}
return this.curvalue;
},
enable:function(){
this.buttons.removeClass(disabled);
this.element[0].disabled=false;
$.Widget.prototype.enable.call(this);
},
disable:function(){
this.buttons.addClass(disabled)
.removeClass(hover);
this.element[0].disabled=true;
$.Widget.prototype.disable.call(this);
},
destroy:function(target){
this._stopSpin();
this.wrapper.remove();
this.element.unbind(eventNamespace).css({width:this.oWidth,marginRight:this.oMargin});
$.Widget.prototype.destroy.call(this);
}
});
})(jQuery);
(function($,document,window){
var
defaults={
transition:"elastic",
speed:300,
width:false,
initialWidth:"600",
innerWidth:false,
maxWidth:false,
height:false,
initialHeight:"450",
innerHeight:false,
maxHeight:false,
scalePhotos:true,
scrolling:true,
inline:false,
html:false,
iframe:false,
fastIframe:true,
photo:false,
href:false,
title:false,
rel:false,
opacity:0.9,
preloading:true,
current:"image {current} of {total}",
previous:"previous",
next:"next",
close:"close",
open:false,
returnFocus:true,
reposition:true,
loop:true,
slideshow:false,
slideshowAuto:true,
slideshowSpeed:2500,
slideshowStart:"start slideshow",
slideshowStop:"stop slideshow",
onOpen:false,
onLoad:false,
onComplete:false,
onCleanup:false,
onClosed:false,
overlayClose:true,
escKey:true,
arrowKey:true,
top:false,
bottom:false,
left:false,
right:false,
fixed:false,
data:undefined
},
colorbox='colorbox',
prefix='cbox',
boxElement=prefix+'Element',
event_open=prefix+'_open',
event_load=prefix+'_load',
event_complete=prefix+'_complete',
event_cleanup=prefix+'_cleanup',
event_closed=prefix+'_closed',
event_purge=prefix+'_purge',
isIE=!$.support.opacity&&!$.support.style,
isIE6=isIE&&!window.XMLHttpRequest,
event_ie6=prefix+'_IE6',
$overlay,
$box,
$wrap,
$content,
$topBorder,
$leftBorder,
$rightBorder,
$bottomBorder,
$related,
$window,
$loaded,
$loadingBay,
$loadingOverlay,
$title,
$current,
$slideshow,
$next,
$prev,
$close,
$groupControls,
settings,
interfaceHeight,
interfaceWidth,
loadedHeight,
loadedWidth,
element,
index,
photo,
open,
active,
closing,
loadingTimer,
publicMethod,
div="div",
init;
function $tag(tag,id,css){
var element=document.createElement(tag);
if(id){
element.id=prefix+id;
}
if(css){
element.style.cssText=css;
}
return $(element);
}
function getIndex(increment){
var
max=$related.length,
newIndex=(index+increment)%max;
return(newIndex<0)?max+newIndex:newIndex;
}
function setSize(size,dimension){
return Math.round((/%/.test(size)?((dimension==='x'?$window.width():$window.height())/100):1)*parseInt(size,10));
}
function isImage(url){
return settings.photo||/\.(gif|png|jpe?g|bmp|ico)((#|\?).*)?$/i.test(url);
}
function makeSettings(){
var i;
settings=$.extend({},$.data(element,colorbox));
for(i in settings){
if($.isFunction(settings[i])&&i.slice(0,2)!=='on'){
settings[i]=settings[i].call(element);
}
}
settings.rel=settings.rel||element.rel||'nofollow';
settings.href=settings.href||$(element).attr('href');
settings.title=settings.title||element.title;
if(typeof settings.href==="string"){
settings.href=$.trim(settings.href);
}
}
function trigger(event,callback){
$.event.trigger(event);
if(callback){
callback.call(element);
}
}
function slideshow(){
var
timeOut,
className=prefix+"Slideshow_",
click="click."+prefix,
start,
stop,
clear;
if(settings.slideshow&&$related[1]){
start=function(){
$slideshow
.text(settings.slideshowStop)
.unbind(click)
.bind(event_complete,function(){
if(settings.loop||$related[index+1]){
timeOut=setTimeout(publicMethod.next,settings.slideshowSpeed);
}
})
.bind(event_load,function(){
clearTimeout(timeOut);
})
.one(click+' '+event_cleanup,stop);
$box.removeClass(className+"off").addClass(className+"on");
timeOut=setTimeout(publicMethod.next,settings.slideshowSpeed);
};
stop=function(){
clearTimeout(timeOut);
$slideshow
.text(settings.slideshowStart)
.unbind([event_complete,event_load,event_cleanup,click].join(' '))
.one(click,function(){
publicMethod.next();
start();
});
$box.removeClass(className+"on").addClass(className+"off");
};
if(settings.slideshowAuto){
start();
}else{
stop();
}
}else{
$box.removeClass(className+"off "+className+"on");
}
}
function launch(target){
if(!closing){
element=target;
makeSettings();
$related=$(element);
index=0;
if(settings.rel!=='nofollow'){
$related=$('.'+boxElement).filter(function(){
var relRelated=$.data(this,colorbox).rel||this.rel;
return(relRelated===settings.rel);
});
index=$related.index(element);
if(index===-1){
$related=$related.add(element);
index=$related.length-1;
}
}
if(!open){
open=active=true;
$box.show();
if(settings.returnFocus){
$(element).blur().one(event_closed,function(){
$(this).focus();
});
}
$overlay.css({"opacity":+settings.opacity,"cursor":settings.overlayClose?"pointer":"auto"}).show();
settings.w=setSize(settings.initialWidth,'x');
settings.h=setSize(settings.initialHeight,'y');
publicMethod.position();
if(isIE6){
$window.bind('resize.'+event_ie6+' scroll.'+event_ie6,function(){
$overlay.css({width:$window.width(),height:$window.height(),top:$window.scrollTop(),left:$window.scrollLeft()});
}).trigger('resize.'+event_ie6);
}
trigger(event_open,settings.onOpen);
$groupControls.add($title).hide();
$close.html(settings.close).show();
}
publicMethod.load(true);
}
}
function appendHTML(){
if(!$box&&document.body){
init=false;
$window=$(window);
$box=$tag(div).attr({id:colorbox,'class':isIE?prefix+(isIE6?'IE6':'IE'):''}).hide();
$overlay=$tag(div,"Overlay",isIE6?'position:absolute':'').hide();
$wrap=$tag(div,"Wrapper");
$content=$tag(div,"Content").append(
$loaded=$tag(div,"LoadedContent",'width:0; height:0; overflow:hidden'),
$loadingOverlay=$tag(div,"LoadingOverlay").add($tag(div,"LoadingGraphic")),
$title=$tag(div,"Title"),
$current=$tag(div,"Current"),
$next=$tag(div,"Next"),
$prev=$tag(div,"Previous"),
$slideshow=$tag(div,"Slideshow").bind(event_open,slideshow),
$close=$tag(div,"Close")
);
$wrap.append(
$tag(div).append(
$tag(div,"TopLeft"),
$topBorder=$tag(div,"TopCenter"),
$tag(div,"TopRight")
),
$tag(div,false,'clear:left').append(
$leftBorder=$tag(div,"MiddleLeft"),
$content,
$rightBorder=$tag(div,"MiddleRight")
),
$tag(div,false,'clear:left').append(
$tag(div,"BottomLeft"),
$bottomBorder=$tag(div,"BottomCenter"),
$tag(div,"BottomRight")
)
).find('div div').css({'float':'left'});
$loadingBay=$tag(div,false,'position:absolute; width:9999px; visibility:hidden; display:none');
$groupControls=$next.add($prev).add($current).add($slideshow);
$(document.body).append($overlay,$box.append($wrap,$loadingBay));
}
}
function addBindings(){
if($box){
if(!init){
init=true;
interfaceHeight=$topBorder.height()+$bottomBorder.height()+$content.outerHeight(true)-$content.height();
interfaceWidth=$leftBorder.width()+$rightBorder.width()+$content.outerWidth(true)-$content.width();
loadedHeight=$loaded.outerHeight(true);
loadedWidth=$loaded.outerWidth(true);
$box.css({"padding-bottom":interfaceHeight,"padding-right":interfaceWidth});
$next.click(function(){
publicMethod.next();
});
$prev.click(function(){
publicMethod.prev();
});
$close.click(function(){
publicMethod.close();
});
$overlay.click(function(){
if(settings.overlayClose){
publicMethod.close();
}
});
$(document).bind('keydown.'+prefix,function(e){
var key=e.keyCode;
if(open&&settings.escKey&&key===27){
e.preventDefault();
publicMethod.close();
}
if(open&&settings.arrowKey&&$related[1]){
if(key===37){
e.preventDefault();
$prev.click();
}else if(key===39){
e.preventDefault();
$next.click();
}
}
});
$('.'+boxElement,document).live('click',function(e){
if(!(e.which>1||e.shiftKey||e.altKey||e.metaKey)){
e.preventDefault();
launch(this);
}
});
}
return true;
}
return false;
}
if($.colorbox){
return;
}
$(appendHTML);
publicMethod=$.fn[colorbox]=$[colorbox]=function(options,callback){
var $this=this;
options=options||{};
appendHTML();
if(addBindings()){
if(!$this[0]){
if($this.selector){
return $this;
}
$this=$('<a/>');
options.open=true;
}
if(callback){
options.onComplete=callback;
}
$this.each(function(){
$.data(this,colorbox,$.extend({},$.data(this,colorbox)||defaults,options));
}).addClass(boxElement);
if(($.isFunction(options.open)&&options.open.call($this))||options.open){
launch($this[0]);
}
}
return $this;
};
publicMethod.position=function(speed,loadedCallback){
var
top=0,
left=0,
offset=$box.offset(),
scrollTop=$window.scrollTop(),
scrollLeft=$window.scrollLeft();
$window.unbind('resize.'+prefix);
$box.css({top:-9e4,left:-9e4});
if(settings.fixed&&!isIE6){
offset.top-=scrollTop;
offset.left-=scrollLeft;
$box.css({position:'fixed'});
}else{
top=scrollTop;
left=scrollLeft;
$box.css({position:'absolute'});
}
if(settings.right!==false){
left+=Math.max($window.width()-settings.w-loadedWidth-interfaceWidth-setSize(settings.right,'x'),0);
}else if(settings.left!==false){
left+=setSize(settings.left,'x');
}else{
left+=Math.round(Math.max($window.width()-settings.w-loadedWidth-interfaceWidth,0)/2);
}
if(settings.bottom!==false){
top+=Math.max($window.height()-settings.h-loadedHeight-interfaceHeight-setSize(settings.bottom,'y'),0);
}else if(settings.top!==false){
top+=setSize(settings.top,'y');
}else{
top+=Math.round(Math.max($window.height()-settings.h-loadedHeight-interfaceHeight,0)/2);
}
$box.css({top:offset.top,left:offset.left});
speed=($box.width()===settings.w+loadedWidth&&$box.height()===settings.h+loadedHeight)?0:speed||0;
$wrap[0].style.width=$wrap[0].style.height="9999px";
function modalDimensions(that){
$topBorder[0].style.width=$bottomBorder[0].style.width=$content[0].style.width=that.style.width;
$content[0].style.height=$leftBorder[0].style.height=$rightBorder[0].style.height=that.style.height;
}
$box.dequeue().animate({width:settings.w+loadedWidth,height:settings.h+loadedHeight,top:top,left:left},{
duration:speed,
complete:function(){
modalDimensions(this);
active=false;
$wrap[0].style.width=(settings.w+loadedWidth+interfaceWidth)+"px";
$wrap[0].style.height=(settings.h+loadedHeight+interfaceHeight)+"px";
if(settings.reposition){
setTimeout(function(){
$window.bind('resize.'+prefix,publicMethod.position);
},1);
}
if(loadedCallback){
loadedCallback();
}
},
step:function(){
modalDimensions(this);
}
});
};
publicMethod.resize=function(options){
if(open){
options=options||{};
if(options.width){
settings.w=setSize(options.width,'x')-loadedWidth-interfaceWidth;
}
if(options.innerWidth){
settings.w=setSize(options.innerWidth,'x');
}
$loaded.css({width:settings.w});
if(options.height){
settings.h=setSize(options.height,'y')-loadedHeight-interfaceHeight;
}
if(options.innerHeight){
settings.h=setSize(options.innerHeight,'y');
}
if(!options.innerHeight&&!options.height){
$loaded.css({height:"auto"});
settings.h=$loaded.height();
}
$loaded.css({height:settings.h});
publicMethod.position(settings.transition==="none"?0:settings.speed);
}
};
publicMethod.prep=function(object){
if(!open){
return;
}
var callback,speed=settings.transition==="none"?0:settings.speed;
$loaded.remove();
$loaded=$tag(div,'LoadedContent').append(object);
function getWidth(){
settings.w=settings.w||$loaded.width();
settings.w=settings.mw&&settings.mw<settings.w?settings.mw:settings.w;
return settings.w;
}
function getHeight(){
settings.h=settings.h||$loaded.height();
settings.h=settings.mh&&settings.mh<settings.h?settings.mh:settings.h;
return settings.h;
}
$loaded.hide()
.appendTo($loadingBay.show())
.css({width:getWidth(),overflow:settings.scrolling?'auto':'hidden'})
.css({height:getHeight()})
.prependTo($content);
$loadingBay.hide();
$(photo).css({'float':'none'});
if(isIE6){
$('select').not($box.find('select')).filter(function(){
return this.style.visibility!=='hidden';
}).css({'visibility':'hidden'}).one(event_cleanup,function(){
this.style.visibility='inherit';
});
}
callback=function(){
var preload,i,total=$related.length,iframe,frameBorder='frameBorder',allowTransparency='allowTransparency',complete,src,img;
if(!open){
return;
}
function removeFilter(){
if(isIE){
$box[0].style.removeAttribute('filter');
}
}
complete=function(){
clearTimeout(loadingTimer);
$loadingOverlay.hide();
trigger(event_complete,settings.onComplete);
};
if(isIE){
if(photo){
$loaded.fadeIn(100);
}
}
$title.html(settings.title).add($loaded).show();
if(total>1){
if(typeof settings.current==="string"){
$current.html(settings.current.replace('{current}',index+1).replace('{total}',total)).show();
}
$next[(settings.loop||index<total-1)?"show":"hide"]().html(settings.next);
$prev[(settings.loop||index)?"show":"hide"]().html(settings.previous);
if(settings.slideshow){
$slideshow.show();
}
if(settings.preloading){
preload=[
getIndex(-1),
getIndex(1)
];
while(i=$related[preload.pop()]){
src=$.data(i,colorbox).href||i.href;
if($.isFunction(src)){
src=src.call(i);
}
if(isImage(src)){
img=new Image();
img.src=src;
}
}
}
}else{
$groupControls.hide();
}
if(settings.iframe){
iframe=$tag('iframe')[0];
if(frameBorder in iframe){
iframe[frameBorder]=0;
}
if(allowTransparency in iframe){
iframe[allowTransparency]="true";
}
iframe.name=prefix+(+new Date());
if(settings.fastIframe){
complete();
}else{
$(iframe).one('load',complete);
}
iframe.src=settings.href;
if(!settings.scrolling){
iframe.scrolling="no";
}
$(iframe).addClass(prefix+'Iframe').appendTo($loaded).one(event_purge,function(){
iframe.src="//about:blank";
});
}else{
complete();
}
if(settings.transition==='fade'){
$box.fadeTo(speed,1,removeFilter);
}else{
removeFilter();
}
};
if(settings.transition==='fade'){
$box.fadeTo(speed,0,function(){
publicMethod.position(0,callback);
});
}else{
publicMethod.position(speed,callback);
}
};
publicMethod.load=function(launched){
var href,setResize,prep=publicMethod.prep;
active=true;
photo=false;
element=$related[index];
if(!launched){
makeSettings();
}
trigger(event_purge);
trigger(event_load,settings.onLoad);
settings.h=settings.height?
setSize(settings.height,'y')-loadedHeight-interfaceHeight:
settings.innerHeight&&setSize(settings.innerHeight,'y');
settings.w=settings.width?
setSize(settings.width,'x')-loadedWidth-interfaceWidth:
settings.innerWidth&&setSize(settings.innerWidth,'x');
settings.mw=settings.w;
settings.mh=settings.h;
if(settings.maxWidth){
settings.mw=setSize(settings.maxWidth,'x')-loadedWidth-interfaceWidth;
settings.mw=settings.w&&settings.w<settings.mw?settings.w:settings.mw;
}
if(settings.maxHeight){
settings.mh=setSize(settings.maxHeight,'y')-loadedHeight-interfaceHeight;
settings.mh=settings.h&&settings.h<settings.mh?settings.h:settings.mh;
}
href=settings.href;
loadingTimer=setTimeout(function(){
$loadingOverlay.show();
},100);
if(settings.inline){
$tag(div).hide().insertBefore($(href)[0]).one(event_purge,function(){
$(this).replaceWith($loaded.children());
});
prep($(href));
}else if(settings.iframe){
prep(" ");
}else if(settings.html){
prep(settings.html);
}else if(isImage(href)){
$(photo=new Image())
.addClass(prefix+'Photo')
.error(function(){
settings.title=false;
prep($tag(div,'Error').text('This image could not be loaded'));
})
.load(function(){
var percent;
photo.onload=null;
if(settings.scalePhotos){
setResize=function(){
photo.height-=photo.height*percent;
photo.width-=photo.width*percent;
};
if(settings.mw&&photo.width>settings.mw){
percent=(photo.width-settings.mw)/photo.width;
setResize();
}
if(settings.mh&&photo.height>settings.mh){
percent=(photo.height-settings.mh)/photo.height;
setResize();
}
}
if(settings.h){
photo.style.marginTop=Math.max(settings.h-photo.height,0)/2+'px';
}
if($related[1]&&(settings.loop||$related[index+1])){
photo.style.cursor='pointer';
photo.onclick=function(){
publicMethod.next();
};
}
if(isIE){
photo.style.msInterpolationMode='bicubic';
}
setTimeout(function(){
prep(photo);
},1);
});
setTimeout(function(){
photo.src=href;
},1);
}else if(href){
$loadingBay.load(href,settings.data,function(data,status,xhr){
prep(status==='error'?$tag(div,'Error').text('Request unsuccessful: '+xhr.statusText):$(this).contents());
});
}
};
publicMethod.next=function(){
if(!active&&$related[1]&&(settings.loop||$related[index+1])){
index=getIndex(1);
publicMethod.load();
}
};
publicMethod.prev=function(){
if(!active&&$related[1]&&(settings.loop||index)){
index=getIndex(-1);
publicMethod.load();
}
};
publicMethod.close=function(){
if(open&&!closing){
closing=true;
open=false;
trigger(event_cleanup,settings.onCleanup);
$window.unbind('.'+prefix+' .'+event_ie6);
$overlay.fadeTo(200,0);
$box.stop().fadeTo(300,0,function(){
$box.add($overlay).css({'opacity':1,cursor:'auto'}).hide();
trigger(event_purge);
$loaded.remove();
setTimeout(function(){
closing=false;
trigger(event_closed,settings.onClosed);
},1);
});
}
};
publicMethod.remove=function(){
$([]).add($box).add($overlay).remove();
$box=null;
$('.'+boxElement)
.removeData(colorbox)
.removeClass(boxElement)
.die();
};
publicMethod.element=function(){
return $(element);
};
publicMethod.settings=defaults;
}(jQuery,document,this));
;(function($,undefined){
$(function(){
$.extend($.colorbox.settings,{
opacity:$.Cfg.overlayOpacity,
current:T['cb.xofy'],
previous:T['btn.previous'],
next:T['btn.next'],
close:T['lbl.close'],
maxWidth:"95%",
maxHeight:"95%"
});
});
})(jQuery);
(function($){
$.widget('ui.smPaginator',{
options:{
style:'numbered',
arrowsPos:'far',
maxElements:0,
alignment:'horizontal',
horizontalAlign:'left',
linkClasses:null
},
_init:function(){
var options=this.options;
var self=this;
this._el=this.element;
var initialized=$.data(this,'initialized');
if(!initialized){
var nav,ul,lis;
if(!this.element.is("nav")){
if(!this.element.parent().is("nav")){
this._el=this.element.wrap("<nav />").parent();
}
else{
this._el=this.element.parent();
}
}
nav=this._el;
ul=nav.children(":first");
ul.addClass("sm-paginator-panel clearfix");
this._items=lis=ul.children(":not(.prev, .first)");
nav.after('<ul class="sm-paginator-panel more hidden-items-panel left clearfix" />')
.after('<ul class="sm-paginator-panel more hidden-items-panel right clearfix" />');
lis.children().wrapInner('<span/>');
this._hiddenItemsPanels=nav.parent().find('.sm-paginator-panel.more');
this._hiddenItemsPanels.hide();
var borderIndexLeft,borderIndexRight,ctrlPrev,ctrlNext;
var hiddenItemsPanelLeft=nav.parent().find('.sm-paginator-panel.more.left');
var hiddenItemsPanelRight=nav.parent().find('.sm-paginator-panel.more.right');
if(options.style=='numbered'){
nav.addClass('sm-paginator numbered');
}else{
nav.addClass('sm-paginator dotted');
}
if(options.arrowsPos=='far'){
ul.prepend('<li class="prev"><a href="#" data-page="<">&lt;</a></li>')
.append('<li class="next"><a href="#" data-page=">">&gt;</a></li>');
}
else if(options.arrowsPos=='near'){
ul.append('<li class="prev"><a href="#" data-page="<">&lt;</a></li><li class="next"><a href="#" data-page=">">&gt;</a></li>');
}
var navLis=ul.children(".prev, .next");
ctrlPrev=ul.find('.prev a');
ctrlNext=ul.find('.next a');
self.selectItem(ul.children(".selected").index());
if(options.style=='numbered'){
ul.children().addClass('ui-state-default ui-corner-all');
}else{
lis.addClass('dot').find('a').empty();
ul.children('.prev, .next').addClass('ui-state-default ui-corner-all');
}
if(options.alignment=='vertical'){
nav.addClass('vertical');
ctrlPrev.addClass('ui-icon ui-icon-triangle-1-n');
ctrlNext.addClass('ui-icon ui-icon-triangle-1-s');
}else{
nav.addClass('horizontal');
ctrlPrev.addClass('ui-icon ui-icon-triangle-1-w');
ctrlNext.addClass('ui-icon ui-icon-triangle-1-e');
}
if(options.arrowsPos=='near'){
navLis.removeClass('ui-corner-all');
if(options.alignment=='vertical'){
ctrlPrev.parent().addClass('ui-corner-tl ui-corner-tr').css('margin-bottom','0');
ctrlNext.parent().addClass('ui-corner-bl ui-corner-br').css('margin-top','-1px');
}else{
ctrlPrev.parent().addClass('ui-corner-tl ui-corner-bl').css('margin-right','0');
ctrlNext.parent().addClass('ui-corner-tr ui-corner-br').css('margin-left','-1px');
}
}
if(options.maxElements!=0&&options.style=='numbered'&&(!(options.maxElements>=lis.length))){
var sEllipsisLeft='<li class="further-elements left ui-state-default ui-corner-all"><span>...</span></li>';
var sEllipsisRight='<li class="further-elements right ui-state-default ui-corner-all"><span>...</span></li>';
var iRange=(options.maxElements-2)/2;
var currentIndex=lis.index(ul.children('.selected'));
var bEven=(((options.maxElements-2)%2)==1)?false:true;
if(!bEven)iRange=(options.maxElements-3)/2;
if(currentIndex==0){
lis.eq(lis.length-1).before(sEllipsisRight);
lis.filter(':gt('+(options.maxElements-2)+')').not(lis.eq(lis.length-1)).addClass('not-visible').hide();
}else if(lis.index($('.selected'))==(lis.length-1)){
lis.eq(0).after(sEllipsisLeft);
if(bEven){
lis.filter(':lt('+(lis.length-(iRange*2)-1)+')').not(lis.eq(0)).addClass('not-visible').hide();
}else{
lis.filter(':lt('+(lis.length-(iRange*2)-2)+')').not(lis.eq(0)).addClass('not-visible').hide();
}
lis.eq(currentIndex-options.maxElements+1).addClass('border-l');
}else{
if(bEven){
if(currentIndex>iRange)lis.eq(0).after(sEllipsisLeft);
lis.filter(':lt('+(currentIndex-iRange+1)+')').not(lis.eq(0)).addClass('not-visible').hide();
lis.eq(currentIndex-iRange+1).addClass('border-l');
}else{
if(currentIndex>(iRange+1))lis.eq(0).after(sEllipsisLeft);
if(currentIndex>=(lis.length-iRange-1)){
lis.filter(':lt('+(lis.length-(iRange*2)-2)+')').not(lis.eq(0)).addClass('not-visible').hide();
lis.eq(lis.length-(iRange*2)-2).addClass('border-l');
}else{
lis.filter(':lt('+(currentIndex-iRange)+')').not(lis.eq(0)).addClass('not-visible').hide();
lis.eq(currentIndex-iRange).addClass('border-l');
}
}
if(currentIndex<(lis.length-iRange-2)){
lis.eq(lis.length-1).before(sEllipsisRight);
}
if((currentIndex+iRange)>(options.maxElements-2)){
lis.filter(':gt('+(currentIndex+iRange)+')').not(lis.eq(lis.length-1)).addClass('not-visible').hide();
lis.eq((currentIndex+iRange)-1).addClass('border-r');
}else{
lis.filter(':gt('+(options.maxElements-2)+')').not(lis.eq(lis.length-1)).addClass('not-visible').hide();
lis.eq(options.maxElements-2).addClass('border-r');
}
if(currentIndex>=(lis.length-iRange-1)){
lis.filter(':gt('+(lis.length-(iRange*2)-2)+')').show();
lis.eq(lis.length-(iRange*2)-2).addClass('border-r');
}
}
}
borderIndexLeft=ul.find('.border-l').index();
borderIndexRight=ul.find('.border-r').index();
lis.each(function(index,value){
var button=$(this),
buttonPrev=button.prev().find('a'),
buttonNext=button.next().find('a');
if(button.hasClass("not-visible")){
var buttonClone=button.clone();
buttonClone.addClass("fl");
if(index<borderIndexLeft){
hiddenItemsPanelLeft.append(buttonClone);
}
if(index>=borderIndexRight){
hiddenItemsPanelRight.append(button.addClass("fl").outerHtml());
}
}
if(button.hasClass('selected')){
if(buttonPrev.attr('onclick')==undefined)
ctrlPrev.attr('href',buttonPrev.attr('href'));
else
ctrlPrev.attr('onclick',buttonPrev.attr('onclick'));
if(buttonNext.attr('onclick')==undefined)
ctrlNext.attr('href',buttonNext.attr('href'));
else
ctrlNext.attr('onclick',buttonNext.attr('onclick'));
if(options.linkClasses){
ctrlPrev.addClass(options.linkClasses);
ctrlNext.addClass(options.linkClasses);
}
}
});
hiddenItemsPanelLeft.find(':nth-child(13n)').next().addClass("fc");
hiddenItemsPanelRight.find(':nth-child(13n)').next().addClass("fc");
hiddenItemsPanelLeft.find('li').show(0);
hiddenItemsPanelRight.find('li').show(0);
function executeSimplePopup(side){
var furtherEls=ul.children('.further-elements.'+side);
if(furtherEls.length!=0){
furtherEls.smartPopup({
target:nav.parent().find('.sm-paginator-panel.more.'+side),
groupId:"paginator",
createWrapper:true,
transitionThreshold:200,
wrapperPadding:"5px 4px 4px 5px",
show:{
on:"click",
delay:400,
speed:500
},
hide:{
on:".ui-state-default",
delay:300,
speed:500
},
position:{
offset:options.alignment=='vertical'?'3 0':'0 3'
}
});
}
}
executeSimplePopup('left');
executeSimplePopup('right');
if(options.style=='numbered'){
var events={
mousedown:function(){$(this).addClass('ui-state-active')},
mouseup:function(){$(this).removeClass('ui-state-active')},
mouseover:function(){$(this).addClass('ui-state-hover')},
mouseout:function(){$(this).removeClass('ui-state-hover ui-state-active')}
}
nav.on(events,'li');
$('.sm-paginator-panel.more').on(events,'li');
}
navLis.hover(
function(){
if($(this).hasClass('prev')){
if(!self.isFirstItemSel){
ctrlPrev.parent().css('z-index','2');
ctrlNext.parent().css('z-index','1');
}
}else{
if(!self.isLastItemSel){
ctrlPrev.parent().css('z-index','1');
ctrlNext.parent().css('z-index','2');
}
}
},
function(){
}
);
if(options.alignment=='horizontal'){
switch(options.horizontalAlign){
case 'center':
nav.addClass('ac');
break;
case 'right':
nav.addClass('ar');
}
}
}
$('.sm-paginator .ui-state-disabled a').bind("click",function(event){
event.preventDefault();
return false;
});
$.data(this,'initialized',true);
},
destroy:function(){
$.Widget.prototype.destroy.call(this);
},
selectItem:function(el){
el=$.type(el)=='object'?el:this._items.eq(el-1);
if(this.options.style=='numbered'){
this._items.removeClass('ui-state-highlight');
el.addClass('ui-state-highlight');
}else{
this._items.removeClass('selected');
el.addClass('selected');
}
this.isFirstItemSel=this._items.first().hasClass('selected');
this.isLastItemSel=this._items.last().hasClass('selected');
this._el.find('.prev, .next').removeClass('ui-state-disabled');
if(this.isFirstItemSel)
this._el.find('li.prev').addClass('ui-state-disabled');
if(this.isLastItemSel)
this._el.find('li.next').addClass('ui-state-disabled');
},
getCurrentIndex:function(){
return(this._items.index($('.selected'),this)+1)+' / '+this._items.length;
}
});
})(jQuery);
(function($,undefined){
$.widget('ui.smMinibasket',{
options:{
initiallyExpanded:false
},
_init:function(){
var self=this,
minibasket=self.element,
widthTrash=jQuery('#mb-trash').outerWidth(true),
widthAL=jQuery('#mb-arrow-left').outerWidth(true),
widthAR=jQuery('#mb-arrow-right').outerWidth(true),
$productPanel=$('#mb-product-panel > div');
self._addButtons('.pnl-addtobasket-button, .addtobasket');
if(!$(document.documentElement).hasClass('iepre9')){
$('#minibasket .inactive').find('.ui-icon, a').addClass('o50');
}
$('#mb-arrow-left').click(function(){
var currentMargin=parseInt($productPanel.css('margin-left'));
var firstVisibleProductWidth=$('#mb-product-panel .is-first').outerWidth(true);
if((!$productPanel.is(":animated"))&&(currentMargin<70)){
$productPanel.animate({
marginLeft:(currentMargin+firstVisibleProductWidth)+'px'
},1000,function(){
showArrows();
});
$('.is-first')
.removeClass('is-first')
.prev()
.addClass('is-first');
}
});
$('#mb-arrow-right').click(function(){
var currentMargin=parseInt($productPanel.css('margin-left'));
var firstVisibleProductWidth=$('#mb-product-panel .is-first').outerWidth(true);
var el=$('.product-panel-item:last').get(0);
if(el!=null){
var distanceRight=el.offsetParent.offsetWidth-el.offsetWidth-el.offsetLeft;
if((!$productPanel.is(":animated"))&&(!miniBasketShowsAllItems())&&(distanceRight<18)){
$productPanel.animate({
marginLeft:(currentMargin-firstVisibleProductWidth)+'px'
},1000,function(){
showArrows();
});
$('.is-first')
.removeClass('is-first')
.next()
.addClass('is-first');
}
}
});
$('#mb-buttons').find('a, img').click(function(e){
if($(this).parent().hasClass('inactive')){
e.preventDefault();
e.stopPropagation();
}
});
self._addDraggables('.product-list .pl-frame-parent img, .sg-image img');
$('#minibasket > div').droppable({
drop:function(event,ui){
SMShop.basket.add(SMProductList[self._getProductIdFromElement(ui.draggable)]);
SMUpdateMiniBasket();
_.defer(function(){
$('.product-panel-item').removeClass('invisible');
});
},
greedy:true,
tolerance:'touch'
});
minibasket.find('#mb-trash').droppable({
scope:'mb-trash',
greedy:true,
drop:function(event,ui){
deleteProduct(parseInt(ui.draggable.attr('data-index')));
},
tolerance:'touch'
});
var products=SMShop.basket.xml.selectNodes(_SMPrd);
var product;
for(var i=0;i<products.length();i++)
{
product=new cSMProduct();
product.init(products.item(i));
addProductToMinibasket(product,true);
}
SMUpdateMiniBasket();
minibasket.data('state','collapsed');
$('#mb-header').click(function(event){
if(!$(event.target).is('#mb-buttons > div *'))
self._showMinibasket('toggle');
});
$('#minibasket, .mb-icon').hover(
function(){
$(this).addClass('hover');
},
function(){
$(this).removeClass('hover');
}
);
$('#mb-arrow-left, #mb-arrow-right').hover(
function(){
if(!self._miniBasketShowsAllItems()){
$(this).addClass('hover');
}
},
function(){
$(this).removeClass('hover');
}
);
function throttleResizeMB(){
var currentMargin=parseInt($productPanel.css('margin-left')),
el=$('.product-panel-item:last').get(0);
elWidth=$(el).outerWidth(true);
if(el!=null){
var distanceRight=el.offsetParent.offsetWidth-el.offsetWidth-el.offsetLeft-widthAL,
iSpaceItems=parseInt(distanceRight/elWidth),
navigationDistance=currentMargin,
tempCurrentMargin=currentMargin;
for(var i=0;i<iSpaceItems;i++){
if(tempCurrentMargin<(widthTrash+widthAL)){
navigationDistance+=(elWidth);
tempCurrentMargin+=(elWidth);
}
}
if((!$productPanel.is(":animated"))&&(distanceRight>elWidth)&&(currentMargin<(widthTrash+widthAL))){
$productPanel.animate({
marginLeft:navigationDistance+'px'
},1000);
}
}
showArrows();
}
var lazyResizeMB=_.debounce(throttleResizeMB,300);
$(window).resize(lazyResizeMB);
$('.sm-product-detail').bind('afterSmallImageVisible',function(e){
self._addDraggables('.sg-image img');
});
if((!$.Cfg.stageMode&&navigator.isIE)||this.options.initiallyExpanded===false){
self._showMinibasket('close');
}
else{
var initialState=_.getCookie('MiniBasketState')||'open';
self._showMinibasket(initialState);
}
},
_getProductIdFromElement:function(element){
var dataID=element.parents('.sm-product-detail').find('#pd-gallery-small').attr('data-id');
if(dataID==undefined){
dataID=element.parents(".pl-cell").data('pkid');
}
return dataID;
/*
if(element.parents('.sm-product-detail').find('#pd-gallery-small').attr('data-id')==undefined){
return element.parents(".pl-cell").data('pkid');
}else{
return element.parents('.sm-product-detail').find('#pd-gallery-small').attr('data-id');
};
*/
},
_addDraggables:function(selector){
var self=this;
_.defer(function(){
$(selector).draggable({
appendTo:'body',
helper:'clone',
containment:'document',
drag:function(event,ui){
var hasAddToBasket=true;
hasAddToBasket=$(this).parents('.pl-element').find('.pnl-addtobasket').get(0)!=null
||$(this).parents('.sm-product-detail').find('.pnl-addtobasket').get(0)!=null;
if(!hasAddToBasket)
return false;
},
start:function(event,ui){
var hasAddToBasket=true;
hasAddToBasket=$(this).parents('.pl-element').find('.pnl-addtobasket').get(0)!=null
||$(this).parents('.sm-product-detail').find('.pnl-addtobasket').get(0)!=null;
if(hasAddToBasket){
ui.helper.bind("click.prevent",function(event){event.preventDefault();});
self._showMinibasket('open');
self._switchProductPanelBG('overlay');
bIsDragged=true;
}
},
stop:function(event,ui){
setTimeout(function(){ui.helper.unbind("click.prevent");},300);
$(this).css('z-index','103');
self._switchProductPanelBG('clear');
bIsDragged=false;
},
zIndex:$.topZIndex()+1
});
});
},
_miniBasketShowsAllItems:function(){
var productAmount=$('#mb-product-panel .product-panel-item').length+1;
var minibasketWidth=$('#mb-product-panel').outerWidth()-($('#mb-trash').outerWidth()+$('#mb-arrow-left').outerWidth()+$('#mb-arrow-right').outerWidth());
var itemWidth=$('.product-panel-item.is-first').outerWidth(true);
if(minibasketWidth<(productAmount*itemWidth)){
return false;
}else{
return true;
}
},
_showMinibasket:function(state){
var products=SMShop.basket.xml.selectNodes(_SMPrd),
minibasket=$('#minibasket > div'),
height=parseInt($('#mb-product-panel').height()),
speed=200,
miniBasketSection=minibasket.parent();
if(SMShop.basket.getAttribute(_SMATotalItems)==0){
$('#msgAtFirstVisit').show();
}else{
$('#msgAtFirstVisit').hide();
}
switch(state){
case 'open':
if(minibasket.data('state')=='collapsed'){
miniBasketSection.animate({
bottom:'+='+height+'px'
},speed,function(){
minibasket.data('state','expanded');
});
}
break;
case 'close':
if(minibasket.data('state')!='collapsed'){
miniBasketSection.animate({
bottom:'-='+height+'px'
},speed,function(){
minibasket.data('state','collapsed');
});
}
break;
case 'toggle':
if(minibasket.data('state')=='collapsed'){
miniBasketSection.animate({
bottom:'+='+height+'px'
},speed,function(){
minibasket.data('state','expanded');
});
state='open';
}else{
miniBasketSection.animate({
bottom:'-='+height+'px'
},speed,function(){
minibasket.data('state','collapsed');
});
state='close';
}
break;
}
$('.mb-icon').toggleClass('expanded',state==='open');
if(!$.Cfg.stageMode&&navigator.isIE){
}
else{
_.setCookie('MiniBasketState',state);
}
},
_switchProductPanelBG:function(mode){
var $productPanelOverlay=$('#productPanelOverlay',self.element);
var $msgAtFirstVisit=$('#msgAtFirstVisit',self.element);
if(mode=='overlay'){
$productPanelOverlay.css('display','block');
$msgAtFirstVisit.addClass('half-transparent');
}else{
$productPanelOverlay.css('display','none');
$msgAtFirstVisit.removeClass('half-transparent');
}
},
_addButtons:function(selector){
var self=this;
$(selector).click(function(e){
self._showMinibasket('open');
var activeMiniPanelID=self._getProductIdFromElement($(this));
var currentIndex=jQuery('#mb-product-panel').find('.product-panel-item').length-1;
var minibasketItem=$('.product-panel-item[data-id="'+activeMiniPanelID+'"]');
var options={to:minibasketItem,className:"ui-effects-transfer"};
$(e.currentTarget).effect('transfer',options,1200,function(){highlightMinibasket(activeMiniPanelID,currentIndex)});
});
function highlightMinibasket(id,index){
var minibasketItem=$('.product-panel-item[data-id="'+id+'"]');
minibasketItem.removeClass("invisible");
minibasketItem.effect('highlight',{easing:"easeInBounce"},500,function(){
minibasketItem.effect('highlight',{easing:"easeInBounce"},500);
});
}
},
registerDraggables:function(selector){
this._addDraggables(selector);
},
registerButtons:function(selector){
this._addButtons(selector);
}
});
})(jQuery);
var bItemExists=false,
bIsDragged=false,
deletedIndex=0;
function SMUpdateMiniBasket(){
SMPrice=new cSMPrice();
SMPrice.decode(SMShop.basket.getAttribute(_SMASubTotal));
var subTotal=totalProducts=0;
if(SMShop.getAttribute(_SMAOComplete)!="true"){
totalProducts=SMShop.basket.getAttribute(_SMATotalItems);
subTotal=cprimary.format((SMShop.getAttribute(_SMAOutGross)!="1")?SMPrice.net:SMPrice.gross,SM_CGROUP+SM_CSYMBOL);
};
var sProduct=parseInt(totalProducts)!=1?'Produkte':'Produkt';
if(arguments[0]!=null){
if(!bItemExists)
addProductToMinibasket(arguments[0],false);
}
try{
jQuery('.mb-count-heading').html(' '+sProduct+' ');
jQuery('.mb-count-value').html(totalProducts>0?totalProducts:'0');
jQuery('.mb-total-value').html(subTotal);
}catch(e){}
};
function deleteProductByID(id){
var iProductID=id;
var products=SMShop.basket.xml.selectNodes(_SMPrd);
var product;
for(var i=0;i<products.length();i++){
product=new cSMProduct();
product.init(products.item(i));
if(product.getAttribute(_SMAUniqueID)==iProductID){
SMShop.basket.remove(i);
deletedIndex=i;
}
continue;
}
showArrows();
}
function deleteProduct(index){
deletedIndex=index;
SMShop.basket.remove(index);
showArrows();
}
function asignNewIndex(){
jQuery('#mb-product-panel .product-panel-item').each(function(index,value){
jQuery(this).attr("data-index",index);
});
}
function addProductToMinibasket(addedProduct,visible){
jQuery('#msgAtFirstVisit').hide();
jQuery('#mb-buttons > div').removeClass('inactive');
jQuery('#mb-buttons > div > *').removeClass('o50');
var currentIndex=jQuery('#mb-product-panel').find('.product-panel-item').length;
var sProductHtml='<div class="product-panel-item'+(visible?'':' invisible')+'" data-attr="'+addedProduct.getAttribute(_SMAAmount)+'">';
var sThumb=addedProduct.getAttribute('thumb');
var mediaPos=sThumb.indexOf('/media');
var urlPos=sThumb.indexOf('http://');
if(urlPos!=-1){
var t=sThumb.substr(urlPos);
}
else{
if(mediaPos!=-1){
var t=SMOMAbsoluteRootURL+sThumb.substr(mediaPos);
}
else{
var t=SMOMAbsoluteRootURL+sThumb;
}
}
sProductHtml+=(t!=''?'<img src="'+t+'" class="thumb" />':'');
sProductHtml+='<span class="product-amount smaller bold">'+addedProduct.getAttribute(_SMAAmount)+'</span>';
sProductHtml+='<div id="minibasket-item-popup'+addedProduct.getAttribute(_SMAUniqueID)+'" class="minibasket-item-popup">';
sProductHtml+='	<div>';
sProductHtml+=(t!=''?'<a href="'+addedProduct.getAttribute(_SMAURL)+'"><img src="'+t+'" class="thumb" /></a>':'');
sProductHtml+=(t==''?'<div class="thumb no-thumb"><span class="no-thumb-text"/>Ohne Abb.</span></div>':'');
sProductHtml+='		<a href="'+addedProduct.getAttribute(_SMAURL)+'"><span><strong>'+addedProduct.name+'</strong></span></a>';
sProductHtml+='		<br>';
sProductHtml+='		<span class="mb-popup-product-id">Art.Nr.: '+addedProduct.getAttribute("cde")+'</span>';
sProductHtml+='	</div>';
sProductHtml+='	<div style="clear:left"></div>';
sProductHtml+='	<div class="mb-popup-left">';
sProductHtml+='		<div class="mb-popup-desc">'+addedProduct.desc+'</div>';
sProductHtml+='		<div class="mb-popup-detailslink"><a href="'+addedProduct.getAttribute(_SMAURL)+'">Produktdetails</a></div>';
sProductHtml+='	</div>';
sProductHtml+='	<div class="mb-popup-right">';
sProductHtml+='		<div class="mb-price nice pr-now-price xx-larger">'+cprimary.format(addedProduct.getPrice(),SM_CASHTML|SM_CGROUP|SM_CSYMBOL)+' *</div>';
if(addedProduct.deliveryTime!="")sProductHtml+='<div class="deliverytime">Lieferzeit: '+addedProduct.deliveryTime+'</div>';
sProductHtml+='		<a class="btn smaller delete special" data-index="'+currentIndex+'" data-id="'+addedProduct.getAttribute(_SMAUniqueID)+'">Position löschen</a>';
sProductHtml+='	<div class="mb-popup-bottom deliverytime-short">';
if(addedProduct.deliveryTime.length>20)sProductHtml+='	<div class="mb-popup-bottom deliverytime-long">';
sProductHtml+='		<span>* Alle Preisangaben sind zzgl. <a href="../../pg8.html">Versandkosten</a> - inkl. MwSt</span>';
sProductHtml+='	</div>';
sProductHtml+='	</div>';
/*
sProductHtml+='	<div class="mb-popup-bottom deliverytime-short">';
if(addedProduct.deliveryTime.length>20)sProductHtml+='	<div class="mb-popup-bottom deliverytime-long">';
sProductHtml+='		<span>* Alle Preisangaben sind zzgl. <a href="../../pg8.html">Versandkosten</a> - inkl. MwSt</span>';
sProductHtml+='	</div>';
*/
sProductHtml+='</div>';
sProductHtml+='</div>';
var $panel=jQuery(sProductHtml);
jQuery('#mb-product-panel > div').append($panel);
jQuery(".btn.delete").button();
jQuery('.minibasket-item-popup a[data-id="'+addedProduct.getAttribute(_SMAUniqueID)+'"]').click(function(){
deleteProductByID(jQuery(this).attr('data-id'));
});
$panel
.attr('data-amount',addedProduct.getAttribute(_SMAAmount))
.attr('data-id',addedProduct.getAttribute(_SMAUniqueID))
.attr('data-index',currentIndex);
$panel.find('.product-amount').text(addedProduct.getAttribute(_SMAAmount));
/*
jQuery('#minibasket .product-panel-item').hover(
function(){
jQuery(this).addClass('mb-item-hover');
},
function(){
jQuery(this).removeClass('mb-item-hover');
}
);
*/
$panel.smartPopup({
groupId:"minibasket",
target:jQuery('#minibasket-item-popup'+addedProduct.getAttribute(_SMAUniqueID)),
createWrapper:true,
sourceHoverClass:"mb-item-hover",
sourceActiveClass:"mb-item-active",
transitionThreshold:200,
show:{
on:"hover",
delay:400,
speed:500
},
hide:{
on:"leave",
delay:300,
speed:500
},
position:{
offset:"0 25"
}
});
jQuery('#mb-product-panel').find('.product-panel-item').draggable({
helper:'clone',
containment:'#mb-product-panel',
stop:function(event,ui){
jQuery(this).css('z-index','');
},
zIndex:jQuery.topZIndex()+1,
axis:'x',
scope:'mb-trash'
});
jQuery('.product-panel-item:first').addClass('is-first');
showArrows();
};
/*
function showArrows(){
var productAmount=jQuery('#mb-product-panel .product-panel-item').length+1;
var minibasketWidth=jQuery('#mb-product-panel').outerWidth()-(jQuery('#mb-trash').outerWidth()+jQuery('#mb-arrow-left').outerWidth()+jQuery('#mb-arrow-right').outerWidth());
var itemWidth=jQuery('.product-panel-item.is-first').outerWidth(true);
var maxVisibleItems=parseInt(minibasketWidth/itemWidth);
if(productAmount>maxVisibleItems){
jQuery('#mb-arrow-left, #mb-arrow-right').addClass('active');
}else{
jQuery('#mb-arrow-left, #mb-arrow-right').removeClass('active');
}
};
*/
function showArrows(){
var widthTrash=jQuery('#mb-trash').outerWidth(),
widthAL=jQuery('#mb-arrow-left').outerWidth(),
widthAR=jQuery('#mb-arrow-right').outerWidth(),
productAmount=jQuery('#mb-product-panel .product-panel-item').length+1,
minibasketWidth=jQuery('#mb-product-panel').outerWidth()-(widthTrash+widthAL+widthAR),
itemWidth=jQuery('.product-panel-item.is-first').outerWidth(true),
maxVisibleItems=parseInt(minibasketWidth/itemWidth),
el=jQuery('.product-panel-item:last').get(0);
if(el){
var currentMargin=parseInt(jQuery('#mb-product-panel > div').css('margin-left')),
distanceRight=el.offsetParent.offsetWidth-el.offsetWidth-el.offsetLeft;
if(!miniBasketShowsAllItems()&&(distanceRight>widthAL)){
jQuery('#mb-arrow-right').removeClass('active');
}else{
jQuery('#mb-arrow-right').addClass('active');
}
if(!miniBasketShowsAllItems()&&currentMargin>(widthTrash+widthAL)){
jQuery('#mb-arrow-left').removeClass('active');
}else{
jQuery('#mb-arrow-left').addClass('active');
}
if(miniBasketShowsAllItems()){
jQuery('#mb-arrow-left, #mb-arrow-right').removeClass('active');
}
}
};
function miniBasketShowsAllItems(){
var productAmount=jQuery('#mb-product-panel .product-panel-item').length+1;
var minibasketWidth=jQuery('#mb-product-panel').outerWidth()-(jQuery('#mb-trash').outerWidth()+jQuery('#mb-arrow-left').outerWidth()+jQuery('#mb-arrow-right').outerWidth());
var itemWidth=jQuery('.product-panel-item.is-first').outerWidth(true);
if(minibasketWidth<(productAmount*itemWidth)){
return false;
}else{
return true;
}
}
SMShop.basket.base.addMember("SMSMiniBasket");
SMSMiniBasket_onAfterUpdate=function(args)
{
SMUpdateMiniBasket();
};
SMSMiniBasket_onAfterRemove=function(args){
/*
var removedProduct=args[1];
jQuery('.product-panel-item[data-id='+removedProduct.getAttribute(_SMAUniqueID)+']','#mb-product-panel')
.attr('data-amount',0)
.remove();
*/
jQuery('.product-panel-item[data-index='+deletedIndex+']','#mb-product-panel')
.attr('data-amount',0)
.remove();
asignNewIndex();
if(SMShop.basket.getAttribute(_SMATotalItems)==0){
jQuery('#mb-buttons > div').addClass('inactive');
}
};
SMSMiniBasket_onAfterAdd=function(args){
var addedProduct=args[1];
var productPanel=jQuery('#minibasket > div .product-panel-item[data-id="'+addedProduct.getAttribute(_SMAUniqueID)+'"]');
productPanel.find('.product-amount').text(addedProduct.getAttribute(_SMAAmount));
productPanel.attr('data-amount',addedProduct.getAttribute(_SMAAmount));
/*
jQuery('.product-amount','#minibasket > div .product-panel-item[data-id="'+addedProduct.getAttribute(_SMAUniqueID)+'"]')
.text(addedProduct.getAttribute(_SMAAmount))
.attr('data-amount',addedProduct.getAttribute(_SMAAmount));
*/
SMUpdateMiniBasket(addedProduct);
if(bItemExists){
bItemExists=false;
}
};
SMSMiniBasket_onItemExists=function(args){
var addedProduct=args[1],
productList=jQuery('.pl-cell[data-pkid='+addedProduct.getAttribute(_SMAUniqueID)+']').parents('.product-list'),
isParentGrid=productList.hasClass('grid')||productList.hasClass('scroll');
if(bIsDragged){
var currentItem=jQuery('#minibasket > div .product-panel-item[data-id="'+addedProduct.getAttribute(_SMAUniqueID)+'"]');
var currentAmount=parseInt(currentItem.attr('data-amount'))+1;
currentItem.attr('data-amount',currentAmount);
addedProduct.setAttribute(_SMAAmount,currentAmount);
addedProduct.update();
}
bItemExists=true;
bIsDragged=false;
};
(function($){
var isIE6=($.browser.msie&&$.browser.version<7);
var body=$(document.body);
var window=$(window);
var jqzoompluging_disabled=false;
$.fn.jqzoom=function(options){
return this.each(function(){
var node=this.nodeName.toLowerCase();
if(node=='a'){
new jqzoom(this,options);
}
});
};
jqzoom=function(el,options){
var api=null;
api=$(el).data("jqzoom");
if(api)return api;
var obj=this;
var settings=$.extend({},$.jqzoom.defaults,options||{});
obj.el=el;
el.rel=$(el).attr('rel');
el.zoom_active=false;
el.zoom_disabled=false;
el.largeimageloading=false;
el.largeimageloaded=false;
el.scale={};
el.timer=null;
el.mousepos={};
el.mouseDown=false;
$(el).css({
'outline-style':'none',
'text-decoration':'none'
});
var img=$("img:eq(0)",el);
el.title=$(el).attr('title');
el.imagetitle=img.attr('title');
var zoomtitle=($.trim(el.title).length>0)?el.title:el.imagetitle;
var smallimage=new Smallimage(img);
var lens=new Lens();
var stage=new Stage();
var largeimage=new Largeimage();
var loader=new Loader();
$(el).bind('click',function(e){
e.preventDefault();
return false;
});
var zoomtypes=['standard','drag','innerzoom','reverse'];
if($.inArray($.trim(settings.zoomType),zoomtypes)<0){
settings.zoomType='standard';
}
$.extend(obj,{
create:function(){
if($(".zoomPad",el).length==0){
el.zoomPad=$('<div/>').addClass('zoomPad');
img.wrap(el.zoomPad);
}
if(settings.zoomType=='innerzoom'){
settings.zoomWidth=smallimage.w;
settings.zoomHeight=smallimage.h;
}
if($(".zoomPup",el).length==0){
lens.append();
}
if($(".zoomWindow",el).length==0){
stage.append();
}
if($(".zoomPreload",el).length==0){
loader.append();
}
if(settings.preloadImages||settings.zoomType=='drag'||settings.alwaysOn){
obj.load();
}
obj.init();
},
init:function(){
if(settings.zoomType=='drag'){
$(".zoomPad",el).mousedown(function(){
el.mouseDown=true;
});
$(".zoomPad",el).mouseup(function(){
el.mouseDown=false;
});
document.body.ondragstart=function(){
return false;
};
$(".zoomPad",el).css({
cursor:'default'
});
$(".zoomPup",el).css({
cursor:'move'
});
}
if(settings.zoomType=='innerzoom'){
$(".zoomWrapper",el).css({
cursor:'crosshair'
});
}
$(".zoomPad",el).bind('mouseenter mouseover',function(event){
img.attr('title','');
$(el).attr('title','');
el.zoom_active=true;
smallimage.fetchdata();
if(el.largeimageloaded){
obj.activate(event);
}else{
obj.load();
}
});
$(".zoomPad",el).bind('mouseleave',function(event){
obj.deactivate();
});
$(".zoomPad",el).bind('mousemove',function(e){
if(e.pageX>smallimage.pos.r||e.pageX<smallimage.pos.l||e.pageY<smallimage.pos.t||e.pageY>smallimage.pos.b){
lens.setcenter();
return false;
}
el.zoom_active=true;
if(el.largeimageloaded&&!$('.zoomWindow',el).is(':visible')){
obj.activate(e);
}
if(el.largeimageloaded&&(settings.zoomType!='drag'||(settings.zoomType=='drag'&&el.mouseDown))){
lens.setposition(e);
}
});
var thumb_preload=new Array();
var i=0;
var thumblist=new Array();
thumblist=$('a').filter(function(){
var regex=new RegExp("gallery[\\s]*:[\\s]*'"+$.trim(el.rel)+"'","i");
var rel=$(this).attr('rel');
if(regex.test(rel)){
return this;
}
});
if(thumblist.length>0){
var first=thumblist.splice(0,1);
thumblist.push(first);
}
thumblist.each(function(){
if(settings.preloadImages){
var thumb_options=$.extend({},eval("("+$.trim($(this).attr('rel'))+")"));
thumb_preload[i]=new Image();
thumb_preload[i].src=thumb_options.largeimage;
i++;
}
$(this).click(function(e){
if($(this).hasClass('zoomThumbActive')){
return false;
}
thumblist.each(function(){
$(this).removeClass('zoomThumbActive');
});
e.preventDefault();
obj.swapimage(this);
return false;
});
});
},
load:function(){
if(el.largeimageloaded==false&&el.largeimageloading==false){
var url=$(el).attr('href');
el.largeimageloading=true;
largeimage.loadimage(url);
}
},
activate:function(e){
clearTimeout(el.timer);
lens.show();
stage.show();
},
deactivate:function(e){
switch(settings.zoomType){
case 'drag':
break;
default:
img.attr('title',el.imagetitle);
$(el).attr('title',el.title);
if(settings.alwaysOn){
lens.setcenter();
}else{
stage.hide();
lens.hide();
}
break;
}
el.zoom_active=false;
},
swapimage:function(link){
el.largeimageloading=false;
el.largeimageloaded=false;
var options=new Object();
options=$.extend({},eval("("+$.trim($(link).attr('rel'))+")"));
if(options.smallimage&&options.largeimage){
var smallimage=options.smallimage;
var largeimage=options.largeimage;
$(link).addClass('zoomThumbActive');
$(el).attr('href',largeimage);
img.attr('src',smallimage);
lens.hide();
stage.hide();
obj.load();
}else{
alert('ERROR :: Missing parameter for largeimage or smallimage.');
throw 'ERROR :: Missing parameter for largeimage or smallimage.';
}
return false;
}
});
if(img[0].complete){
smallimage.fetchdata();
if($(".zoomPad",el).length==0)obj.create();
}
function Smallimage(image){
var $obj=this;
this.node=image[0];
this.findborder=function(){
var bordertop=0;
bordertop=image.css('border-top-width');
btop='';
var borderleft=0;
borderleft=image.css('border-left-width');
bleft='';
if(bordertop){
for(i=0;i<3;i++){
var x=[];
x=bordertop.substr(i,1);
if(isNaN(x)==false){
btop=btop+''+bordertop.substr(i,1);
}else{
break;
}
}
}
if(borderleft){
for(i=0;i<3;i++){
if(!isNaN(borderleft.substr(i,1))){
bleft=bleft+borderleft.substr(i,1)
}else{
break;
}
}
}
$obj.btop=(btop.length>0)?eval(btop):0;
$obj.bleft=(bleft.length>0)?eval(bleft):0;
};
this.fetchdata=function(){
$obj.findborder();
$obj.w=image.width();
$obj.h=image.height();
$obj.ow=image.outerWidth();
$obj.oh=image.outerHeight();
$obj.pos=image.offset();
$obj.pos.l=image.offset().left+$obj.bleft;
$obj.pos.t=image.offset().top+$obj.btop;
$obj.pos.r=$obj.w+$obj.pos.l;
$obj.pos.b=$obj.h+$obj.pos.t;
$obj.rightlimit=image.offset().left+$obj.ow;
$obj.bottomlimit=image.offset().top+$obj.oh;
};
this.node.onerror=function(){
alert('Problems while loading image.');
throw 'Problems while loading image.';
};
this.node.onload=function(){
$obj.fetchdata();
if($(".zoomPad",el).length==0)obj.create();
};
return $obj;
};
function Loader(){
var $obj=this;
this.append=function(){
this.node=$('<div/>').addClass('zoomPreload').css('visibility','hidden').html(settings.preloadText);
$('.zoomPad',el).append(this.node);
};
this.show=function(){
this.node.top=(smallimage.oh-this.node.height())/2;
this.node.left=(smallimage.ow-this.node.width())/2;
this.node.css({
top:this.node.top,
left:this.node.left,
position:'absolute',
visibility:'visible'
});
};
this.hide=function(){
this.node.css('visibility','hidden');
};
return this;
}
function Lens(){
var $obj=this;
this.node=$('<div/>').addClass('zoomPup');
this.append=function(){
$('.zoomPad',el).append($(this.node).hide());
if(settings.zoomType=='reverse'){
this.image=new Image();
this.image.src=smallimage.node.src;
$(this.node).empty().append(this.image);
}
};
this.setdimensions=function(){
this.node.w=(parseInt((settings.zoomWidth)/el.scale.x)>smallimage.w)?smallimage.w:(parseInt(settings.zoomWidth/el.scale.x));
this.node.h=(parseInt((settings.zoomHeight)/el.scale.y)>smallimage.h)?smallimage.h:(parseInt(settings.zoomHeight/el.scale.y));
this.node.top=(smallimage.oh-this.node.h-2)/2;
this.node.left=(smallimage.ow-this.node.w-2)/2;
this.node.css({
top:0,
left:0,
width:this.node.w+'px',
height:this.node.h+'px',
position:'absolute',
display:'none',
borderWidth:1+'px'
});
if(settings.zoomType=='reverse'){
this.image.src=smallimage.node.src;
$(this.node).css({
'opacity':1
});
$(this.image).css({
position:'absolute',
display:'block',
left:-(this.node.left+1-smallimage.bleft)+'px',
top:-(this.node.top+1-smallimage.btop)+'px'
});
}
};
this.setcenter=function(){
this.node.top=(smallimage.oh-this.node.h-2)/2;
this.node.left=(smallimage.ow-this.node.w-2)/2;
this.node.css({
top:this.node.top,
left:this.node.left
});
if(settings.zoomType=='reverse'){
$(this.image).css({
position:'absolute',
display:'block',
left:-(this.node.left+1-smallimage.bleft)+'px',
top:-(this.node.top+1-smallimage.btop)+'px'
});
}
largeimage.setposition();
};
this.setposition=function(e){
el.mousepos.x=e.pageX;
el.mousepos.y=e.pageY;
var lensleft=0;
var lenstop=0;
function overleft(lens){
return el.mousepos.x-(lens.w)/2<smallimage.pos.l;
}
function overright(lens){
return el.mousepos.x+(lens.w)/2>smallimage.pos.r;
}
function overtop(lens){
return el.mousepos.y-(lens.h)/2<smallimage.pos.t;
}
function overbottom(lens){
return el.mousepos.y+(lens.h)/2>smallimage.pos.b;
}
lensleft=el.mousepos.x+smallimage.bleft-smallimage.pos.l-(this.node.w+2)/2;
lenstop=el.mousepos.y+smallimage.btop-smallimage.pos.t-(this.node.h+2)/2;
if(overleft(this.node)){
lensleft=smallimage.bleft-1;
}else if(overright(this.node)){
lensleft=smallimage.w+smallimage.bleft-this.node.w-1;
}
if(overtop(this.node)){
lenstop=smallimage.btop-1;
}else if(overbottom(this.node)){
lenstop=smallimage.h+smallimage.btop-this.node.h-1;
}
this.node.left=lensleft;
this.node.top=lenstop;
this.node.css({
'left':lensleft+'px',
'top':lenstop+'px'
});
if(settings.zoomType=='reverse'){
if($.browser.msie&&$.browser.version>7){
$(this.node).empty().append(this.image);
}
$(this.image).css({
position:'absolute',
display:'block',
left:-(this.node.left+1-smallimage.bleft)+'px',
top:-(this.node.top+1-smallimage.btop)+'px'
});
}
largeimage.setposition();
};
this.hide=function(){
img.css({
'opacity':1
});
this.node.hide();
};
this.show=function(){
if(settings.zoomType!='innerzoom'&&(settings.lens||settings.zoomType=='drag')){
this.node.show();
}
if(settings.zoomType=='reverse'){
img.css({
'opacity':settings.imageOpacity
});
}
};
this.getoffset=function(){
var o={};
o.left=$obj.node.left;
o.top=$obj.node.top;
return o;
};
return this;
};
function Stage(){
var $obj=this;
this.node=$("<div class='zoomWindow'><div class='zoomWrapper'><div class='zoomWrapperTitle'></div><div class='zoomWrapperImage'></div></div></div>");
this.ieframe=$('<iframe class="zoomIframe" src="javascript:\'\';" marginwidth="0" marginheight="0" align="bottom" scrolling="no" frameborder="0" ></iframe>');
this.setposition=function(){
this.node.leftpos=0;
this.node.toppos=0;
if(settings.zoomType!='innerzoom'){
switch(settings.position){
case "left":
this.node.leftpos=(smallimage.pos.l-smallimage.bleft-Math.abs(settings.xOffset)-settings.zoomWidth>0)?(0-settings.zoomWidth-Math.abs(settings.xOffset)):(smallimage.ow+Math.abs(settings.xOffset));
this.node.toppos=settings.yOffset;
break;
case "top":
this.node.leftpos=Math.abs(settings.xOffset);
this.node.toppos=(smallimage.pos.t-smallimage.btop-Math.abs(settings.yOffset)-settings.zoomHeight>0)?(0-settings.zoomHeight-Math.abs(settings.yOffset)):(smallimage.oh+Math.abs(settings.yOffset));
break;
case "bottom":
this.node.leftpos=Math.abs(settings.xOffset);
this.node.toppos=(smallimage.pos.t-smallimage.btop+smallimage.oh+Math.abs(settings.yOffset)+settings.zoomHeight<screen.height)?(smallimage.oh+Math.abs(settings.yOffset)):(0-settings.zoomHeight-Math.abs(settings.yOffset));
break;
default:
this.node.leftpos=(smallimage.rightlimit+Math.abs(settings.xOffset)+settings.zoomWidth<screen.width)?(smallimage.ow+Math.abs(settings.xOffset)):(0-settings.zoomWidth-Math.abs(settings.xOffset));
this.node.toppos=settings.yOffset;
break;
}
}
this.node.css({
'left':this.node.leftpos+'px',
'top':this.node.toppos+'px'
});
return this;
};
this.append=function(){
$('.zoomPad',el).append(this.node);
this.node.css({
position:'absolute',
display:'none',
zIndex:5001
});
if(settings.zoomType=='innerzoom'){
this.node.css({
cursor:'default'
});
var thickness=(smallimage.bleft==0)?1:smallimage.bleft;
$('.zoomWrapper',this.node).css({
borderWidth:thickness+'px'
});
}
$('.zoomWrapper',this.node).css({
width:Math.round(settings.zoomWidth)+'px',
borderWidth:thickness+'px'
});
$('.zoomWrapperImage',this.node).css({
width:'100%',
height:Math.round(settings.zoomHeight)+'px'
});
$('.zoomWrapperTitle',this.node).css({
width:'100%',
position:'absolute'
});
$('.zoomWrapperTitle',this.node).hide();
if(settings.title&&zoomtitle.length>0){
$('.zoomWrapperTitle',this.node).html(zoomtitle).show();
}
$obj.setposition();
};
this.hide=function(){
switch(settings.hideEffect){
case 'fadeout':
this.node.fadeOut(settings.fadeoutSpeed,function(){});
break;
default:
this.node.hide();
break;
}
this.ieframe.hide();
};
this.show=function(){
switch(settings.showEffect){
case 'fadein':
this.node.fadeIn();
this.node.fadeIn(settings.fadeinSpeed,function(){});
break;
default:
this.node.show();
break;
}
if(isIE6&&settings.zoomType!='innerzoom'){
this.ieframe.width=this.node.width();
this.ieframe.height=this.node.height();
this.ieframe.left=this.node.leftpos;
this.ieframe.top=this.node.toppos;
this.ieframe.css({
display:'block',
position:"absolute",
left:this.ieframe.left,
top:this.ieframe.top,
zIndex:99,
width:this.ieframe.width+'px',
height:this.ieframe.height+'px'
});
$('.zoomPad',el).append(this.ieframe);
this.ieframe.show();
};
};
};
function Largeimage(){
var $obj=this;
this.node=new Image();
this.loadimage=function(url){
loader.show();
this.url=url;
this.node.style.position='absolute';
this.node.style.border='0px';
this.node.style.display='none';
this.node.style.left='-5000px';
this.node.style.top='0px';
document.body.appendChild(this.node);
this.node.src=url;
};
this.fetchdata=function(){
var image=$(this.node);
var scale={};
this.node.style.display='block';
$obj.w=image.width();
$obj.h=image.height();
$obj.pos=image.offset();
$obj.pos.l=image.offset().left;
$obj.pos.t=image.offset().top;
$obj.pos.r=$obj.w+$obj.pos.l;
$obj.pos.b=$obj.h+$obj.pos.t;
scale.x=($obj.w/smallimage.w);
scale.y=($obj.h/smallimage.h);
el.scale=scale;
document.body.removeChild(this.node);
$('.zoomWrapperImage',el).empty().append(this.node);
lens.setdimensions();
};
this.node.onerror=function(){
alert('Problems while loading the big image.');
throw 'Problems while loading the big image.';
};
this.node.onload=function(){
$obj.fetchdata();
loader.hide();
el.largeimageloading=false;
el.largeimageloaded=true;
if(settings.zoomType=='drag'||settings.alwaysOn){
lens.show();
stage.show();
lens.setcenter();
}
};
this.setposition=function(){
var left=-el.scale.x*(lens.getoffset().left-smallimage.bleft+1);
var top=-el.scale.y*(lens.getoffset().top-smallimage.btop+1);
$(this.node).css({
'left':left+'px',
'top':top+'px'
});
};
return this;
};
$(el).data("jqzoom",obj);
};
$.jqzoom={
defaults:{
zoomType:'standard',
zoomWidth:300,
zoomHeight:300,
xOffset:10,
yOffset:0,
position:"right",
preloadImages:true,
preloadText:'Loading zoom',
title:true,
lens:true,
imageOpacity:0.4,
alwaysOn:false,
showEffect:'show',
hideEffect:'hide',
fadeinSpeed:'slow',
fadeoutSpeed:'2000'
},
disable:function(el){
var api=$(el).data('jqzoom');
api.disable();
return false;
},
enable:function(el){
var api=$(el).data('jqzoom');
api.enable();
return false;
},
disableAll:function(el){
jqzoompluging_disabled=true;
},
enableAll:function(el){
jqzoompluging_disabled=false;
}
};
})(jQuery);
;(function($,window,document,undefined){
var pluginName='smartGallery';
var defaultEasing="easeInQuad";
var animations={
'slide':function(cnt,dir,desc){
var curLeft=parseInt(cnt.css('left'),10);
var oldImageLeft=0;
if(dir=='left'){
oldImageLeft='-'+this.imageWrapperWidth+'px';
cnt.css('left',this.imageWrapperWidth+'px');
}
else{
oldImageLeft=this.imageWrapperWidth+'px';
cnt.css('left','-'+this.imageWrapperWidth+'px');
}
if(desc){
desc.css('bottom','-'+desc[0].offsetHeight+'px');
if(this.inWrapper){
desc.animate({bottom:0},this.options.animationSpeed*2);
}
}
if(this.currentDescription){
this.currentDescription.animate({bottom:'-'+this.currentDescription[0].offsetHeight+'px'},this.options.animationSpeed*2);
}
return{oldImage:{left:oldImageLeft},
newImage:{left:curLeft}};
},
'fade':function(cnt,dir,desc){
cnt.css('opacity',0);
return{oldImage:{opacity:0},
newImage:{opacity:1},
easing:'linear'};
},
'none':function(cnt,dir,desc){
cnt.css('opacity',0);
return{oldImage:{opacity:0},
newImage:{opacity:1},
speed:0};
}
}
function SmartGallery(element,options){
var self=this;
this.element=element;
var el=this.el=$(element);
var meta=$.metadata?$.metadata.get(element):{};
var opts=this.options=$.extend(true,{},options,meta||{});
this.init=function(){
this.setupElements();
if(opts.width){
this.imageWrapperWidth=opts.width;
this.imageWrapper.width(opts.width);
el.width(opts.width);
}
else{
this.imageWrapperWidth=this.imageWrapper.width();
}
this.imageWrapper.height(opts.height||400);
this.imageWrapperHeight=opts.height;
this.navDisplayWidth=this.nav.width();
this.currentIndex=0;
this.findImages();
if(this.options.box&&this.options.box.enabled){
this.initBox();
}
else{
this.imageWrapper.on("click",".sg-image > a",function(){
return self.fireCallback(self.options.callbacks.imageClick);
});
}
if(opts.displayImageNav){
this.initImageNav();
}
else{
this.imageWrapper.hide(0);
}
if(this.images.length>1){
this.initThumbNav();
}
else{
this.nav.hide(0);
}
if(opts.enableKeyboardMove){
this.initKeyEvents();
};
var startAt=parseInt(opts.startIndex,10);
if(window.location.hash&&window.location.hash.indexOf('#sg-image')===0){
startAt=window.location.hash.replace(/[^0-9]+/g,'');
if(!_.isNumber(startAt)){
startAt=opts.startIndex;
};
};
this.loading(true);
this.showImage(startAt);
};
this.initialized=false;
this.init();
this.initialized=true;
}
SmartGallery.prototype={
imageWrapper:null,
toolbar:null,
nav:null,
loader:null,
preloads:null,
thumbsWrapper:null,
zoomWrapper:null,
box:null,
imageWrapperWidth:0,
imageWrapperHeight:0,
currentIndex:0,
currentImage:null,
currentDescription:null,
navDisplayWidth:0,
navListWidth:0,
noScrollers:false,
images:null,
inTransition:false,
inWrapper:false,
scrollForward:null,
scrollBack:null,
origHtml:null,
setupElements:function(){
var el=this.el;
this.origHtml=this.el.outerHtml();
this.imageWrapper=el.find('.sg-image-wrapper').empty();
this.nav=el.find('.sg-nav').addClass("invisible");
this.thumbsWrapper=this.nav.find('.sg-thumbs');
this.preloads=$('<div class="sg-preloads"></div>');
this.loader=$('<img class="sg-loader" src="'+this.options.loaderImage+'">');
this.imageWrapper.append(this.loader);
this.loader.hide();
$(document.body).append(this.preloads);
},
loading:function(value){
if(value){
this.loader.show();
}
else{
this.loader.hide();
};
},
addAnimation:function(name,fn){
if($.isFunction(fn)){
animations[name]=fn;
};
},
findImages:function(){
var self=this;
this.images=[];
var thumbWrapperWidth=0;
var thumbsLoaded=0;
var thumbs=this.thumbsWrapper.find('a');
var thumbCount=thumbs.length;
if(this.options.thumbOpacity<1){
thumbs.find('img').css('opacity',this.options.thumbOpacity);
}
thumbs.each(function(i){
var link=$(this);
var imageSrc=link.attr('href');
var thumb=link.find('img');
if(!self.isImageLoaded(thumb[0])){
thumb.load(function(){
thumbWrapperWidth+=this.parentNode.parentNode.offsetWidth;
thumbsLoaded++;
});
}
else{
thumbWrapperWidth+=thumb[0].parentNode.parentNode.offsetWidth;
thumbsLoaded++;
}
link.addClass('sg-thumb'+i);
link.on({
'click':function(){
var fn=function(){};
if(!self.options.displayImageNav){
self._showBox(i);
}
self.showImage(i,fn);
return false;
},
'mouseenter':function(){
if(!$(this).is('.sg-active')&&self.options.thumbOpacity<1){
var img=$(this).find('img');
img.fadeTo(300,1);
};
self.preloadImage(i);
},
'mouseleave':function(){
if(!$(this).is('.sg-active')&&self.options.thumbOpacity<1){
var img=$(this).find('img');
img.fadeTo(300,self.options.thumbOpacity);
};
},
});
var s;
var href=false;
s=thumb.data('sg-link')||thumb.attr('rel')||thumb.attr('longdesc');
if(!s&&self.options.ensureLink){
s=link.attr("href");
}
if(s)href=s;
s="";
var title=false;
s=thumb.data('sg-title')||thumb.attr('title');
if(s)title=s;
thumb.removeAttr('title');
s="";
var desc=false;
s=thumb.data('sg-desc')||thumb.attr('alt');
if(s&&s!=title)desc=s;
self.images[i]={thumb:thumb.attr('src'),
image:imageSrc,
error:false,
preloaded:false,
desc:desc,
title:title,
size:false,
link:href};
});
var list=self.nav.find('.sg-thumb-list');
var setULWidth=function(){
if(thumbCount==thumbsLoaded){
var scrollers=self.nav.find('.scroll-button');
if(thumbWrapperWidth<=self.navDisplayWidth){
scrollers.each(function(){
$(this).parent().remove();
});
self.noScrollers=true;
list.css('left',(self.navDisplayWidth-thumbWrapperWidth)/2+'px');
}
else{
if(scrollers.length>0){
self.nav.addClass("has-buttons");
var parentHeight=scrollers.parent().innerHeight();
scrollers.height(parentHeight-scrollers.verticalCushioning());
}
}
list.css('width',(thumbWrapperWidth+1)+'px');
clearInterval(inter);
self.navListWidth=list.outerWidth(true);
self.nav.removeClass("invisible");
}
}
var inter=setInterval(setULWidth,50);
},
initKeyEvents:function(){
var self=this;
$(document).keydown(function(e){
if(e.keyCode==39){
self.nextImage();
}
else if(e.keyCode==37){
self.prevImage();
}
});
},
initImageNav:function(){
var self=this;
var speed=300;
var toolbar=this.initToolbar();
var toolbarHeight=toolbar[0].offsetHeight;
this.imageWrapper.on("mouseenter",function(){
self.showImagePanels(speed);
});
this.imageWrapper.on("mouseleave",function(){
self.hideImagePanels(speed);
});
},
showImagePanels:function(speed){
speed=speed||300;
var toolbar=this.toolbar;
this.inWrapper=true;
var el=this.imageWrapper;
var easing="easeOutQuad";
el.stop(true).animate({outlineColor:'#777'},500,"linear");
toolbar.css("opacity",0)
.stop(true)
.animate({top:0,opacity:0.6},speed,easing)
var desc=this.imageWrapper.children('.sg-image-description');
if(desc.length>0){
desc.css("opacity",0)
.stop(true)
.animate({bottom:0,opacity:1},speed,easing);
}
},
hideImagePanels:function(speed,callback){
speed=speed||300;
var toolbar=this.toolbar;
var toolbarHeight=toolbar[0].offsetHeight;
var el=this.imageWrapper;
var easing="easeInQuad";
var self=this;
el.stop(true).animate({outlineColor:'transparent'},speed,easing);
toolbar.stop(true).animate({top:toolbarHeight*-1,opacity:0},speed,easing,callback);
var desc=this.imageWrapper.children('.sg-image-description');
if(desc.length>0){
desc.stop(true).animate({bottom:desc[0].offsetHeight*-1,opacity:0},speed,easing);
}
self.deactivateZoom();
this.inWrapper=false;
},
initToolbar:function(){
var self=this;
var tools=['prev'];
if(this.options.zoom&&this.options.zoom.enabled){
tools.push('zoom');
}
if(this.options.extraTools){
var extraTools=_.isArray(this.options.extraTools)?this.options.extraTools:this.options.extraTools.split(" ");
$.each(extraTools,function(i,val){
tools.push(val);
});
}
tools.push('next');
var toolbar=this.toolbar=$('<div class="sg-icons invisible"></div>');
$.each(tools,function(i,val){
$('<a href="javascript:void(0)" class="sg-icon sg-icon-'+val+'"></a>').data("tool-id",val).appendTo(toolbar);
});
toolbar.prependTo(this.imageWrapper)
.removeClass("invisible")
.css('top','-'+toolbar[0].offsetHeight+'px');
toolbar.on("mouseenter mouseleave",".sg-icon",function(){
if(!$(this).attr("disabled"))$(this).toggleClass("sg-icon-hover");
});
toolbar.on("click",".sg-icon",function(){
var el=$(this);
if(el.attr("disabled"))return;
self.deactivateZoom();
var toolId=el.data("tool-id");
var fn=self.options.callbacks.toolClick;
var fnResult=true;
if($.isFunction(fn)){
fnResult=fn.call(el,toolId);
};
if(fnResult!==false){
switch(toolId){
case "prev":
self.prevImage();
break;
case "next":
self.nextImage();
break;
case "zoom":
self.activateZoom();
}
}
return false;
});
return toolbar;
},
activateZoom:function(){
if(!this.options.zoom||!this.options.zoom.enabled||!this.currentImage){
return;
}
var self=this;
var execute=function(){
var imgPanel=self.imageWrapper.css('overflow','visible')
.find('.sg-image')
.css('overflow','visible');
var link=imgPanel.find("a");
var origLink=link.clone(true,true);
var newLink=$(link.clone()).addClass("sg-zoom")
.attr("href",self.currentImage.find('img').attr('src'))
.data("origLink",origLink);
link.remove();
imgPanel.append(newLink);
self.zoomWrapper=newLink;
var opts=$.extend({},self.options.zoom);
var pos=imgPanel.position();
var realSize=self.images[self.currentIndex].size;
if(_.isEmpty(opts.zoomWidth)){
opts.zoomWidth=Math.min(realSize.width,toInt(self.imageWrapper.outerWidth())+100);
}
if(_.isEmpty(opts.zoomHeight)){
opts.zoomHeight=Math.min(realSize.height,toInt(self.el.outerHeight()));
}
if(_.isEmpty(opts.xOffset)){
opts.xOffset=self.imageWrapperWidth-(pos.left+imgPanel.width())+5;
}
if(_.isEmpty(opts.yOffset)){
opts.yOffset=0;
}
self.zoomWrapper.jqzoom(opts);
self.zoomWrapper.trigger("mousemove");
};
this.hideImagePanels(1,execute);
},
deactivateZoom:function(){
if(this.zoomWrapper){
var origLink=this.zoomWrapper.data("origLink");
this.zoomWrapper.remove();
this.imageWrapper.css('overflow','')
.find('.sg-image').css('overflow','').append(origLink);
this.zoomWrapper=null;
}
},
initThumbNav:function(){
var self=this;
this.scrollForward=$('<a href="#" data="{direction:\'right\'}" class="sb invisible">></a>');
this.scrollBack=$('<a href="#" data="{direction:\'left\'}" class="sb invisible"><</a>');
this.nav.prepend(this.scrollForward.wrap('<div class="sg-scroll-forward"></div>').parent());
this.nav.prepend(this.scrollBack.wrap('<div class="sg-scroll-back"></div>').parent());
var hasScrolled=0;
var thumbsScrollInterval=false;
this.nav.find(".sb").scrollButton({
nearSize:"100%",
farSize:"100%",
showButtonAlways:true,
autoPosition:false,
position:"outside",
offset:4,
handleCorners:false,
smallIcons:true,
hostFix:true,
click:function(dir){
var width=self.navDisplayWidth-80;
if(self.options.scrollJump>>>0){
width=self.options.scrollJump;
}
if(dir=='right'){
var left=self.thumbsWrapper.scrollLeft()+width;
}
else{
var left=self.thumbsWrapper.scrollLeft()-width;
}
self.thumbsWrapper.animate({scrollLeft:left+'px'},400,"easeOutQuad");
self._toggleScrollButtons(left);
return false;
},
enter:function(dir){
thumbsScrollInterval=setInterval(function(){
hasScrolled++;
var left=self.thumbsWrapper.scrollLeft()+1;
if(dir=='left'){
left=self.thumbsWrapper.scrollLeft()-1;
};
self.thumbsWrapper.scrollLeft(left);
self._toggleScrollButtons(left);
},10);
},
leave:function(dir){
hasScrolled=0;
clearInterval(thumbsScrollInterval);
}
});
},
initBox:function(){
var self=this;
this.box=$('<div class="sg-box"></div>').hide(0).appendTo(this.el);
$.each(this.images,function(i,img){
self.box.append(
'<a class="sg-box-item" href="{0}" title="{1}" rel="sg-box"></a>'.format(
img.link||img.image,
img.desc||img.title
)
);
});
this.box.find('a').colorbox({
rel:"sg-box",
onCleanup:function(){
}
});
if(this.options.displayImageNav){
this.imageWrapper.on("click",".sg-image > a",function(){
return self._showBox();
});
}
},
refreshDetailImage:function(src){
var self=this,
imgWrapper=this.imageWrapper,
image=imgWrapper.find('.sg-image img'),
newImgWidth="",
newImgHeight="";
image
.attr("src",src)
.removeAttr("width")
.removeAttr("height");
image.load(function(){
var newImage=imgWrapper.find('.sg-image img');
newImgWidth=newImage.width();
newImgHeight=newImage.height();
newImage.attr("width",newImgWidth).attr("height",newImgHeight);
imgWrapper.find('.sg-image').css({
'width':newImgWidth+'px',
'height':newImgHeight+'px'
});
self._centerImage(imgWrapper.find('.sg-image'),newImgWidth,newImgHeight);
if(imgWrapper.parent().attr('id')=='pd-gallery-big'){
imgWrapper.find('.sg-image a').attr('href',src);
}
});
},
_showBox:function(idx){
idx=idx===undefined?this.currentIndex:idx;
this.box.find('a:eq('+idx+')').click();
var fn=this.options.callbacks.imageClick;
return $.isFunction(fn)?fn.call(this):false;
},
_toggleScrollButtons:function(scrollLeft){
if(this.noScrollers)return;
var fwd=this.scrollForward,back=this.scrollBack;
var plugin,enabled=true;
scrollLeft=scrollLeft!==undefined?scrollLeft:this.thumbsWrapper.scrollLeft();
var listWidth=this.navListWidth||this.nav.find('.sg-thumb-list').outerWidth(true);
if(fwd){
enabled=(this.navDisplayWidth-(listWidth-scrollLeft))<0;
plugin=fwd.data("ScrollButton");
plugin.enable(enabled);
}
if(back){
enabled=scrollLeft>0;
plugin=back.data("ScrollButton");
plugin.enable(enabled);
}
},
_getContainedImageSize:function(imageWidth,imageHeight){
var ratio=0;
if(imageHeight>this.imageWrapperHeight){
ratio=imageWidth/imageHeight;
imageHeight=this.imageWrapperHeight;
imageWidth=this.imageWrapperHeight*ratio;
};
if(imageWidth>this.imageWrapperWidth){
ratio=imageHeight/imageWidth;
imageWidth=this.imageWrapperWidth;
imageHeight=this.imageWrapperWidth*ratio;
};
return{width:imageWidth,height:imageHeight};
},
_centerImage:function(imgContainer,imageWidth,imageHeight){
imgContainer.css('top','0px');
if(imageHeight<this.imageWrapperHeight){
var dif=this.imageWrapperHeight-imageHeight;
imgContainer.css('top',(dif/2)+'px');
};
imgContainer.css('left','0px');
if(imageWidth<this.imageWrapperWidth){
var dif=this.imageWrapperWidth-imageWidth;
imgContainer.css('left',(dif/2)+'px');
};
},
_createDescription:function(image){
var desc=null;
if(image.desc.length||image.title.length){
var title='';
if(image.title.length){
title='<strong class="sg-description-title ellipsis" title="{0}">{0}</strong>'.format(image.title);
};
var desc='';
if(image.desc.length){
desc='<span>'+image.desc+'</span>';
};
desc=$('<div class="sg-image-description">'+title+desc+'</div>');
};
return desc;
},
showImage:function(index,callback){
if(this.images[index]&&!this.inTransition){
var self=this;
var image=this.images[index];
this.inTransition=true;
if(!image.preloaded){
this.loading(true);
this.preloadImage(index,function(){
self.loading(false);
self._showWhenLoaded(index,callback);
});
}
else{
this._showWhenLoaded(index,callback);
};
};
},
_showWhenLoaded:function(index,callback){
if(!this.images[index])return;
var self=this;
var image=this.images[index];
var imgContainer=$(document.createElement('div')).addClass('sg-image');
var img=$(new Image()).attr('src',image.image);
if(image.link){
var link=$('<a href="'+image.link+'" target="_blank"></a>');
link.append(img);
imgContainer.append(link);
}
else{
imgContainer.append(img);
}
this.imageWrapper.prepend(imgContainer);
var size=this._getContainedImageSize(image.size.width,image.size.height);
img.attr('width',size.width);
img.attr('height',size.height);
imgContainer.css({width:size.width+'px',height:size.height+'px'});
this._centerImage(imgContainer,size.width,size.height);
if(self.options.enableDescription){
var desc=this._createDescription(image,imgContainer);
if(desc){
this.imageWrapper.append(desc);
var width=this.imageWrapper.width()-parseInt(desc.css('padding-left'),10)-parseInt(desc.css('padding-right'),10);
desc.css('width',width+'px');
desc.css('bottom','-'+desc[0].offsetHeight+'px');
};
}
this.highlightThumb(this.nav.find('.sg-thumb'+index));
var direction='right';
if(this.currentIndex<index){
direction='left';
};
var toggleNavButton=function(){
var length=self.images.length;
if(self.options.cycle&&length>1)return;
var cls="o30";
var toggle=function(tool,enabled){
if(!enabled)tool.removeClass("sg-icon-hover");
enabled?tool.removeClass(cls).removeAttr("disabled"):tool.addClass(cls).attr("disabled","disabled");
};
toggle(self.toolbar.find(".sg-icon-prev"),length>1&&index>0);
toggle(self.toolbar.find(".sg-icon-next"),length>1&&index+1<length);
};
if(this.currentImage){
var animationSpeed=this.options.animationSpeed;
var easing=defaultEasing;
var animation=(animations[this.options.animation]||animations['none']).call(this,imgContainer,direction,desc);
if(typeof animation.speed!='undefined'){
animationSpeed=animation.speed;
};
if(typeof animation.easing!='undefined'){
easing=animation.easing;
};
var oldImage=this.currentImage;
var oldDescription=this.currentDescription;
oldImage.animate(animation.oldImage,animationSpeed,easing,function(){
oldImage.remove();
if(oldDescription)oldDescription.remove();
});
imgContainer.animate(animation.newImage,animationSpeed,easing,function(){
self.currentIndex=index;
self.currentImage=imgContainer;
self.currentDescription=desc;
self.inTransition=false;
self.fireCallback(callback);
toggleNavButton();
});
}
else{
this.currentIndex=index;
this.currentImage=imgContainer;
this.currentDescription=desc;
this.inTransition=false;
this.fireCallback(callback);
toggleNavButton();
};
},
nextIndex:function(){
if(this.currentIndex==(this.images.length-1)){
if(!this.options.cycle){
return false;
};
var next=0;
}
else{
var next=this.currentIndex+1;
};
return next;
},
nextImage:function(callback){
var next=this.nextIndex();
if(next===false)return false;
this.preloadImage(next+1);
this.showImage(next,callback);
return true;
},
prevIndex:function(){
if(this.currentIndex==0){
if(!this.options.cycle){
return false;
};
var prev=this.images.length-1;
}
else{
var prev=this.currentIndex-1;
};
return prev;
},
prevImage:function(callback){
var prev=this.prevIndex();
if(prev===false)return false;
this.preloadImage(prev-1);
this.showImage(prev,callback);
return true;
},
preloadAll:function(){
var self=this;
var i=0;
function preloadNext(){
if(i<self.images.length){
i++;
self.preloadImage(i,preloadNext);
};
};
self.preloadImage(i,preloadNext);
},
preloadImage:function(index,callback){
if(this.images[index]){
var image=this.images[index];
if(!this.images[index].preloaded){
var img=$(new Image());
img.attr('src',image.image);
if(!this.isImageLoaded(img[0])){
this.preloads.append(img);
var self=this;
img.load(function(){
image.preloaded=true;
image.size={width:this.width,height:this.height};
self.fireCallback(callback);
})
.error(function(){
image.error=true;
image.preloaded=false;
image.size=false;
});
}
else{
image.preloaded=true;
image.size={width:img[0].width,height:img[0].height};
this.fireCallback(callback);
};
}
else{
this.fireCallback(callback);
};
};
},
isImageLoaded:function(img){
if(typeof img.complete!='undefined'&&!img.complete){
return false;
};
if(typeof img.naturalWidth!='undefined'&&img.naturalWidth==0){
return false;
};
return true;
},
highlightThumb:function(thumb){
this.thumbsWrapper.find('.sg-active').removeClass('sg-active');
thumb.addClass('sg-active');
if(this.options.thumbOpacity<1){
this.thumbsWrapper.find('a:not(.sg-active) img').fadeTo(300,this.options.thumbOpacity);
thumb.find('img').fadeTo(300,1);
};
if(!this.noScrollers){
var left=thumb[0].parentNode.offsetLeft;
left-=(this.navDisplayWidth/ 2)-(thumb[0].offsetWidth/ 2);
this.thumbsWrapper.animate({scrollLeft:left+'px'});
this._toggleScrollButtons(left);
}
},
fireCallback:function(fn){
if($.isFunction(fn)){
return fn.call(this);
};
}
}
$.provide('$.'+pluginName);
$[pluginName].defaults={
loaderImage:"",
startIndex:0,
thumbOpacity:0.7,
animation:"slide",
animationSpeed:400,
width:null,
height:null,
displayImageNav:true,
scrollJump:0,
cycle:true,
enableDescription:true,
enableKeyboardMove:true,
ensureLink:true,
extraTools:"enlarge",
zoom:{
enabled:true,
title:false,
showEffect:'fadein',
hideEffect:'fadeout',
fadeInSpeed:1200,
fadeOutSpeed:1200
},
box:{
enabled:true
},
callbacks:{
imageClick:null,
thumbClick:null,
toolClick:null
}
}
$.fn[pluginName]=function(options){
return this.each(function(){
if(!$.data(this,'plugin_'+pluginName)){
options=$.extend(true,{},$[pluginName].defaults,options);
$.data(this,'plugin_'+pluginName,new SmartGallery(this,options));
}
});
}
})(jQuery,window,document);
window.fbAsyncInit=function(){
FB.init({
appId:'',
status:'',
cookie:'',
xfbml:true,
channelUrl:''
});
};
(function(d,s,id){
jQuery(document).ready(function(){
if(d.getElementById('fb-root')){
return;
}
var fbRoot=d.createElement('div');
fbRoot.id='fb-root';
d.body.appendChild(fbRoot);
});
var js,
fjs=d.getElementsByTagName(s)[0];
if(d.getElementById(id)){
return;
}
js=d.createElement(s);
js.id=id;
js.src=(document.location.protocol=='https:'?'https:':'http:')+'//connect.facebook.net/de_DE/all.js';
js.async=true;
fjs.parentNode.insertBefore(js,fjs);
}(document,'script','facebook-jssdk'));
/*
jQuery(document).ready(function(){
var e=document.createElement('div');
e.id='fb-root';
document.body.appendChild(e);
e=document.createElement('script');
e.src=(document.location.protocol=='https:'?'https:':'http:')+'//connect.facebook.net/de_DE/all.js';
e.async=true;
document.getElementById('fb-root').appendChild(e);
});
*/
