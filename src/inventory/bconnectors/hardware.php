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
        $columns = array('class_id' => true, 
                         'inventory_num' => false,
                         'model' => false,
                         'level' => false,
                         'floor' => false,
                         'description' => false,
                         'employee_id' => true,
                         'inventory_user' => true,
                         'present_alarm' => true );
    	
    	$args = json_decode(file_get_contents('php://input'));
    	$content;
    	foreach ($args as $key => $value) 
            if( isset($columns[$key]) )
                $content[$key] = $value;
    	

        foreach ($content as $key => $value)
            if( $columns[$key] == false)
                $content[$key] = "'".$value."'";

    	// query insert new
    	$query = "INSERT INTO hardware (".implode(',',array_keys($content)).")
    			   VALUES (".implode(',',array_values($content)).")";
    	mysql_query($query);   

    	// get id
    	$id = mysql_insert_id();
    	// return JSON
        $content["id"] = $id;
    	echo json_encode(array("id" => $id));    		
    }

	function get_element()
	{
	 	$id = substr($_SERVER['PATH_INFO'],1);
	    // get query
	    $query = "SELECT * FROM hardware WHERE id=$id LIMIT 1";
	    $result = mysql_query($query);
	 	// return result as JSON
	    echo json_encode(mysql_fetch_assoc($result),true);
	}

	function update_element()
	{
        $columns = array('class_id' => true, 
                         'inventory_num' => false,
                         'model' => false,
                         'level' => false,
                         'floor' => false,
                         'description' => false,
                         'employee_id' => true,
                         'inventory_user' => true,
                         'present_alarm' => true);

		// get id
	    $id = substr($_SERVER['PATH_INFO'],1);
	    // get args from stream
		$args = json_decode(file_get_contents('php://input'));
    	$content;
    	foreach ($args as $key => $value) 
            if( isset($columns[$key]) )
                $content[$key] = $value;

		foreach ($content as $key => $value)
            if( $columns[$key] == false)
                $content[$key] = "'".$value."'";
        // make query
		$query = "UPDATE hardware SET ";
        $arr = array();
        foreach ($content as $key => $value)
            array_push($arr, $key."=".$value);
        $query .= implode(',',$arr);
    	$query .= " WHERE id=$id ";  
    	mysql_query($query);

    	// return JSON
        $content["id"] = $id;
    	echo json_encode(array());  
	}

	function delete_element()
	{
		// get id
	    $id = substr($_SERVER['PATH_INFO'],1);
		// make query
		$query = "DELETE FROM hardware WHERE id=$id ";
		mysql_query($query);

		echo json_encode(array());

	}

?>