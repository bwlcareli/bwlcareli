<?php

	require_once 'constants.php5';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, API_ENDPOINT);
	curl_setopt($ch, CURLOPT_VERBOSE, 1);
	
	//turning off the server and peer verification(TrustManager Concept).
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch, CURLOPT_POST, 1);
    	
	//if USE_PROXY constant set to TRUE in Constants.php, then only proxy will be enabled.
   	//Set proxy name to PROXY_HOST and port number to PROXY_PORT in constants.php 
	
	if(USE_PROXY)
	curl_setopt ($ch, CURLOPT_PROXY, PROXY_HOST.":".PROXY_PORT); 
	
	$nvpreq="METHOD=".urlencode("GetExpressCheckoutDetails")
	."&VERSION=".urlencode(VERSION)
	."&PWD=".urlencode(API_PASSWORD)
	."&USER=".urlencode(API_USERNAME)
	."&SIGNATURE=".urlencode(API_SIGNATURE)
	."&TOKEN=".urlencode($_POST['token']);
	
	//setting the nvpreq as POST FIELD to curl
	curl_setopt($ch,CURLOPT_POSTFIELDS,$nvpreq);
	
	//getting response from server
	$response = curl_exec($ch);
	
	//converting NVPResponse to an Associative Array
	$nvpReqArray=deformatNVP($nvpreq);
	$nvpResArray=urldecode($response);
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