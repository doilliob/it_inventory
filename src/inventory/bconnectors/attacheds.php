<?php
	header('Content-type: application/json; charset=utf-8');
   	

	// init database
	include "../../config.php";
	include "../../initdb.php";

	$query = "SELECT id,description,filename,filesize,filetype,hardware_id,software_id FROM uploads";
	$result = mysql_query($query);

	$rows = array();
	while ($row = mysql_fetch_assoc($result))
		array_push($rows, $row);

	echo json_encode($rows,true);

   	// close database
    include "../../closedb.php";
?>