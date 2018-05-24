<?php
	
	if (!empty($_POST["buttonsource"]))
		$buttonsource = $_POST["buttonsource"];
	
	if(session_id() == '') {
	    session_start();
	}
	
	$_SESSION['buttonsource'] = $buttonsource;
	
	require_once 'constants.php5';
	
	$user = API_USERNAME;
	$pwd = API_PASSWORD;
	$version = VERSION;
	$signature = API_SIGNATURE;
	
	$cmd = $_POST["cmd"];
	$method = $_POST["method"];
	$amt = $_POST["amt"];
	$returnurl = $_POST["returnurl"];
	$cancelurl = $_POST["cancelurl"];
	
	$currencycode = $_POST["currencycode"];
	#$maxamt = $_POST["maxamt"];
	#$paymentaction = $_POST["paymentaction"];
	#$email = $_POST["email"];
	#$desc = $_POST["desc"];
	#$custom = $_POST["custom"];
	$invnum = $_POST["invnum"];
	#$reqconfirmshipping = $_POST["reqconfirmshipping"];
	#$noshipping = $_POST["noshipping"];
	$addroverride = $_POST["addroverride"];
	#$token = $_POST["token"];
	#$localecode = $_POST["localecode"];
	#$pagestyle = $_POST["pagestyle"];
	#$ShippingAddress = $_POST["ShippingAddress"];
	
	$hdrimg = $_POST["hdrimg"];
	$hdrbordercolor = $_POST["hdrbordercolor"];
	$hdrbackcolor = $_POST["hdrbackcolor"];
	$payflowcolor = $_POST["payflowcolor"];
	
	$shiptoname = $_POST["shiptoname"];
	$shiptostreet = $_POST["shiptostreet"];
	$shiptostreet2 = $_POST["shiptostreet2"];
	$shiptocity = $_POST["shiptocity"];
	$shiptostate = $_POST["shiptostate"];
	$shiptozip = $_POST["shiptozip"];
	$shiptocountry  = $_POST["shiptocountry"];
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, API_ENDPOINT);
	curl_setopt($ch, CURLOPT_VERBOSE, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch, CURLOPT_POST, 1);
	if(USE_PROXY)
	curl_setopt ($ch, CURLOPT_PROXY, PROXY_HOST.":".PROXY_PORT);
	
	$nvpreq="METHOD=".urlencode($method)
	."&VERSION=".urlencode($version)
	."&PWD=".urlencode($pwd)
	."&USER=".urlencode($user)
	."&SIGNATURE=".urlencode($signature)
	."&AMT=".urlencode($amt)
	."&RETURNURL=".urlencode($returnurl)
	."&CANCELURL=".urlencode($cancelurl)
	."&HDRIMG=".urlencode($hdrimg)
	."&HDRBORDERCOLOR=".urlencode($hdrbordercolor)
	."&HDRBACKCOLOR=".urlencode($hdrbackcolor)
	."&PAYFLOWCOLOR=".urlencode($payflowcolor)
	."&CURRENCYCODE=".urlencode($currencycode)
	."&INVNUM=".urlencode($invnum)
	."&MAXAMT=".urlencode($maxamt)
	."&PAYMENTACTION=".urlencode($paymentaction);
	if ($email != "") $nvpreq .= "&EMAIL=".urlencode($email);
	if ($desc != "") $nvpreq .= "&DESC=".urlencode($desc);
	if ($custom != "") $nvpreq .= "&CUSTOM=".urlencode($custom);
	if ($invnum != "") $nvpreq .= "&INVNUM=".urlencode($invnum);
	
	$nvpreq .= "&REQCONFIRMSHIPPING=".urlencode($reqconfirmshipping)
	."&NOSHIPPING=".urlencode($noshipping)
	."&ADDROVERRIDE=".urlencode($addroverride);
	
	if ($shiptoname != "") $nvpreq .= "&SHIPTONAME=".urlencode($shiptoname);
	if ($shiptostreet != "") $nvpreq .= "&SHIPTOSTREET=".urlencode($shiptostreet);
	if ($shiptostreet2 != "") $nvpreq .= "&SHIPTOSTREET2=".urlencode($shiptostreet2);
	if ($shiptocity != "") $nvpreq .= "&SHIPTOCITY=".urlencode($shiptocity);
	if ($shiptocountry != "") $nvpreq .= "&SHIPTOCOUNTRY=".urlencode($shiptocountry);
	if ($shiptozip != "") $nvpreq .= "&SHIPTOZIP=".urlencode($shiptozip);
	
	if ($token != "") $nvpreq .= "&TOKEN=".urlencode($token);
	$nvpreq .= "&LOCALECODE=".urlencode($localecode)
	."&PAGESTYLE=".urlencode($pagestyle);
	
	//setting the nvpreq as POST FIELD to curl
	curl_setopt($ch,CURLOPT_POSTFIELDS,$nvpreq);
	
	//getting response from server
	$response = curl_exec($ch);
	
	//converting NVPResponse to an Associative Array
	$nvpResArray=deformatNVP($response);
	$nvpReqArray=deformatNVP($nvpreq);
	$nvpResArray=$response;
	$_SESSION['nvpReqArray']=$nvpReqArray;
	
	if (curl_errno($ch)) {
		echo curl_error($ch);
	} else {
		curl_close($ch);
	}
	
	echo $nvpResArray;
	
	function deformatNVP($nvpstr)
	{
		$intial=0;
	 	$nvpArray = array();
		while(strlen($nvpstr)){
			//postion of Key
			$keypos= strpos($nvpstr,'=');
			//position of value
			$valuepos = strpos($nvpstr,'&') ? strpos($nvpstr,'&'): strlen($nvpstr);
			/*getting the Key and Value values and storing in a Associative Array*/
			$keyval=substr($nvpstr,$intial,$keypos);
			$valval=substr($nvpstr,$keypos+1,$valuepos-$keypos-1);
			//decoding the respose
			$nvpArray[urldecode($keyval)] =urldecode( $valval);
			$nvpstr=substr($nvpstr,$valuepos+1,strlen($nvpstr));
	     }
		return $nvpArray;
	}

?>