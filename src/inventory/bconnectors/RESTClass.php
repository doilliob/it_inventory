<?php
	
class RESTClass {
	//private $connection;
	private $columnes;
	private $id;
	private $rest_object;
	private $table_name;


	function __construct($tab_name,$cols)
	{
		// Turn off warnings
		error_reporting(E_ERROR);

		// Connect to DB
		//$this->connection = mysql_connect("localhost","ituser","123");
		//mysql_select_db("it-managment");
		//mysql_query("SET NAMES utf-8");
		
		// Set table & columnes
		$this->columnes = $cols;
		$this->table_name = $tab_name;

		// Get tail of request collection/[:id]
		$this->id = substr($_SERVER['PATH_INFO'],1); 

		// Get JSON structure
		$this->rest_object = array();
		$request = json_decode(file_get_contents('php://input'));
		foreach ($request as $key => $value) {
			$this->rest_object[$key] = $value;
		}

	}

	function __destruct()
	{
		$this->id = null;
		$this->rest_object = null;
		$this->table_name = null;
		$this->columnes = null;
		mysql_close($connection);
		$this->connection = null;
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
		foreach ($this->columnes as $key => $quote) 
			$this->rest_object[$key] = ($quote == true) ? "'".$this->rest_object[$key]."'" : $this->rest_object[$key];
	}

	private function create_node($message)
	{	
		$this->reconstruct_rest();

		$query = "INSERT INTO $this->table_name 
						(".implode(",",array_keys($this->rest_object)).") 
					VALUES (".implode(",", array_values($this->rest_object)).")";

		mysql_query($query) or file_put_contents("log.log", "Query: ".$query." Error: ".mysql_error());
		$id = mysql_insert_id();
		echo json_encode(array("id" => $id));
	}

	private function get_node()
	{
		if($this->id == "collection")
		{
			$query = "SELECT * FROM $this->table_name ORDER BY id";
			$result = mysql_query($query) or file_put_contents("log.log", "Query: ".$query." Error: ".mysql_error());
			$rows = array();
			while($row = mysql_fetch_assoc($result))
				array_push($rows, $row);
			echo json_encode($rows);
			return;
		}
		$query = "SELECT * FROM $this->table_name WHERE id=$this->id LIMIT 1";
		$result = mysql_query($query) or file_put_contents("log.log","Query: ".$query." Error: ".mysql_error());
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
		mysql_query($query) or file_put_contents("log.log",  "Query: ".$query." Error: ".mysql_error());
		echo json_encode(array());
	}

	private function delete_node()
	{
		mysql_query("DELETE FROM $this->table_name WHERE id=$this->id") 
			or file_put_contents("log.log", mysql_error());
		echo json_encode(array());
	}

}
?>