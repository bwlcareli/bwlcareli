<?php
	session_start();
	$buttonsource = $_SESSION['buttonsource'];
	
	require_once 'constants.php5';
	
	session_start();
	
	$token =urlencode( $_POST['TOKEN']);
	$payerID = urlencode($_POST['PAYERID']);
	$paymentAmount =urlencode ($_POST['AMT']);
	$paymentType = urlencode($_POST['PAYMENTACTION']);
	$currCodeType = urlencode($_POST['CURRENCY']);
	$invnum = $_POST["invnum"];
	$serverName = urlencode($_SERVER['SERVER_NAME']);
	
	#ShipTo Address
	$shipToName = urlencode($_POST['SHIPTONAME']);
	$shipToStreet = urlencode($_POST['SHIPTOSTREET']);
	$shipToStreet2 = urlencode($_POST['SHIPTOSTREET2']);
	$shipToCity = urlencode($_POST['SHIPTOCITY']);
	$shipToCountry = urlencode($_POST['SHIPTOCOUNTRY']);
	$shipToPhoneNum = urlencode($_POST['SHIPTOPHONENUM']);
	$shipToZip = urlencode($_POST['SHIPTOZIP']);
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, API_ENDPOINT);
	curl_setopt($ch, CURLOPT_VERBOSE, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch, CURLOPT_POST, 1);
	
	if(USE_PROXY)
	curl_setopt ($ch, CURLOPT_PROXY, PROXY_HOST.":".PROXY_PORT);
	
	$nvpreq="METHOD=DoExpressCheckoutPayment"
	."&VERSION=".urlencode(VERSION)
	."&PWD=".urlencode(API_PASSWORD)
	."&USER=".urlencode(API_USERNAME)
	."&SIGNATURE=".urlencode(API_SIGNATURE)
	.'&TOKEN='.$token
	.'&PAYERID='.$payerID
	.'&PAYMENTACTION='.$paymentType
	.'&AMT='.$paymentAmount
	.'&CURRENCYCODE='.$currCodeType
	."&INVNUM=".urlencode($invnum)
	.'&SHIPTONAME='.$shipToName
	.'&SHIPTOSTREET='.$shipToStreet
	.'&SHIPTOSTREET2='.$shipToStreet2
	.'&SHIPTOCITY='.$shipToCity
	.'&SHIPTOCOUNTRY='.$shipToCountry
	.'&SHIPTOPHONENUM='.$shipToPhoneNum
	.'&SHIPTOZIP='.$shipToZip
	.'&IPADDRESS='.$serverName;
	
	if ($buttonsource != "")
		$nvpreq.="&BUTTONSOURCE=".$buttonsource;
	else 
		$nvpreq.="&BUTTONSOURCE=CART_SMARTSTORE_ECS_DE";
	
	curl_setopt($ch,CURLOPT_POSTFIELDS,$nvpreq);
	
	$response = curl_exec($ch);
	
	$nvpResArray=deformatNVP($response);
	$nvpReqArray=deformatNVP($nvpreq);
	
	if (curl_errno($ch)) {
		echo curl_error($ch);
	} else {
		curl_close($ch);
	}
	
	$ack = strtoupper($nvpResArray["ACK"]);
	
	#if($ack!="SUCCESS")
		echo $response;
	
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
