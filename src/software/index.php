<?php
	
	echo '<div id="software"></div>';


	// adding to post action
	$post = '
				<!-- Underscore and Backbone.JS -->
				<script src="js/underscore.js"></script>
				<script src="js/backbone.js"></script>
				<!-- Datepicker -->
				<link rel="stylesheet" href="css/bootstrap-datepicker.css" />
				<script src="js/bootstrap-datepicker.min.js"></script>
				<script src="js/bootstrap-datepicker.ru.min.js"></script>
				<!-- jsTree -->
				<link rel="stylesheet" href="jstree/dist/themes/default/style.min.css" />
				<script type="text/javascript" src="js/jquery.form.js"></script>
				<script type="text/javascript" src="jstree/dist/jstree.js"></script>
				<!-- Main programm -->
				<script src="software/js/software-libs.js"></script>
				<script src="software/js/software-models.js"></script>
				<script src="software/js/software-collections.js"></script>
				<script src="software/js/software-views.js"></script>
				<script src="software/js/software-main.js"></script>

				
	';
    array_push($post_actions, $post);
?>