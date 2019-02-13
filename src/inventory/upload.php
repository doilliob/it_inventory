<?php
	include "../config.php";
	include "../initdb.php";

if( $_POST['UploadFile']) 
{
	// Обновляем информацию в базе
	$hw_id = $_POST['hw_id'];

	// Добавляем если есть файл в базу
	 if($_FILES['upload_file']['size'] > 0)
	{
		$fileName = $_FILES['upload_file']['name'];
		$tmpName  = $_FILES['upload_file']['tmp_name'];
		$fileSize = $_FILES['upload_file']['size'];
		$fileType = $_FILES['upload_file']['type'];
		
		$fileDesc = "Файл конфигурации оборудования";

		$fp      = fopen($tmpName, 'r');
		$content = fread($fp, filesize($tmpName));
		$content = addslashes($content);
		fclose($fp);

		if(!get_magic_quotes_gpc())
		{
		    $fileName = addslashes($fileName);
		}

		$query = "INSERT INTO uploads (filename, filesize, filetype, data, description, hardware_id) ".
		"VALUES ('$fileName', '$fileSize', '$fileType', '$content','$fileDesc',$hw_id)";

		mysql_query($query);
	}
	
}


	include "../closedb.php";
?>