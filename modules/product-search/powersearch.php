<?php
	function SMEncodeURI($pText){
		$mRetVal = "";
		$aExps = Array('\*', '\+', '\-', '\.', '\/', '\_', '\@', '\&', '\;', "\'", '\%');
		$aChar = Array("%X0", "%X1", "%X2", "%X3", "%X4", "%X5", "%X6", "%X7", "%X8", "%X9", "_");
		if($pText){
			$mRetVal = urlencode($pText);
			for($i=0; $i<sizeof($aExps); $i++){
				$mRetVal = ereg_replace($aExps[$i], $aChar[$i], $mRetVal);
			};
		};
		return($mRetVal);
	};

	function searchterms_in_searchstring($searchterms, $searchstring, $method='and', $metaphone=false){
		$matchcount = 0;
		if($metaphone) $searchstring = metaphone($searchstring);
		for($i=0;$i<sizeof($searchterms);$i++){
			if(!empty($searchterms[$i])){
				if($metaphone){
					if(stristr($searchstring, $searchterms[$i])){
						$matchcount++;
					};
				} else {
					if(stristr($searchstring, $searchterms[$i])){
						$matchcount++;
					};
				};
				if($method == "or" and $matchcount > 0) break;
			};
		};
		$result = (($method == "and" and $matchcount == sizeof($searchterms)) or ($method == "or" and $matchcount > 0));
		//$result = ($matchcount == sizeof($searchterms)); // and
		//$result = ($matchcount > 0); // or
		return($result);
	};

	function get_field_index($fieldnames, $fieldname){
		$fields = explode(';', $fieldnames);
		$fieldname = strtoupper($fieldname);
		for($i=0;$i<sizeof($fields);$i++){
			if(strtoupper($fields[$i]) == $fieldname){
				return($i);
			};
		};
	};

	function do_search($searchindex, $searchterms, &$fieldnames, &$datafkids, $metaphone=false, $method='and'){
		$maxchars = 6000;
		$maxmatches = 100;
		$matchcount = 0;
		$counter = 0;
		$refindex = 0;
		$matches = array();
		//$method = $metaphone ? 'or' : 'and';
		$findex = fopen($searchindex, "r");
		if(!$maxmatches > 0) $maxmatches = 9999;
		while($line = fgets($findex, $maxchars) and $matchcount < $maxmatches){
			if($counter > 0){
				if(searchterms_in_searchstring($searchterms, $line, $method, $metaphone)){
					$matches[$matchcount] = $line;
					$fieldvalues = explode(';', $line);
					$datafkids[$matchcount] = $fieldvalues[$refindex];
					$matchcount++;
				};
			} else {
				$fieldnames = $line;
				$refindex = get_field_index($fieldnames, 'PKID');
			};
			$counter++;
		};
		fclose($findex);
		return($matches);
	};

	function get_data($searchdata, $fkids, &$fieldnames){
		$maxchars = 6000;
		$counter = 0;
		$matchcount = 0;
		$matches = array();
		$fdata = fopen($searchdata, "r");
		while($line = fgets($fdata, $maxchars) and $matchcount <= sizeof($fkids)){
			if($counter > 0){
				$fkid = substr($line, 0, strpos($line, '{BOL}'));
				if(in_array($fkid, $fkids, true)){
					$matches[$matchcount] = $line;
					$matchcount++;
				};
			} else {
				$fieldnames = $line;
			};
			$counter++;
		};
		fclose($fdata);
		return($matches);
	};

	$searchindex = 'searchindex.txt';
	$searchdata = 'searchdata.txt';

	if(empty($_GET)) exit();
	$searchterm = urldecode(strval($_GET['searchterm']));
	if(empty($searchterm)) exit();

	$searchterms = explode('_20', $searchterm);
	for($i=0;$i<sizeof($searchterms);$i++){
		if(!empty($searchterms[$i])){
			$searchterms[$i] = trim($searchterms[$i]);
		};
	};

	/*
	$searchterms = explode(' ', $searchterm);
	for($i=0;$i<sizeof($searchterms);$i++){
		if(!empty($searchterms[$i])){
			$searchterms[$i] = SMEncodeURI(trim(utf8_decode($searchterms[$i])));
		};
	};
	*/

	$fieldnames = '';
	$datafkids = array();

	$rows = do_search($searchindex, $searchterms, $fieldnames, $datafkids, false, 'and');

	if(!(sizeof($rows)>0)){ // try or
		$rows = do_search($searchindex, $searchterms, $fieldnames, $datafkids, false, 'or');
	};

	if(!(sizeof($rows)>0)){ // try metaphone
		for($i=0;$i<sizeof($searchterms);$i++){
			if(!empty($searchterms[$i])){
				$searchterms[$i] = metaphone($searchterms[$i]);
			};
		};
		$rows = do_search($searchindex, $searchterms, $fieldnames, $datafkids, true, 'and');
	};

	echo $fieldnames . join('', $rows);
	$rows = get_data($searchdata, $datafkids, $fieldnames);
	echo "[SM_PRODUCTS_DATA]\n" . $fieldnames . join('', $rows);
?>