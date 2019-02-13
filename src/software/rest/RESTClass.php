<?php

include '../../config.php';
include '../../initdb.php';

class RESTClass {
	// debug
	private $debug = true;
	private $id;
	private $rest_object;
	private $table_name;

	function __construct()
	{
		// Turn off warnings
		error_reporting(E_ERROR);

		// Get JSON structure
		$this->rest_object = array();
		$request = json_decode(file_get_contents('php://input'));

		foreach ($request as $key => $value) {
			$this->rest_object[$key] = $value;
		}

		// Get tail of request table_name/[:id]
		$params = explode('/',substr($_SERVER['PATH_INFO'],1)); 
		$this->id = $params[1];
		$this->table_name = '`' . $params[0] . '`';
		unset($params);

		// Unsetting in JSON
		if(isset($this->rest_object['id']))
			unset($this->rest_object['id']);

	}

	// Main router func
	public function Start()
	{
		// JSON header
		header('Content-Type: application/json; charset=utf-8');
		
		// Switch Request
		switch($_SERVER['REQUEST_METHOD'])
		{
	    	case 'POST':   $this->create_node(); break;
	    	case 'GET':    $this->get_node(); break;
	    	case 'PUT':    $this->update_node(); break;
	    	case 'DELETE': $this->delete_node(); break;
		}
	} // -- Start

	private function reconstruct_rest()
	{
		foreach ($this->rest_object as $key => $value)
			if(!is_numeric($value))
				$this->rest_object[$key] = "'" . $value . "'";
	}

	private function create_node($message)
	{	
		$this->reconstruct_rest(); 
			
		$query = "INSERT INTO $this->table_name 
						(".implode(",",array_keys($this->rest_object)).") 
					VALUES (".implode(",", array_values($this->rest_object)).")";
		$result = mysql_query($query) or file_put_contents("log.log", $answer . "Query: ".$query." Error: ".mysql_error());
		$id = mysql_insert_id();
		echo json_encode(array("id" => $id));
	}

	private function get_node()
	{
		if(!is_numeric($this->id))
		{
			$query = "SELECT * FROM $this->table_name ORDER BY id"; 
			$result = mysql_query($query) or die(mysql_error()); //file_put_contents("log.log", "Query: ".$query." Error: ".mysql_error());
			$rows = array();
			while($row = mysql_fetch_assoc($result))
				array_push($rows, $row);
			echo json_encode($rows);
			return;
		}
		$query = "SELECT * FROM $this->table_name WHERE id=$this->id LIMIT 1";
		$result = mysql_query($query) or file_put_contents("log.log", "Query: ".$query." Error: ".mysql_error());
		$content = mysql_fetch_assoc($result);
		echo json_encode($content);
	}

	private function update_node() 
	{	
		$this->reconstruct_rest(); 
		$query = "UPDATE $this->table_name SET ";
		$means = array();
		foreach ($this->rest_object as $key => $value) 
		 	array_push($means, $key."=".$value);
		 $query .= implode(",", $means)." WHERE id=$this->id";	
		 echo $query;
		$result = mysql_query($query) or file_put_contents("log.log", "Query: ".$query." Error: ".mysql_error());
		echo json_encode(array());
	}

	private function delete_node()
	{
		$result = mysql_query("DELETE FROM $this->table_name WHERE id=$this->id") or file_put_contents("log.log", "Query: ".$query." Error: ".mysql_error());
		echo json_encode(array());
	}

}

$rest = new RESTClass();
$rest->Start();

include '../../closedb.php';

?>