<?php
	// Получение шаблонов
	$page = file_get_contents('templates/page.html');
	$menu = file_get_contents('templates/menu.html');
	$header_links = file_get_contents('templates/header-links.html') . file_get_contents($application_path . '/header-links.html');
	$index = file_get_contents($application_path . '/index.html');
	$footer_links = file_get_contents('templates/footer-links.html') . file_get_contents($application_path . '/footer-links.html'); 
	
	// Вставка шаблонов
	$page = str_replace('{{header-links}}', $header_links, $page);
	$page = str_replace('{{menu}}', $menu, $page);
	$page = str_replace('{{index}}', $index, $page);
	$page = str_replace('{{footer-links}}', $footer_links, $page);

	// вывод страницы
	echo $page;
?>
