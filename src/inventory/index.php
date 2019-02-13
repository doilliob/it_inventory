<?php
	
	echo '<div id="software"></div>';


	// adding to post action
	$post = '
				<!-- Underscore and Backbone.JS -->
				<script src="js/underscore.js"></script>
				<script src="js/backbone.js"></script>
				<!-- jsTree -->
				<link rel="stylesheet" href="jstree/dist/themes/default/style.min.css" />
				<script type="text/javascript" src="js/jquery.form.js"></script>
				<script type="text/javascript" src="jstree/dist/jstree.js"></script>
				<script src="inventory/js/inventory-libs.js"></script>
				<script src="inventory/js/inventory-models.js"></script>
				<script src="inventory/js/inventory-collections.js"></script>
				<script src="inventory/js/inventory-views.js"></script>
				<script src="inventory/js/inventory-main.js"></script>
	';

    array_push($post_actions, $post);
?>