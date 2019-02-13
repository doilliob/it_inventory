<?php
	header('Content-type: application/json; charset=utf-8');
   	

	// init database
	include "../../config.php";
	include "../../initdb.php";

   	switch ( $_SERVER['REQUEST_METHOD'] ) {
   		case 'POST': 	create_element();  	break;
   		case 'GET':  	get_element(); 		break;
   		case 'PUT': 	update_element();	break;
   		case 'DELETE':	delete_element(); 	break;
   	}

   	// close database
    include "../../closedb.php";
	

    function create_element()
    {
    	
    	$args = json_decode(file_get_contents('php://input'));
    	$content;
    	foreach ($args as $key => $value) 
            if( isset($columns[$key]) )
                $content[$key] = $value;
    	
    	// get parametres
    	$lic_num = $content['lic_num']; 
    	$lic_name = $content['lic_name'];
    	$product_name = $content['product_name'];
    	$lic_count = $content['lic_count'];
        $class_id = $content['class_id'];
    	// query insert new
    	$query = " INSERT INTO licenses (lic_num, lic_name, product_name, lic_count,class_id)
    			   VALUES ('$lic_num','$lic_name','$product_name', $lic_count, $class_id) ";

    	mysql_query($query);

    	// get id
    	$id = mysql_insert_id();
    	// return JSON
    	echo json_encode(array( 'id' => $id ));    		
    }

	function get_element()
	{
	 	$id = substr($_SERVER['PATH_INFO'],1);
	    // get query
	    $query = "SELECT * FROM licenses WHERE id=$id LIMIT 1";
	    $result = mysql_query($query);
	 	// return result as JSON
	    echo json_encode(mysql_fetch_assoc($result),true);
	}

	function update_element()
	{
		// get id
	    $id = substr($_SERVER['PATH_INFO'],1);
	    // get args from stream
		$args = json_decode(file_get_contents('php://input'));
    	$content;
    	foreach ($args as $key => $value) 
            if( isset($columns[$key]) )
                $content[$key] = $value;
		// get parametres
    	$lic_num = $content['lic_num']; 
    	$lic_name = $content['lic_name'];
    	$product_name = $content['product_name'];
    	$lic_count = $content['lic_count'];
        $class_id = $content['class_id'];
		// make query
		$query = "UPDATE licenses SET 
				  lic_num='$lic_num',
    			  lic_name='$lic_name',
    			  product_name='$product_name',
    			  lic_count=$lic_count,
                  class_id=$class_id
    			  WHERE id=$id ";  
    	mysql_query($query);

    	// return JSON
    	echo json_encode(array());  
	}

	function delete_element()
	{
		// get id
	    $id = substr($_SERVER['PATH_INFO'],1);
		// make query
		$query = "DELETE FROM licenses WHERE id=$id ";
		mysql_query($query);

		echo json_encode(array());

	}


 	


    




?>