function SFormDisplay(){
var $t=this;
$t.cs=new Array();
$t.itemPadding=3;
$t.itemSpacing=0;
};
SFormDisplay.prototype.addControl=function(){
var $t=this,$a=arguments;
$t.cs[$t.cs.length]=new Array($a[0],$a[1],$a[2],$a[3],$a[4]);
};
SFormDisplay.prototype.render=function(){
var $t=this,$cs=$t.cs,$c=null,$r="",$hc=false,$h="",$nobr=false;
for(var i=0;i<$cs.length;i++){
$c=$cs[i];
if($c[3]=="separator"){
$hc=($c[1]!="");
if($hc){
if($nobr){
$r+="</td></tr>";
$nobr=false;
};
$r+='<tr><th colspan="2">'+$c[1]+'</th></tr>';
};
}else{
if(!$nobr)
$r+="<tr><td>";
else
$r+="&nbsp;";
if($c[2]!=""||!$hc)
$r+=$c[1];
if(!$nobr)
$r+="</td><td>";
$r+=$c[2];
$hc=($hc||$c[2]!="");
$nobr=($c[4]&&(i!=$cs.length-1));
if(!$nobr)$r+="</td></tr>";
};
if(!$nobr&&$hc){
$h+=$r;
$hc=false;
$r="";
}else if(!$nobr&&!$hc){
$r="";
}
};
if($h!="")
$h='<table id="'+$t.id+'" cellspacing="'+$t.itemSpacing+'" cellpadding="'+$t.itemPadding+'">'+$h+'</table>';
return($h);
};
