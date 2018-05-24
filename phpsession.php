<?php
	if($_POST){
		@session_start();
		
		@header("Cache-Control: no-cache, must-revalidate");
		@header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		
		$smethod = @$_POST['call'];
		$sbasket = @$_POST['basket'];
		
		if($smethod == 'save'){
			@$_SESSION['basket'] = @$sbasket;
			echo 'session' . 'Manager';
		} elseif($smethod == 'load') {
			if(isset($_SESSION['basket'])){
				echo @$_SESSION['basket'];
			} else {
				echo 'session' . 'Empty';
			};
		};
	};
?>