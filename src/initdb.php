<?php
 $connection = mysql_connect( $__MYSQL_HOST, $__MYSQL_USER, $__MYSQL_PASS) or die(mysql_error());
 mysql_select_db($__MYSQL_DB);
 mysql_query("SET NAMES UTF8");
 ?>