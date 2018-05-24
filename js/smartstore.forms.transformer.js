(function($){
function SForm2TXT(){
this.version="1.0";
};
SForm2TXT.prototype.decode=function($dt){
var $f=$ds=$s=$dv=$fe=$o=null;
if($dt.indexOf("=")){
$f=document.forms[$dt.substring(0,$dt.indexOf("="))];
if($f!=null){
$dt=SX_uEsc($dt.substring($dt.indexOf("=")+1));
$ds=$dt.split("##");
for(var i=0;i<$ds.length;i++){
$s=$ds[i];
$dv=$s.split("|");
for(var j=0;j<$dv.length;j++)$dv[j]=SX_uEsc($dv[j].replace(/_X8/g,";"));
$fe=$f.elements[$dv[0]];
if($fe!=null){
if($fe.type==$dv[1]){
switch($fe.type){
case "checkbox":
$fe.checked=($dv[2]=="true");
break;
case "select-one":
for(var j=0;j<$fe.options.length;j++){
$o=$fe.options[j];
if($o.value==$dv[2]){
$o.selected=true;
if($dv[0]=="BILLTO_COUNTRY")SMShop.setActiveRegionByISOCode($dv[2]);
}
else $o.selected=false;
};
break;
case "select-multiple":
for(var j=0;j<$fe.options.length;j++){
$o=$fe.options[j];
$o.selected=false;
for(var k=2;k<$dv.length;k=k+2){
if($dv[k]==$o.value){
$o.selected=true;
break;
};
};
};
break;
default:
$fe.value=$dv[2];
break;
};
}
else if($fe.length!=0){
for(var j=0;j<$fe.length;j++){
if($fe[j].type==$dv[1])$fe[j].checked=($fe[j].value==$dv[2]);
};
};
};
};
};
};
};
SForm2TXT.prototype.encodeElement=function(){
var $dt="",$ag=arguments;
for(var i=0;i<$ag.length;i++)
$dt+=(($dt!="")?"|":"")+SX_esc($ag[i]).replace(/;/g,"_X8");
return($dt);
};
SForm2TXT.prototype.writeToCookie=function($f){
var $dt=new Date();
$dt.setTime($dt.getTime()+2592000000);
document.cookie=this.encode($f)+";expires="+$dt.toGMTString();
};
SForm2TXT.prototype.readFromCookie=function($n){
var $t=this,$data=document.cookie,$found=false;
$data=$data.split(";")
for(var i=0;i<$data.length;i++){
while($data[i].charAt(0)==" ")$data[i]=$data[i].substring(1);
if($data[i].substring(0,$n.length)==$n){
$data=$data[i];
$found=true;break;
};
};
if($found){
$t.decode($data);
return true;
};
return false;
};
SForm2TXT.prototype.encode=function($f){
var $t=this,$dt="",$o=null,$ag=null,$e=null;
for(var i=0;i<$f.elements.length;i++){
$e=$f.elements[i];
if($e.type!="button"&&$e.type!="submit"&&$e.type!="reset"){
if($e.type=="radio"){
if($e.checked){
if($dt!="")$dt+="##";
$dt+=$t.encodeElement($e.name,$e.type,$e.value,$e.title);
};
}
else{
if($dt!="")$dt+="##";
switch($e.type){
case "checkbox":
$dt+=$t.encodeElement($e.name,$e.type,(($e.checked)?"true":"false"),(($e.checked)?T["txt.yes"]:T["txt.no"]));
break;
case "select-one":
if($e.options.length>0&&$e.selectedIndex!=-1){
$o=$e.options[$e.options.selectedIndex];
$dt+=$t.encodeElement($e.name,$e.type,jQuery($o).val(),jQuery($o).text());
}
break;
case "select-multiple":
$ag=new Array();
$ag[0]=$e.name;
$ag[1]=$e.type;
for(var j=0;j<$e.options.length;j++){
$o=$e.options[j];
if($o.selected){
$ag[$ag.length]=$o.value;
$ag[$ag.length]=$o.text;
};
};
$dt+=$t.encodeElement.apply(null,$ag);
break;
default:
$dt+=$t.encodeElement($e.name,$e.type,$e.value);
break;
};
};
};
};
$dt=$f.name+"="+SX_esc($dt);
return($dt);
};
window.Form2TXT=$.Form2TXT=new SForm2TXT();
})(jQuery);
(function($){
function SForm2XML(){
this.version="1.0";
};
SForm2XML.prototype.decode=function($xd){
var $an="name",$av="value",$at="type",$e=null,
$xe=null,$f=document.forms[$xd.getAttribute($an)];
if($f!=null){
for(var i=0;i<$f.elements.length;i++){
$e=$f.elements[i];
if($e.type=="radio"){
$e.checked=false;
for(var j=0;j<$xd.childNodes.length();j++){
$xe=$xd.childNodes.item(j);
if($xe.getAttribute($at)==$e.type&&$e.value==$xe.getAttribute($av)){
$e.checked=true;
break;
};
};
}
else{
for(var j=0;j<$xd.childNodes.length();j++){
$xe=$xd.childNodes.item(j);
if($xe.getAttribute($an)==$e.name){
switch($e.type){
case "checkbox":
$e.checked=(($xe.getAttribute($av)=="true")?true:false);
break;
case "select-one":
for(var k=0;k<$e.options.length;k++){
$e.options[k].selected=($xe.getAttribute($av)==$e.options[k].value)
};
break;
case "select-multiple":
for(var k=0;k<$e.options.length;k++){
$e.options[k].selected=false;
for(var l=0;l<$xe.childNodes.length();l++){
if($xe.childNodes.item(l).getAttribute($av)==$e.options[k].value){
$e.options[k].selected=true;
break;
};
};
};
break;
case "password":
break;
default:
$e.value=$xe.text;
break;
};
};
};
};
};
};
};
SForm2XML.prototype.attachFormToXML=function($f,$p){
var $x=this.encode($f),$c=$xo=null;
for(var i=0;i<$p.childNodes.length();i++){
$c=$p.childNodes.item(i);
if($c.baseName=="form"&&$c.getAttribute("name")==$x.getAttribute("name")){
$xo=$c;
break;
};
};
if($xo!=null){
$p.replaceChild($x,$xo);
}
else $p.appendChild($x);
};
SForm2XML.prototype.detachFormFromXML=function($n,$p){
var $c=$x=null;
for(var i=0;i<$p.childNodes.length();i++){
$c=$p.childNodes.item(i);
if($c.baseName=="form"&&$c.getAttribute("name")==$n){
$x=$c;
break;
};
};
if($x!=null){
this.decode($x);
return(true);
}
else return(false);
};
SForm2XML.prototype.doNotEncodeElement=function($e){
try
{
return((/^dtDate\w+?_/).test($e.name)||$e.name=="save-form-values"||$e.tagName.toLowerCase()=="fieldset"||(($e.type=="text"||$e.type=="textarea")&&$e.value==""));
}
catch(e)
{
return true;
}
};
SForm2XML.prototype.encode=function($f){
var $e=null,$x=new SXMLDom(),$xd=null,
$xe=null,$xo=null,$o=null,$av="value",
$an="name",$ae="element",$at="type",$cp="caption",
$lbl=null,el=null,elName="",value="";
$xd=$x.documentElement=$x.createNode("form");
$xd.setAttribute($an,jQuery($f).attr("name"));
for(var i=0;i<$f.elements.length;i++){
$e=$f.elements[i];
if(this.doNotEncodeElement($e)){continue};
el=jQuery($e);
elName=el.attr("name");
if($e.type=="radio"){
$lbl=jQuery("#"+$f.name+" label[for='"+elName+"']")[0];
}
else if($e.type=="checkbox"){
$lbl=jQuery("#"+$f.name+" #LBL_"+elName+" span")[0];
}
else{
$lbl=jQuery("#"+$f.name+" label[for="+elName+"]")[0];
}
if($e.type=="radio"&&el.is(":checked")){
$xe=$x.createNode($ae);
$xe.setAttribute($an,elName);
$xe.setAttribute($at,$e.type);
$xe.setAttribute($av,$e.value);
if($lbl){
$xe.setAttribute($cp,jQuery($lbl).text());
}
$xe.text=el.closest('label').find('span').text();
$xd.appendChild($xe);
}else if($e.type!="button"&&$e.type!="submit"&&$e.type!="reset"&&$e.type!="radio"){
$xe=$x.createNode($ae);
$xe.setAttribute($an,elName);
$xe.setAttribute($at,$e.type);
if($lbl&&$e.type!="checkbox")$xe.setAttribute($cp,$($lbl).text());
switch($e.type){
case "checkbox":
$xe.setAttribute($av,(el.is(":checked")?"true":"false"));
if($lbl)$xe.setAttribute($cp,$($lbl).text());
$xe.text=(el.is(":checked")?T["txt.yes"]:T["txt.no"]);
break;
case "select-one":
if($e.options.length>0&&$e.selectedIndex!=-1){
$o=$e.options[$e.selectedIndex];
$xe.setAttribute($cp,$('#'+$f.name+' label[for="'+elName+'-button"]').text());
$xe.setAttribute($av,$($o).val());
$xe.text=$($o).text();
};
break;
case "select-multiple":
for(var j=0;j<$e.options.length;j++){
$o=$e.options[j];
if($o.selected){
$o=$e.options[j];
value+=$o.text+', ';
$xe.setAttribute($av,$o.value);
$xe.setAttribute($cp,$('#'+$f.name+' label[for="'+elName+'"]').text());
};
};
$xe.text=value;
break;
case "fieldset":
continue;
break;
default:
$xe.text=$e.value;
break;
};
$xd.appendChild($xe);
};
};
return($xd);
};
window.Form2XML=$.Form2XML=new SForm2XML();
})(jQuery);
