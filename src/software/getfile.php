<?php
	include "../config.php";
	include "../initdb.php";

	// Turn off warnings
    error_reporting(E_ERROR);

	function resize($blob_binary, $desired_width, $desired_height) { // simple function for resizing images to specified dimensions from the request variable in the url
	    $im = imagecreatefromstring($blob_binary);
	    $new = imagecreatetruecolor($desired_width, $desired_height) or exit("bad url");
	    $x = imagesx($im);
	    $y = imagesy($im);
	    imagecopyresampled($new, $im, 0, 0, 0, 0, $desired_width, $desired_height, $x, $y) or exit("bad url");
	    imagedestroy($im);
	    header("Content-Type: image/jpeg"); 
	    echo imagejpeg($new);
	    // or exit("bad url");
	    //echo $new;
	}

	$id = $_GET['id'];
	$query = "SELECT filename,filetype,filesize FROM software_uploads WHERE id=$id  LIMIT 1"; 
 	$result = mysql_query($query);
 	
 	$type = mysql_result($result,0,"filetype"); 
 	$filename = mysql_result($result,0,"filename"); 
 	$size = mysql_result($result,0,"filesize"); 
 	
 	$query = "SELECT file_data FROM software_uploads_data WHERE id=$id LIMIT 1"; 
 	$result = mysql_query($query);
 	$data = mysql_result($result,0,"file_data"); 

 	if( isset($_GET['small']) )
 	{
 		resize($data,150,150);
 	}else{
 	 	header("Content-Type: $type"); 
 		header("Content-Length: $size");
		header("Content-Disposition: attachment; filename=\"$filename\"");
 		echo $data; 
 	}

 	include "../closedb.php";
?>