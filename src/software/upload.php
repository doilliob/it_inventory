<?php
	include "../config.php";
	include "../initdb.php";

if( $_POST['UploadFile']) 
{
	// Обновляем информацию в базе
	$sw_id = $_POST['software_id'];

	// Добавляем если есть файл в базу
	 if($_FILES['upload_file']['size'] > 0)
	{
		$fileName = $_FILES['upload_file']['name'];
		$tmpName  = $_FILES['upload_file']['tmp_name'];
		$fileSize = $_FILES['upload_file']['size'];
		$fileType = $_FILES['upload_file']['type'];
		
		$fileDesc = "Файл для программного обеспечения";

		$fp      = fopen($tmpName, 'r');
		$content = fread($fp, filesize($tmpName));
		$content = addslashes($content);
		fclose($fp);

		if(!get_magic_quotes_gpc())
		{
		    $fileName = addslashes($fileName);
		}

		$query = "INSERT INTO software_uploads (filename, filesize, filetype, description, software_id) " .
				 "VALUES ('$fileName', '$fileSize', '$fileType', '$fileDesc',$sw_id)";
		if(!mysql_query($query))
			echo mysql_error();
		echo $query;

		$id = mysql_insert_id();
		$query= "INSERT INTO software_uploads_data (file_id, file_data) VALUES ($id, '$content')";
		mysql_query($query);
	}
	
}


	include "../closedb.php";
?>