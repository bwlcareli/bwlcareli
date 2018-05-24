<html>

<head></head>

<body>

<?php
	#phpinfo();
	
	#$ch = curl_init();
	
	if (!function_exists("curl_init")){
		echo "Curl ist auf diesem Server nicht installiert, bitt wenden Sie sich an Ihren Provider.<br>";
	} else {
		echo "Curl ist ordnungsgemäß installiert.<br>";
	}
	
	if (!function_exists("openssl_open")){
		echo "OpenSSL ist auf diesem Server nicht installiert, bitt wenden Sie sich an Ihren Provider.";
	} else {
		echo "OpenSSL ist ordnungsgemäß installiert.";
	}
	
?>

</body>

</html>
