<?php
  include "../../config.php";
  include "../../initdb.php";
  include "RESTClass.php";


  $cols = array( "id" => false, 
  	  		 	"name" => true );
  $rClass = new RESTClass("organisations", $cols);
  $rClass->Start();





?>